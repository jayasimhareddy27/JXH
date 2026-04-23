import { NextResponse } from 'next/server';
import { connectToDB } from '@lib/mongodb';
import UserReferences from '@models/userreferences';
import jwt from 'jsonwebtoken';
import { getToken } from "next-auth/jwt";

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
    await connectToDB();
    
    const userData = await authenticate(request);
    
    if (!userData) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const references = await UserReferences.findOne({ userId: userData.id });
    
    return NextResponse.json({ 
        success: true, 
        references: references,
        theme: references?.theme || 'light'
    });
}

export async function PUT(request) {
  await connectToDB();
  const userData = await authenticate(request);
  
  if (!userData) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  try {
    const body = await request.json();
    
    // Use destructuring to capture all possible incoming fields
    const { 
      primaryResumeRef, // Changed from primaryResumeId to match your schema keys
      theme, 
      aiResumeRef, 
      myProfileRef, 
      favResumeTemplateId, 
      favCoverletterTemplateId,
      newAiKey,
      activeProfileData,
      setAsPrimary
    } = body;

    const userRefs = await UserReferences.findOne({ userId: userData.id });
    if (!userRefs) {
      return NextResponse.json({ error: 'User references not found' }, { status: 404 });
    }

    // 1. IMPROVED VALIDATION: Use 'in' check to allow setting fields to null
    const updateFields = [
      'primaryResumeRef', 'theme', 'aiResumeRef', 'myProfileRef', 
      'favResumeTemplateId', 'favCoverletterTemplateId', 'newAiKey',
      'activeProfileData', 'setAsPrimary'
    ];
    
    const hasUpdate = updateFields.some(field => field in body);

    if (!hasUpdate) {
      return NextResponse.json({ error: 'No valid fields provided for update' }, { status: 400 });
    }

    if (activeProfileData) {
      let profileId = activeProfileData._id;
      let dbProfile;

      const isValidMongoId = profileId && /^[0-9a-fA-F]{24}$/.test(profileId);

      if (isValidMongoId) {
        dbProfile = await UserData.findByIdAndUpdate(
          profileId,
          { ...activeProfileData, userId: userData.id },
          { new: true, upsert: true }
        );
      } else {
        const newProfile = new UserData({
          ...activeProfileData,
          _id: undefined, 
          userId: userData.id
        });
        dbProfile = await newProfile.save();
        profileId = dbProfile._id;
      }

      // Add to array if it's a new reference
      if (!userRefs.userDataRefs.includes(profileId)) {
        userRefs.userDataRefs.push(profileId);
      }

      // Handle Primary Pointer
      if (setAsPrimary || !userRefs.primaryUserDataRef) {
        userRefs.primaryUserDataRef = profileId;
      }
    }

    // 2. Map updates (Ensures we use the correct schema key names)
    if ('primaryResumeRef' in body) userRefs.primaryResumeRef = primaryResumeRef;
    if ('aiResumeRef' in body) userRefs.aiResumeRef = aiResumeRef;
    if ('theme' in body) userRefs.theme = theme;
    if ('myProfileRef' in body) userRefs.myProfileRef = myProfileRef;
    if ('favResumeTemplateId' in body) userRefs.favResumeTemplateId = favResumeTemplateId;
    if ('favCoverletterTemplateId' in body) userRefs.favCoverletterTemplateId = favCoverletterTemplateId;

    // 3. AI Key Logic (Using $addToSet logic internally via push)
    if (newAiKey) {
      const { agent, provider, apiKey } = newAiKey;
      if (provider !== 'ChromeAI' && apiKey) {
        // Prevent duplicate keys for the same agent/provider
        const exists = userRefs.aiKeys.find(k => k.agent === agent && k.provider === provider);
        if (exists) {
          exists.apiKey = apiKey; // Update existing
        } else {
          userRefs.aiKeys.push({ agent, provider, apiKey });
        }
      }
    }
      
    // 4. Save
    await userRefs.save();

    return NextResponse.json({ 
      success: true, 
      references: userRefs 
    });

  } catch (error) {
    console.error("PUT Error:", error);
    return NextResponse.json({ error: 'Failed to update user references' }, { status: 500 });
  }
}