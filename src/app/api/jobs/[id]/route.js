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

    // Fields that must NEVER be updated from client
    const PROTECTED_FIELDS = [
      "_id",
      "userId",
      "createdAt",
      "updatedAt"
    ];

    // Remove protected fields if present
    for (const field of PROTECTED_FIELDS) {
      if (field in updates) {
        delete updates[field];
      }
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        { error: "No valid fields to update" },
        { status: 400 }
      );
    }

    // Ownership check
    const job = await Job.findById(id);
    if (!job || job.userId.toString() !== userData.id) {
      return NextResponse.json(
        { error: "Job not found or unauthorized" },
        { status: 403 }
      );
    }

    const updatedJob = await Job.findByIdAndUpdate(
      id,
      { $set: updates },
      {
        new: true,
        runValidators: true
      }
    );

    return NextResponse.json({
      success: true,
      job: updatedJob
    });
  } catch (error) {
    console.error("Error updating job:", error);
    return NextResponse.json(
      { error: "Failed to update job" },
      { status: 500 }
    );
  }
}
