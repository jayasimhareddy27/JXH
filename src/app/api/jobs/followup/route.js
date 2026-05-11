import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { connectToDB } from '@lib/mongodb';
import FollowUp from "@models/followup";
import Job from "@models/jobtracking";
import { getToken } from 'next-auth/jwt';

const JWT_SECRET = process.env.JWT_SECRET || "SuperSecretKey";

async function authenticate(request) {
  const session = await getToken({ 
    req: request, 
    secret: process.env.NEXTAUTH_SECRET 
  });

  if (session) {
    return { id: session.id || session.sub, email: session.email, name: session.name };
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
    const user = await authenticate(request);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const jobId = searchParams.get('jobId');

    let query = { userId: user.id };
    if (jobId) query.jobId = jobId;

    const followUps = await FollowUp.find(query).sort({ followUpDateTime: 1 });
    return NextResponse.json({ followUps });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}


export async function POST(request) {
  try {
    await connectToDB();
    const user = await authenticate(request);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    const { jobId, message, followUpDateTime, status } = body;

    if (!jobId) {
      return NextResponse.json({ error: "jobId is required." }, { status: 400 });
    }

    // Verify job ownership
    const parentJob = await Job.findOne({ _id: jobId, userId: user.id });
    if (!parentJob) {
      return NextResponse.json({ error: "Parent job not found." }, { status: 404 });
    }

    const newFollowUp = await FollowUp.create({
      userId: user.id,
      jobId: parentJob._id,
      companyName: parentJob.companyName, 
      position: parentJob.position,       
      message,
      followUpDateTime: new Date(followUpDateTime),
      status: status || 'pending'
    });

    return NextResponse.json({ success: true, followUp: newFollowUp }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(request) {
  try {
    await connectToDB();
    const user = await authenticate(request);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id'); // e.g., /api/jobs/followup?id=...
    const updates = await request.json();

    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

    const updatedFollowUp = await FollowUp.findOneAndUpdate(
      { _id: id, userId: user.id },
      { $set: updates },
      { new: true }
    );

    if (!updatedFollowUp) return NextResponse.json({ error: "Not found" }, { status: 404 });

    return NextResponse.json({ success: true, followUp: updatedFollowUp });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}


export async function DELETE(request) {
  try {
    await connectToDB();
    const user = await authenticate(request);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

    const deleted = await FollowUp.findOneAndDelete({ _id: id, userId: user.id });

    if (!deleted) return NextResponse.json({ error: "Not found" }, { status: 404 });

    return NextResponse.json({ success: true, message: "Deleted successfully" });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}