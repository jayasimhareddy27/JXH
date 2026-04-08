import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { connectToDB } from '@lib/mongodb';
import Resume from '@models/resume';
import UserReferences from '@models/userreferences';
import { getToken } from 'next-auth/jwt';

const JWT_SECRET = process.env.JWT_SECRET || 'SuperSecretKey';

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

export async function POST(request) {
  try {
    await connectToDB();
    const userData = await authenticate(request);

    if (!userData) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { resumeId, newName } = await request.json();
    
    if (!resumeId || !newName) {
      return NextResponse.json({ error: 'Missing resumeId or newName' }, { status: 400 });
    }

    // 1. Find the original and verify ownership
    const originalResume = await Resume.findOne({ _id: resumeId, userId: userData.id });
    if (!originalResume) {
      return NextResponse.json({ error: 'Original resume not found' }, { status: 404 });
    }

    // 2. Convert to object and strip database-specific fields
    const clonedData = originalResume.toObject();
    
    delete clonedData._id;
    delete clonedData.createdAt;
    delete clonedData.updatedAt;

    // 3. THE CRITICAL CHANGE: Start with a fresh jobs list
    // A copy of a resume is a "new version" and hasn't been used for any jobs yet.
    clonedData.jobs = []; 
    
    clonedData.name = newName;
    clonedData.userId = userData.id;

    // 4. Save as a new document
    const newResume = await Resume.create(clonedData);

    // 5. Update UserReferences using $addToSet (Atomic & Safer)
    await UserReferences.updateOne(
      { userId: userData.id },
      { $addToSet: { resumeRefs: newResume._id } }
    );

    return NextResponse.json({ 
      success: true, 
      message: "Resume copied successfully",
      newResume 
    }, { status: 201 });

  } catch (error) {
    console.error('Error copying resume:', error);
    return NextResponse.json({ error: 'Failed to copy resume' }, { status: 500 });
  }
}