import { NextResponse } from 'next/server';
import { connectToDB } from '@lib/mongodb';
import UserReferences from '@models/userreferences';
import jwt from 'jsonwebtoken';

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
    // 1. Destructure 'theme' from the request body as well
    const { primaryResumeId, theme, aiResumeRef,myProfileRef } = await request.json();

    // 2. Check if at least one property was provided
    if (!primaryResumeId && !theme && !aiResumeRef && !myProfileRef) {
      return NextResponse.json({ error: 'primaryResumeId, theme, aiResumeRef, or myProfileRef is required' }, { status: 400 });
    }

    const userRefs = await UserReferences.findOne({ userId: userData.id });
    
    // 3. Conditionally update the properties if they exist
    if (primaryResumeId) {
      userRefs.primaryResumeRef = primaryResumeId;
    }
    if (aiResumeRef) {
      userRefs.aiResumeRef = aiResumeRef;
    }
    if (theme) {
      userRefs.theme = theme;
    }
    if (myProfileRef) {
      userRefs.myProfileRef = myProfileRef;
    }
    
    await userRefs.save();

    // 4. Return the updated data in the response
    return NextResponse.json({ 
      success: true, 
      primaryResumeId: userRefs.primaryResumeRef,
      theme: userRefs.theme 
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to update user references' }, { status: 500 });
  }
}