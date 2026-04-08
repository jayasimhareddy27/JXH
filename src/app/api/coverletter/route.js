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

    const body = await req.json();
    const { name, jobId, resumeId } = body;
    
    if (!name || name.trim() === "") {
      return NextResponse.json({ error: "Cover letter name is required" }, { status: 400 });
    }

    // 1. Context Fetch: Get Personal Info from the linked Resume
    // This ensures the Cover Letter starts with the user's latest contact data
    let personalInfo = {};
    if (resumeId) {
      const sourceResume = await Resume.findOne({ _id: resumeId, userId: userData.id });
      if (sourceResume) {
        personalInfo = sourceResume.personalInformation || {};
      }
    }

    // 2. Create the Cover Letter (One Letter -> Many Jobs)
    const newCoverLetter = await CoverLetter.create({
      userId: userData.id,
      name: name,
      resumeId: resumeId || null,
      jobs: jobId ? [jobId] : [], // Initialize usage history
      personalInformation: personalInfo, // Cloned from Resume for a "straight" start
    });

    // 3. Update the Job (One Job -> One Cover Letter)
    if (jobId) {
      await Job.findOneAndUpdate(
        { _id: jobId, userId: userData.id },
        { $set: { coverLetterId: newCoverLetter._id } }
      );
    }

    // 4. Update UserReferences (Global tracking)
    // Using $addToSet is faster and prevents duplicate IDs
    await UserReferences.updateOne(
      { userId: userData.id },
      { $addToSet: { coverLetterRefs: newCoverLetter._id } }
    );

    return NextResponse.json(newCoverLetter, { status: 201 });

  } catch (error) {
    console.error("Error creating cover letter:", error);
    return NextResponse.json(
      { error: "Failed to create cover letter", details: error.message },
      { status: 500 }
    );
  }
}