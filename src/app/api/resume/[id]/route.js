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
    return null
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

    const {id:resumeId} =await params;
    if (!resumeId) {
      return NextResponse.json({ error: "Resume ID is required" }, { status: 400 });
    }

    const deletedResume = await Resume.findOneAndDelete({
      _id: resumeId,
      userId: userData.id,
    });

    if (!deletedResume) {
      return NextResponse.json({ error: "Resume not found" }, { status: 404 });
    }

    const userRefs = await UserReferences.findOne({ userId: userData.id });
    if (userRefs) {
      userRefs.resumeRefs = userRefs.resumeRefs.filter(
        (id) => id.toString() !== resumeId
      );

      if (userRefs.primaryResumeRef?.toString() === resumeId) {
        userRefs.primaryResumeRef = null;
      }

      await userRefs.save();
    }

    return NextResponse.json({ success: true, deletedResume });
  } catch (error) {
    console.error("Error deleting resume:", error);
    return NextResponse.json({ error: "Failed to delete resume" }, { status: 500 });
  }
}



export async function PATCH(req, context) {
  const { id: resumeId } = await context.params; // ✅ REQUIRED by Next.js

  try {
    await connectToDB();

    // 🔐 Get authenticated user
    const userData = await authenticate(req);
    if (!userData?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // 📦 Parse body
    const body = await req.json();

    if (!body || Object.keys(body).length === 0) {
      return NextResponse.json(
        { error: "No data provided to update." },
        { status: 400 }
      );
    }

    // 🚫 Strip immutable / forbidden fields
    const {
      _id,
      userId,
      createdAt,
      updatedAt,
      __v,
      ...updateData
    } = body;

    // 📝 Update resume
    const updatedResume = await Resume.findOneAndUpdate(
      { _id: resumeId, userId: userData.id },
      { $set: updateData },
      { new: true }
    );

    if (!updatedResume) {
      return NextResponse.json(
        { error: "Resume not found or unauthorized." },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedResume);
  } catch (err) {
    console.error("Error updating resume:", err);
    return NextResponse.json(
      { error: err.message || "Failed to update resume." },
      { status: 500 }
    );
  }
}