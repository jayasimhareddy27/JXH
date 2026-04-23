import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { connectToDB } from '@lib/mongodb';
import UserReferences from "@models/userreferences";
import CoverLetter from "@models/coverletter";
import Job from "@models/jobtracking";
import { getToken } from 'next-auth/jwt';

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

// GET: Fetch a single cover letter by ID
export async function GET(request, { params }) {
  try {
    await connectToDB();
    const userData = await authenticate(request);
    
    if (!userData) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const { id: coverletterId } = await params;
        
    if (!coverletterId) {
      return NextResponse.json({ error: "Cover letter ID is required" }, { status: 400 });
    }
    
    const coverLetter = await CoverLetter.findOne({
      _id: coverletterId,
      userId: userData.id,
    });
    
    if (!coverLetter) {
      return NextResponse.json({ error: "Cover letter not found" }, { status: 404 });
    }

    return NextResponse.json(coverLetter);
  } catch (error) {
    console.error("Error fetching cover letter:", error);
    return NextResponse.json({ error: "Failed to fetch cover letter" }, { status: 500 });
  }
}

// DELETE: Remove cover letter and update user references
export async function DELETE(request, { params }) {
  try {
    await connectToDB();
    const userData = await authenticate(request);

    if (!userData) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: coverletterId } = await params;
    if (!coverletterId) {
      return NextResponse.json({ error: "Cover letter ID is required" }, { status: 400 });
    }

    // 1. Find and Delete the Cover Letter (Ownership check)
    const deletedCoverLetter = await CoverLetter.findOneAndDelete({
      _id: coverletterId,
      userId: userData.id,
    });

    if (!deletedCoverLetter) {
      return NextResponse.json({ error: "Cover letter not found" }, { status: 404 });
    }

    // 2. RELATIONSHIP CLEANUP: Update all Jobs linked to this Cover Letter
    // This prevents "dead" links in your Job tracker
    await Job.updateMany(
      { coverLetterId: coverletterId, userId: userData.id },
      { $set: { coverLetterId: null } }
    );

    // 3. Update UserReferences (Global tracking)
    // Using atomic $pull is faster than fetching and filtering
    await UserReferences.updateOne(
      { userId: userData.id },
      { 
        $pull: { coverLetterRefs: coverletterId } 
      }
    );

    return NextResponse.json({ success: true, message: "Cover letter deleted and jobs unlinked" });
  } catch (error) {
    console.error("Error deleting cover letter:", error);
    return NextResponse.json({ error: "Failed to delete cover letter" }, { status: 500 });
  }
}

export async function PATCH(req, context) {
  try {
    await connectToDB();
    const { id: coverletterId } = await context.params;

    const userData = await authenticate(req);
    if (!userData?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    if (!body || Object.keys(body).length === 0) {
      return NextResponse.json({ error: "No data provided to update." }, { status: 400 });
    }

    const {
      _id,
      userId,
      jobs, 
      createdAt,
      updatedAt,
      __v,
      ...updateData
    } = body;

    const updatedCoverLetter = await CoverLetter.findOneAndUpdate(
      { _id: coverletterId, userId: userData.id },
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!updatedCoverLetter) {
      return NextResponse.json({ error: "Cover letter not found or unauthorized." }, { status: 404 });
    }

    return NextResponse.json(updatedCoverLetter);
  } catch (err) {
    console.error("Error updating cover letter:", err);
    return NextResponse.json(
      { error: err.message || "Failed to update cover letter." },
      { status: 500 }
    );
  }
}