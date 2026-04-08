import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { connectToDB } from '@lib/mongodb';
import UserReferences from "@models/userreferences";
import Resume from "@models/resume";
import { resumeformatPrompts } from '@public/prompts/resume/schema';
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
      aiResumeRef: userRefs.aiResumeRef || null,
      myProfileRef: userRefs.myProfileRef || null,
    });
  } catch (error) {
    console.error("Error fetching resumes:", error);
    return NextResponse.json(
      { error: "Failed to fetch resumes" },
      { status: 500 }
    );
  }
}


export async function POST(req) {
  try {
    await connectToDB();
    const userData = await authenticate(req);
    
    if (!userData) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name, resumetextAireference } = await req.json();
    
    if (!name || name.trim() === "") {
      return NextResponse.json({ error: "Resume name is required" }, { status: 400 });
    }

    // Create the resume in one go
    const newResume = await Resume.create({
      userId: userData.id,
      name: name,
      // Initialize the jobs array for your new relationship logic
      jobs: [], 

      personalInformation: { 
        ...resumeformatPrompts.personalInformation.initial,
        name: userData.name || "", 
        email: userData.email || "" 
      },
      
      onlineProfiles: resumeformatPrompts.onlineProfiles.initial,
      educationHistory: resumeformatPrompts.educationHistory.initial,
      workExperience: resumeformatPrompts.workExperience.initial,
      projects: resumeformatPrompts.projects.initial,
      certifications: resumeformatPrompts.certifications.initial,
      skillsSummary: resumeformatPrompts.skillsSummary.initial,
      careerSummary: resumeformatPrompts.careerSummary.initial,
      
      // Handle the AI reference string directly
      resumetextAireference: resumetextAireference || "",
    });

    // Update UserReferences
    const userRefs = await UserReferences.findOne({ userId: userData.id });
    if (userRefs) {
      // Use $addToSet to prevent duplicate references by mistake
      await UserReferences.updateOne(
        { userId: userData.id },
        { $addToSet: { resumeRefs: newResume._id } }
      );
    }

    return NextResponse.json(newResume, { status: 201 });

  } catch (error) {
    console.error("Error creating resume:", error);
    return NextResponse.json(
      { error: "Failed to create resume", details: error.message },
      { status: 500 }
    );
  }
}