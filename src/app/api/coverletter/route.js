import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { connectToDB } from '@lib/mongodb';
import UserReferences from "@models/userreferences";
import CoverLetter from "@models/coverletter"; // Ensure this matches your model file name
import { getToken } from 'next-auth/jwt';

const JWT_SECRET = process.env.JWT_SECRET || "SuperSecretKey";

// Helper to check the user token
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

// GET: Fetch all cover letters for the logged-in user
export async function GET(request) {
  try {
    await connectToDB();
    const userData = await authenticate(request);

    if (!userData) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Find user references and populate the cover letter details
    const userRefs = await UserReferences.findOne({ userId: userData.id })
      .populate('coverLetterRefs'); // Make sure this field exists in your UserReferences model
    
    if (!userRefs || !userRefs.coverLetterRefs) {
      return NextResponse.json([]);
    }

    // Sort by most recently updated
    const sortedLetters = userRefs.coverLetterRefs.sort(
      (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
    );
    
    return NextResponse.json(sortedLetters);
  } catch (error) {
    console.error("Error fetching cover letters:", error);
    return NextResponse.json(
      { error: "Failed to fetch cover letters" },
      { status: 500 }
    );
  }
}

// POST: Create a new cover letter
export async function POST(req) {
  try {
    await connectToDB();
    const userData = await authenticate(req);
    
    if (!userData) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name } = await req.json();
    if (!name || name.trim() === "") {
      return NextResponse.json({ error: "Cover letter name is required" }, { status: 400 });
    }

    // 1. Create the Cover Letter using schema defaults
    const newCoverLetter = await CoverLetter.create({
      userId: userData.id,
      name: name,
      // Other fields like letterContent will use defaults defined in your schema
    });

    // 2. Update UserReferences to include this new letter
    const userRefs = await UserReferences.findOne({ userId: userData.id });
    if (userRefs) {
      // Ensure your UserReferences schema has a coverLetterRefs array field
      if (!userRefs.coverLetterRefs) userRefs.coverLetterRefs = [];
      
      userRefs.coverLetterRefs.push(newCoverLetter._id);
      await userRefs.save();
    }

    return NextResponse.json(newCoverLetter);

  } catch (error) {
    console.error("Error creating cover letter:", error);
    return NextResponse.json(
      { error: "Failed to create cover letter", details: error.message },
      { status: 500 }
    );
  }
}