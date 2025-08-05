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
    return null;
  }
}

export async function GET(request) {
  try {
    await connectToDB();
    const userData = await authenticate(request);

    if (!userData) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
    
  const userRefs = await UserReferences.findOne({ userId: userData.id })
  .populate('resumeRefs')
  .populate('primaryResumeRef');

 
    if (!userRefs) {
      return NextResponse.json({
        success: true,
        count: 0,
        resumes: [],
        primaryResumeId: null,
      });
    }

    return NextResponse.json({
      success: true,
      count: userRefs.resumeRefs.length,
      resumes: userRefs.resumeRefs.sort((a, b) =>   new Date(b.updatedAt) - new Date(a.updatedAt)),
      primaryResumeId: userRefs.primaryResumeRef?._id || null,
    });
  } catch (error) {
    console.error("Error fetching resumes:", error);
    return NextResponse.json(
      { error: "Failed to fetch resumes" },
      { status: 500 }
    );
  }
}

