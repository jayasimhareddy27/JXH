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

    // 1. Fetch the original document
    const original = await CoverLetter.findOne({ _id: coverletterId, userId: userData.id });
    if (!original) {
      return NextResponse.json({ error: "Original cover letter not found" }, { status: 404 });
    }

    // 2. Clone the data and strip out the old ID and timestamps
    const copyData = original.toObject();
    delete copyData._id;
    delete copyData.createdAt;
    delete copyData.updatedAt;

    // 3. Update the name and create the new record
    copyData.name = newName;
    const newCoverletter = await CoverLetter.create(copyData);

    // 4. Update UserReferences to include the new copy
    await UserReferences.findOneAndUpdate(
      { userId: userData.id },
      { $push: { coverLetterRefs: newCoverletter._id } }
    );

    return NextResponse.json({ newCoverletter });
  } catch (error) {
    console.error("Copy error:", error);
    return NextResponse.json({ error: "Failed to copy cover letter" }, { status: 500 });
  }
}