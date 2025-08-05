import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { connectToDB } from '@lib/mongodb';
import FullUserProfile from '@models/userprofile';
import Resume from '@models/resume';
import UserReferences from "@models/userreferences";

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
  await connectToDB();
  const userData = await authenticate(request);
  if (!userData) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  const profile = await FullUserProfile.findOne({ userId: userData.id });
  if (!profile) {
    return NextResponse.json({ message: 'Profile not found' }, { status: 404 });
  }
  

  return NextResponse.json({ success: true, profile });
}

export async function PUT(request) {
  await connectToDB();
  const userData = await authenticate(request);
  if (!userData) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const rawData = await request.json();
    let profile = await FullUserProfile.findOne({ userId: userData.id });
    if (!profile) {
      profile = new FullUserProfile({ userId: userData.id, ...rawData });
    } else {
      Object.assign(profile, rawData);
    }

    
    const resumeData = {
      userId: userData.id,
      name: 'Default Resume by JXH',
      personalInformation: profile.personalInformation || {},
      onlineProfiles: profile.onlineProfiles || {},
      educationHistory: profile.educationHistory || [],
      workExperience: profile.workExperience || [],
      projects: profile.projects || [],
      certifications: profile.certifications || [],
      skillsSummary: profile.skillsSummary || {},
      careerSummary: profile.careerSummary || {},
      addressDetails: profile.addressDetails || {},
    };
    
    let resume = await Resume.findOne({ userId: userData.id, name: 'Default Resume by JXH' });
    if (!resume) {
      resume = new Resume(resumeData);
    } else {
      Object.assign(resume, resumeData);
    }
    
    let references = await UserReferences.findOne({ userId: userData.id });
    if (!references) {
      references = new UserReferences({
        userId: userData.id,
        resumeRefs: [resume._id],
        primaryResumeRef: resume._id,
        userDataRef: profile._id,
      });
    } else {
      if (!references.resumeRefs.includes(resume._id)) {
        references.resumeRefs.push(resume._id);
      }
      references.userDataRef = profile._id;
      if (!references.primaryResumeRef) {
        references.primaryResumeRef = resume._id;
      }
    }

    await Promise.all([profile.save(), resume.save(), references.save()]);

    return NextResponse.json({ 
      success: true, 
      profile, 
      resume, 
      references 
    });


    return NextResponse.json({ success: true, profile, resume  });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to save profile' }, { status: 500 });
  }
}

