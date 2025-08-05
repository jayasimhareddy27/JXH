import { NextResponse } from 'next/server';
import { connectToDB } from '@lib/mongodb';
import UserReferences from '@models/userreferences';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || "SuperSecretKey"; // Use env var in prod

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

export async function PUT(request) {
  await connectToDB();
  const userData = await authenticate(request);
  
  if (!userData) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  try {
    const { primaryResumeId } = await request.json();

    if (!primaryResumeId) {
      return NextResponse.json({ error: 'primaryResumeId is required' }, { status: 400 });
    }
    const userRefs = await UserReferences.findOne({ userId: userData.id });
    
    
    userRefs.primaryResumeRef = primaryResumeId;
    await userRefs.save();

    return NextResponse.json({ success: true, primaryResumeId });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to update primary resume' }, { status: 500 });
  }
}
