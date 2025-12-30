import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { connectToDB } from '@lib/mongodb';
import Resume from '@models/resume';
import UserReferences from '@models/userreferences';

const JWT_SECRET = process.env.JWT_SECRET || 'SuperSecretKey';

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

export async function POST(request) {
  await connectToDB();
  const userData = await authenticate(request);

  if (!userData) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { resumeId, newName } = await request.json();

    if (!resumeId || !newName) {
      return NextResponse.json({ error: 'Missing resumeId or newName' }, { status: 400 });
    }

    const originalResume = await Resume.findOne({ _id: resumeId, userId: userData.id });
    if (!originalResume) {
      return NextResponse.json({ error: 'Original resume not found' }, { status: 404 });
    }

    // Deep clone original resume object except _id and timestamps
    const originalResumeObj = originalResume.toObject();
    delete originalResumeObj._id;
    delete originalResumeObj.createdAt;
    delete originalResumeObj.updatedAt;

    originalResumeObj.name = newName;
    originalResumeObj.userId = userData.id;

    // Create new Resume document with cloned data
    const newResume = new Resume(originalResumeObj);
    await newResume.save();

    // Update UserReferences by adding new resume ref
    const userRefs = await UserReferences.findOne({ userId: userData.id });
    if (userRefs) {
      userRefs.resumeRefs.push(newResume._id);
      await userRefs.save();
    }

    return NextResponse.json({ success: true, newResume });
  } catch (error) {
    console.error('Error copying resume:', error);
    return NextResponse.json({ error: 'Failed to copy resume' }, { status: 500 });
  }
}
