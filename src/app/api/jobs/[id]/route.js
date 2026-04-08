import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { connectToDB } from '@lib/mongodb';
import Job from "@models/jobtracking.js";
import { Companyadminid } from '@/globalvar/companydetails';
import { getToken } from 'next-auth/jwt';
import Resume from '@models/resume.js';
import CoverLetter from '@models/coverletter';

const JWT_SECRET = process.env.JWT_SECRET || "SuperSecretKey";

// Shared Auth helper
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

// GET a single job by ID
export async function GET(request, { params }) {
  try {
    await connectToDB();
    const userData = await authenticate(request);

    if (!userData) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const {id}  = await params;
    if (!id) {
      return NextResponse.json({ error: "Job ID is required" }, { status: 400 });
    }
    // Fetch the job and populate linked documents
    const job = await Job.findById(id)

    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    // Security check: Allow access if it's the owner OR if it's a marketplace job (Companyadminid)
    const isOwner = userData && job.userId.toString() === userData.id;
    const isMarketJob = job.userId.toString() === Companyadminid;

    if (!isOwner && !isMarketJob) {
      return NextResponse.json({ error: "Unauthorized access to this job" }, { status: 401 });
    }

    return NextResponse.json({ success: true, job });
  } catch (error) {
    console.error("Error fetching job details:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// PATCH — Common job update route (future-proof)
export async function PATCH(request, { params }) {
  try {
    await connectToDB();
    const { id } = await params;
    const userData = await authenticate(request);

    if (!userData) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const updates = await request.json();
    const job = await Job.findById(id);

    // 1. Ownership check for the JOB
    if (!job || job.userId.toString() !== userData.id) {
      return NextResponse.json({ error: "Job not found or unauthorized" }, { status: 403 });
    }

    // 2. Handle Resume Relationship Swap (Improved)
    // Check if resumeId is in the updates (even if it's null)
    if ("resumeId" in updates && updates.resumeId !== job.resumeId?.toString()) {
      
      // A. Validate the NEW resume belongs to this user (if it's not null)
      if (updates.resumeId) {
        const newResume = await Resume.findOne({ _id: updates.resumeId, userId: userData.id });
        if (!newResume) {
          return NextResponse.json({ error: "Target Resume not found or unauthorized" }, { status: 403 });
        }
      }

      // B. Remove Job ID from the OLD resume's array
      if (job.resumeId) {
        await Resume.findByIdAndUpdate(job.resumeId, { $pull: { jobs: id } });
      }

      // C. Add Job ID to the NEW resume's array (if it's not null)
      if (updates.resumeId) {
        await Resume.findByIdAndUpdate(updates.resumeId, { $addToSet: { jobs: id } });
      }
    }
// 3. Handle Cover Letter Relationship Swap
  if ("coverLetterId" in updates && updates.coverLetterId !== job.coverLetterId?.toString()) {
      // Validate the NEW cover letter (if not null)
      if (updates.coverLetterId) {
        const hasCL = await CoverLetter.exists({ _id: updates.coverLetterId, userId: userData.id });
        if (!hasCL) return NextResponse.json({ error: "Target Cover Letter unauthorized" }, { status: 403 });
      }
      // Remove Job ID from the OLD cover letter
      if (job.coverLetterId) {
        await CoverLetter.findByIdAndUpdate(job.coverLetterId, { $pull: { jobs: id } });
      }
      // Add Job ID to the NEW cover letter
      if (updates.coverLetterId) {
        await CoverLetter.findByIdAndUpdate(updates.coverLetterId, { $addToSet: { jobs: id } });
      }
    }
    // 3. Protection & Cleanup
    const PROTECTED_FIELDS = ["_id", "userId", "createdAt", "updatedAt"];
    PROTECTED_FIELDS.forEach(field => delete updates[field]);

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: "No valid fields to update" }, { status: 400 });
    }

    // 4. Final Update
    const updatedJob = await Job.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, runValidators: true }
    );

    return NextResponse.json({ success: true, job: updatedJob });
    
  } catch (error) {
    console.error("Error updating job:", error);
    return NextResponse.json({ error: "Failed to update job" }, { status: 500 });
  }
}