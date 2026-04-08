import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { connectToDB } from '@lib/mongodb';
import UserReferences from "@models/userreferences";
import CoverLetter from "@models/coverletter"; // Ensure this matches your model file name
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

export async function POST(req) {
  try {
    await connectToDB();
    const userData = await authenticate(req);
    if (!userData) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { coverletterId, newName } = await req.json();

    if (!coverletterId || !newName) {
      return NextResponse.json({ error: "Missing coverletterId or newName" }, { status: 400 });
    }

    // 1. Fetch the original document (Ownership check)
    const original = await CoverLetter.findOne({ _id: coverletterId, userId: userData.id });
    if (!original) {
      return NextResponse.json({ error: "Original cover letter not found" }, { status: 404 });
    }

    // 2. Clone the data and strip database-specific fields
    const copyData = original.toObject();
    delete copyData._id;
    delete copyData.createdAt;
    delete copyData.updatedAt;
    delete copyData.__v;

    // 3. THE CRITICAL CHANGE: Reset usage history
    // A copy is a new version/template and shouldn't be linked to the original's jobs.
    copyData.jobs = []; 
    copyData.name = newName;
    copyData.userId = userData.id;

    // 4. Create the new record
    const newCoverletter = await CoverLetter.create(copyData);

    // 5. Update UserReferences using $addToSet (Cleaner and prevents duplicates)
    await UserReferences.findOneAndUpdate(
      { userId: userData.id },
      { $addToSet: { coverLetterRefs: newCoverletter._id } }
    );

    return NextResponse.json({ 
      success: true, 
      newCoverletter 
    }, { status: 201 });

  } catch (error) {
    console.error("Copy error:", error);
    return NextResponse.json({ 
      error: "Failed to copy cover letter", 
      details: error.message 
    }, { status: 500 });
  }
}