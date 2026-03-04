import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { connectToDB } from '@lib/mongodb';
import UserReferences from "@models/userreferences";
import Job from "@models/jobtracking.js";
import { Companyadminid } from '@/globalvar/companydetails';


const JWT_SECRET = process.env.JWT_SECRET || "SuperSecretKey";

// Shared Auth helper based on your Resume API logic
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

export async function GET(request) {
  try {
    await connectToDB();
    const { searchParams } = new URL(request.url);
    const mode = searchParams.get('mode'); // 'market' or 'tracker'

    
    const userData = await authenticate(request);
    if (!userData) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const targetId = mode === 'market' ? Companyadminid : userData.id;
    // Find user references and populate the jobs array
    const userRefs = await UserReferences.findOne({ userId: targetId }).populate('jobTrackingRefs');

    if (!userRefs || !userRefs.jobTrackingRefs) {
      return NextResponse.json({ success: true,jobs: [] });
    }

    // Sort jobs by newest first
    const sortedJobs = userRefs.jobTrackingRefs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return NextResponse.json({
      success: true,
      jobs: sortedJobs,
    });
  } catch (error) {
    console.error("Error fetching jobs:", error);
    return NextResponse.json({ error: "Failed to fetch jobs" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await connectToDB();
    const userData = await authenticate(req);
    if (!userData) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const jobData = await req.json();
    console.log(jobData);
    
    // Basic validation based on your Job Model requirements
    if (!jobData.companyName || !jobData.position) {
      return NextResponse.json({ error: "Company name and Position are required" }, { status: 400 });
    }
    const userRefs = await UserReferences.findOne({ userId: userData.id });
    const profileResumeId = jobData.resumeId ? jobData.resumeId : userRefs?.myProfileRef || null;
    // 1. Create the new Job record
    const newJob = await Job.create({
      ...jobData,
      userId: userData.id, // Ensure ownership
      resumeId: profileResumeId
    });

    // 2. Update UserReferences to include this job
    // Note: Ensure your UserReferences model has a 'jobRefs' field
    if (userRefs) {
      if (!userRefs.jobTrackingRefs) userRefs.jobTrackingRefs = [];
      userRefs.jobTrackingRefs.push(newJob._id);
      await userRefs.save();
    }

    return NextResponse.json({
      success: true,
      job: newJob
    }, { status: 201 });

  } catch (error) {
    console.error("Error creating job:", error);
    return NextResponse.json(
      { error: "Failed to create job application", details: error.message },
      { status: 500 }
    );
  }
}