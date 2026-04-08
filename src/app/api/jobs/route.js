import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { connectToDB } from '@lib/mongodb';
import UserReferences from "@models/userreferences";
import Job from "@models/jobtracking.js";
import { Companyadminid } from '@/globalvar/companydetails';
import { getToken } from 'next-auth/jwt';
import CoverLetter from '@models/coverletter';
import Resume from '@models/resume.js';


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
    
    // 1. Basic Validation
    if (!jobData.companyName || !jobData.position) {
      return NextResponse.json({ error: "Company name and Position are required" }, { status: 400 });
    }

    // 2. Resolve & Validate Resume Link
    const userRefs = await UserReferences.findOne({ userId: userData.id });
    let finalResumeId = jobData.resumeId || userRefs?.myProfileRef || null;

    // Security check: Ensure the chosen resume actually belongs to this user
    if (finalResumeId) {
      const resumeExists = await Resume.exists({ _id: finalResumeId, userId: userData.id });
      if (!resumeExists) finalResumeId = null; 
    }

    // 3. Create the Job
    const newJob = await Job.create({
      ...jobData,
      userId: userData.id,
      resumeId: finalResumeId,
      // coverLetterId will be handled if passed in jobData
    });

    // 4. Update Resume (One Resume -> Many Jobs)
    if (finalResumeId) {
      await Resume.findByIdAndUpdate(finalResumeId, {
        $addToSet: { jobs: newJob._id }
      });
    }

    // 5. Update Cover Letter (If linked during creation)
    if (newJob.coverLetterId) {
      await CoverLetter.findByIdAndUpdate(newJob.coverLetterId, {
        $addToSet: { jobs: newJob._id }
      });
    }

    // 6. Update UserReferences tracking
    await UserReferences.updateOne(
      { userId: userData.id },
      { $addToSet: { jobTrackingRefs: newJob._id } }
    );

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