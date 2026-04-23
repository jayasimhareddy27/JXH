import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { connectToDB } from '@lib/mongodb';
import UserReferences from "@models/userreferences";
import Resume from "@models/resume";
import { getToken } from 'next-auth/jwt';
import Job from "@models/jobtracking";

const JWT_SECRET = process.env.JWT_SECRET || "SuperSecretKey";

async function authenticate(request) {

  const session = await getToken({ 
    req: request, 
    secret: process.env.NEXTAUTH_SECRET 
  });

  if (session) {
    // If found, return the user data from the session
    return { id: session.id, email: session.email, name: session.name };
  }

  const authHeader = request.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) return null;

  const token = authHeader.substring(7);
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
}

// GET handler to fetch resume by ID
export async function GET(request, { params }) {
  try {
    await connectToDB();
    const userData = await authenticate(request);
    
    if (!userData) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const { id: resumeId } = await params;
        
    if (!resumeId) {
      return NextResponse.json({ error: "Resume ID is required" }, { status: 400 });
    }
    
    const resume = await Resume.findOne({
      _id: resumeId,
      userId: userData.id,
    });
    
    if (!resume) {
      return NextResponse.json({ error: "Resume not found" }, { status: 404 });
    }

    return NextResponse.json( resume );
  } catch (error) {
    console.error("Error fetching resume:", error);
    return NextResponse.json({ error: "Failed to fetch resume" }, { status: 500 });
  }
}


export async function DELETE(request, { params }) {
  try {
    await connectToDB();
    const userData = await authenticate(request);

    if (!userData) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: resumeId } = await params;

    // 1. Find and Delete the Resume (Ownership check included)
    const deletedResume = await Resume.findOneAndDelete({
      _id: resumeId,
      userId: userData.id,
    });

    if (!deletedResume) {
      return NextResponse.json({ error: "Resume not found" }, { status: 404 });
    }

    // 2. RELATIONSHIP CLEANUP: Update all Jobs linked to this Resume
    // We set their resumeId to null so they don't point to a deleted document
    await Job.updateMany(
      { resumeId: resumeId, userId: userData.id },
      { $set: { resumeId: null } }
    );

    // 3. Update UserReferences
    const userRefs = await UserReferences.findOne({ userId: userData.id });
    if (userRefs) {
      // Remove from the list of all resumes
      userRefs.resumeRefs = userRefs.resumeRefs.filter(
        (id) => id.toString() !== resumeId
      );

      // If this was the primary, AI, or Profile resume, reset those pointers
      if (userRefs.primaryResumeRef?.toString() === resumeId) userRefs.primaryResumeRef = null;
      if (userRefs.myProfileRef?.toString() === resumeId) userRefs.myProfileRef = null;
      if (userRefs.aiResumeRef?.toString() === resumeId) userRefs.aiResumeRef = null;

      await userRefs.save();
    }

    return NextResponse.json({ success: true, message: "Resume deleted and jobs unlinked" });
  } catch (error) {
    console.error("Error deleting resume:", error);
    return NextResponse.json({ error: "Failed to delete resume" }, { status: 500 });
  }
}

export async function PATCH(req, context) {
  try {
    await connectToDB();
    const { id: resumeId } = await context.params;
    const userData = await authenticate(req);

    if (!userData?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    if (!body || Object.keys(body).length === 0) {
      return NextResponse.json({ error: "No data provided" }, { status: 400 });
    }

    // 🚫 PROTECTION: Prevent manual tampering with the 'jobs' array via PATCH
    // The 'jobs' array should only be updated by the Job routes (One Job -> One Resume logic)
    const {
      _id,
      userId,
      jobs, // We strip this so users can't manually inject Job IDs here
      createdAt,
      updatedAt,
      __v,
      ...updateData
    } = body;

    const updatedResume = await Resume.findOneAndUpdate(
      { _id: resumeId, userId: userData.id },
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!updatedResume) {
      return NextResponse.json({ error: "Resume not found or unauthorized" }, { status: 404 });
    }

    return NextResponse.json(updatedResume);
  } catch (err) {
    console.error("Error updating resume:", err);
    return NextResponse.json({ error: "Failed to update resume" }, { status: 500 });
  }
}