import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { connectToDB } from '@lib/mongodb';
import Job from "@models/jobtracking.js";
import { Companyadminid } from '@/globalvar/companydetails';

const JWT_SECRET = process.env.JWT_SECRET || "SuperSecretKey";

// Shared Auth helper
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

// GET a single job by ID
export async function GET(request, { params }) {
  try {
    await connectToDB();
    const { id } = params;
    const userData = await authenticate(request);

    // Fetch the job and populate linked documents
    const job = await Job.findById(id)
      .populate('resumeId', 'name')
      .populate('coverLetterId', 'displayName');

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

// PATCH to update status or notes
export async function PATCH(request, { params }) {
  try {
    await connectToDB();
    const { id } = params;
    const userData = await authenticate(request);
    
    if (!userData) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    // Ensure the user owns the job before updating
    const job = await Job.findById(id);
    if (!job || job.userId.toString() !== userData.id) {
      return NextResponse.json({ error: "Job not found or unauthorized" }, { status: 403 });
    }

    const updatedJob = await Job.findByIdAndUpdate(
      id,
      { $set: body },
      { new: true, runValidators: true }
    ).populate('resumeId', 'name');

    return NextResponse.json(updatedJob);
  } catch (error) {
    console.error("Error updating job:", error);
    return NextResponse.json({ error: "Failed to update job" }, { status: 400 });
  }
}