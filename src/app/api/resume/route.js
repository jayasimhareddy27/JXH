import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { connectToDB } from '@lib/mongodb';
import UserReferences from "@models/userreferences";
import Resume from "@models/resume";
import { formatPrompts } from '@public/staticfiles/prompts/userdetailextraction';

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


export async function POST(req) {
  try {
    await connectToDB();
    const userData = await authenticate(req);
    if (!userData) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name,resumetextAireference } = await req.json();
    if (!name || name.trim() === "") {
      return NextResponse.json({ error: "Resume name is required" }, { status: 400 });
    }
    const userRef = await UserReferences.findOne({ userId: userData.id }) 

    const initialResume = await Resume.create({
      userId: userData.id,
      name: name, 

      personalInformation: { ...formatPrompts.personalInformation.initial,name: userData.name, email: userData.email },
      onlineProfiles: formatPrompts.onlineProfiles.initial,

      educationHistory: formatPrompts.educationHistory.initial,
      workExperience: formatPrompts.workExperience.initial,

      projects: formatPrompts.projects.initial,

      certifications: formatPrompts.certifications.initial,
      
      skillsSummary: formatPrompts.skillsSummary.initial,
      careerSummary: formatPrompts.careerSummary.initial,
      
      resumetextAireference: "",
    });


    if(resumetextAireference){
      initialResume.resumetextAireference = resumetextAireference;
    }

    // Create new Resume document with cloned data
    await initialResume.save();

    // Update UserReferences by adding new resume ref
    const userRefs = await UserReferences.findOne({ userId: userData.id });
    if (userRefs) {
      userRefs.resumeRefs.push(initialResume._id);
      await userRefs.save();
    }

    return NextResponse.json(initialResume);

  } catch (error) {
    console.error("Error creating resume:", error);
    return NextResponse.json(
      { error: "Failed to create resume", details: error.message },
      { status: 500 }
    );
  }
}
