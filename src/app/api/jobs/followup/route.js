import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { connectToDB } from '@lib/mongodb';
import FollowUp from "@models/followup";
import Job from "@models/jobtracking"; // Assuming your job model is named 'Job'

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

/**
 * GET: Fetch all pending follow-ups for the home screen
 */
export async function GET(request) {
  try {
    await connectToDB();
    const userData = await authenticate(request);
    if (!userData) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    // Fetch pending follow-ups for this user
    const upcomingTasks = await FollowUp.find({
      userId: userData.id,
      status: 'pending'
    })
    .sort({ followUpDateTime: 1 }) // Soonest first

    return NextResponse.json({
      success: true,
      count: upcomingTasks.length,
      tasks: upcomingTasks
    });

  } catch (error) {
    console.error("Error fetching follow-ups:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

/**
 * POST: Create a new follow-up
 * REQUIRES: A valid jobId in the body
 */
export async function POST(request) {
  try {
    await connectToDB();
    const userData = await authenticate(request);
    if (!userData) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { jobId, message, followUpDateTime, status } = body;

    // 1. STICKY RULE: Verify the job exists and belongs to the user
    if (!jobId) {
      return NextResponse.json({ error: "jobId is required to link a follow-up." }, { status: 400 });
    }

    const parentJob = await Job.findOne({ _id: jobId, userId: userData.id });
    
    if (!parentJob) {
      return NextResponse.json({ 
        error: "Parent job not found. You must have a valid job before creating a follow-up." 
      }, { status: 404 });
    }

    // 2. Create the follow-up using parent job metadata (Company & Position)
    // This ensures data consistency across your home screen
    const newFollowUp = await FollowUp.create({
      userId: userData.id,
      jobId: parentJob._id,
      companyName: parentJob.companyName, 
      position: parentJob.position,       
      message,
      followUpDateTime: new Date(followUpDateTime),
      status: status || 'pending'
    });

    return NextResponse.json({
      success: true,
      followUp: newFollowUp
    }, { status: 201 });

  } catch (error) {
    console.error("Error creating follow-up:", error);
    return NextResponse.json({ 
      error: "Failed to create follow-up", 
      details: error.message 
    }, { status: 500 });
  }
}