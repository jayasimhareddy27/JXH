import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { connectToDB } from '@lib/mongodb';
import UserReferences from "@models/userreferences";
import Resume from "@models/resume";
import FullUserProfile from '@models/userprofile';

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

    const { name } = await req.json();
    if (!name || name.trim() === "") {
      return NextResponse.json({ error: "Resume name is required" }, { status: 400 });
    }
    const profile = await FullUserProfile.findOne({ userId: userData.id });
    
    const resumeData = {
      userId: userData.id,
      name: name.trim(), // ✅ user-supplied, not hardcoded
      personalInformation: profile?.personalInformation? {
        fullName: `${profile.personalInformation.firstName || ''} ${profile.personalInformation.lastName || ''}`.trim(),
        email: profile.personalInformation.email || '',
        phoneNumber: profile.personalInformation.phoneNumber || ''}
        : { fullName: '', email: '', phoneNumber: '' },
      onlineProfiles: profile?.onlineProfiles ? {
        linkedin: profile.onlineProfiles.linkedin || '',
        github: profile.onlineProfiles.github || '',
        portfolio: profile.onlineProfiles.portfolio || '',
      } : {linkedin:'', github:'', portfolio:''},
      educationHistory: profile?.educationHistory || [],
      workExperience: profile?.workExperience || [],
      projects: profile?.projects || [],
      certifications: profile?.certifications || [],
      skillsSummary: profile?.skillsSummary || {},
      careerSummary: profile?.careerSummary || {},
      sectionTitles: profile?.sectionTitles?.slice(0, 8) || [], // ✅ only first 8
    };

    

    // 2. Create Resume
    const newResume = await Resume.create(resumeData);

    // 3. Attach to UserReferences
    let userRefs = await UserReferences.findOne({ userId: userData.id });

    if (!userRefs) {
      userRefs = await UserReferences.create({
        userId: userData.id,
        resumeRefs: [newResume._id],
        primaryResumeRef: newResume._id, // First resume becomes primary
      });
    } else {
      userRefs.resumeRefs.push(newResume._id);

      if (!userRefs.primaryResumeRef) {
        userRefs.primaryResumeRef = newResume._id;
      }

      await userRefs.save();
    }

    return NextResponse.json({ _id: newResume._id }, { status: 201 });
  } catch (error) {
    console.error("Error creating resume:", error);
    return NextResponse.json(
      { error: "Failed to create resume", details: error.message },
      { status: 500 }
    );
  }
}
