import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { connectToDB } from '@lib/mongodb';
import UserReferences from "@models/userreferences";
import Resume from "@models/resume";

const JWT_SECRET = process.env.JWT_SECRET || "SuperSecretKey";

async function authenticate(request) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) return null;

  const token = authHeader.substring(7);
  
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
}

export async function DELETE(request, { params }) {
  await connectToDB();
  const userData = await authenticate(request);
  
  if (!userData) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const resumeId = params.id;

    const deletedResume = await Resume.findOneAndDelete({
      _id: resumeId,
      userId: userData.id,
    });

    if (!deletedResume) {
      return NextResponse.json({ error: "Resume not found" }, { status: 404 });
    }
    
    // Update references
    const userRefs = await UserReferences.findOne({ userId: userData.id });
    if (userRefs) {
      userRefs.resumeRefs = userRefs.resumeRefs.filter(
        (id) => id.toString() !== resumeId
      );

      if (userRefs.primaryResumeRef?.toString() === resumeId) {
        userRefs.primaryResumeRef = null; // Reset primary if deleted
      }

      await userRefs.save();
    }

    return NextResponse.json({ success: true, deletedResume });
  } catch (error) {
    console.error(" Error deleting resume:", error);
    return NextResponse.json({ error: "Failed to delete resume" }, { status: 500 });
  }
}