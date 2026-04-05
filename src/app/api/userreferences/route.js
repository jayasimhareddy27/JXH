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
      console.log("Unauthorized access attempt to /api/userreferences");
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
    const { 
      primaryResumeId, 
      theme, 
      aiResumeRef, 
      myProfileRef, 
      favResumeTemplateId, 
      favCoverletterTemplateId,
      newAiKey // Format: { agent, provider, apiKey }
    } = body;

    // 1. Validation: Ensure at least one field is being updated
    const hasUpdate = (
      primaryResumeId || theme || aiResumeRef || 
      myProfileRef || favResumeTemplateId || 
      favCoverletterTemplateId || newAiKey
    );

    if (!hasUpdate) {
      return NextResponse.json({ 
        error: 'At least one field (primaryResumeId, theme, aiResumeRef, myProfileRef, favResumeTemplateId, favCoverletterTemplateId, or newAiKey) is required' 
      }, { status: 400 });
    }

    const userRefs = await UserReferences.findOne({ userId: userData.id });
    if (!userRefs) {
      return NextResponse.json({ error: 'User references not found' }, { status: 404 });
    }

    // 2. Standard Preference Updates
    if (primaryResumeId) userRefs.primaryResumeRef = primaryResumeId;
    if (aiResumeRef) userRefs.aiResumeRef = aiResumeRef;
    if (theme) userRefs.theme = theme;
    if (myProfileRef) userRefs.myProfileRef = myProfileRef;
    if (favResumeTemplateId) userRefs.favResumeTemplateId = favResumeTemplateId;
    if (favCoverletterTemplateId) userRefs.favCoverletterTemplateId = favCoverletterTemplateId;

    // 3. AI Key Logic
    if (newAiKey) {
      const { agent, provider, apiKey } = newAiKey;
      if (provider !== 'ChromeAI') {
          userRefs.aiKeys.push({ agent, provider, apiKey });
        }
    }
      
    // 4. Save (Triggers Mongoose pre-save hook to set primaryAiKeyRef)
    await userRefs.save();

    // 5. Return the updated data
    return NextResponse.json({ 
      success: true, 
      primaryResumeId: userRefs.primaryResumeRef,
      aiResumeRef: userRefs.aiResumeRef,
      theme: userRefs.theme,
      myProfileRef: userRefs.myProfileRef,
      favResumeTemplateId: userRefs.favResumeTemplateId,
      aiKeysCount: userRefs.aiKeys.length,
    });

  } catch (error) {
    console.error("PUT Error:", error);
    return NextResponse.json({ error: 'Failed to update user references' }, { status: 500 });
  }
}