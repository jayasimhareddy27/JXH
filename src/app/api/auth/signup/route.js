import { connectToDB } from '@lib/mongodb';
import User from '@models/login';
import Resume from '@models/resume';
import UserReferences from '@models/userreferences'; 
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { formatPrompts } from '@public/staticfiles/prompts/userdetailextraction';

const JWT_SECRET = process.env.JWT_SECRET;

export async function POST(req) {
  const { email, password, name } = await req.json();

  if (!email || !password || !name) {
    return Response.json({ error: "All fields are required" }, { status: 400 });
  }

  try {
    await connectToDB();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return Response.json({ error: "User already exists" }, { status: 409 });
    }

    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      email,
      password: hashedPassword,
      name,
    });

    const initialResume = await Resume.create({
      userId: user._id,
      name: 'My Profile', 

      personalInformation: { ...formatPrompts.personalInformation.initial,name: user.name, email: user.email },
      onlineProfiles: formatPrompts.onlineProfiles.initial,

      educationHistory: formatPrompts.educationHistory.initial,
      workExperience: formatPrompts.workExperience.initial,

      projects: formatPrompts.projects.initial,

      certifications: formatPrompts.certifications.initial,
      
      skillsSummary: formatPrompts.skillsSummary.initial,
      careerSummary: formatPrompts.careerSummary.initial,
      
      addressDetails: formatPrompts.addressDetails.initial,
      
      resumetextAireference: "",
    });

    await UserReferences.create({
      userId: user._id,
      resumeRefs: [initialResume._id], // Store the reference ID
      primaryResumeRef: initialResume._id, // Set it as primary by default
      myProfileRef: initialResume._id, 
      aiResumeRef: initialResume._id, // Set it as AI reference by default
    });

    const token = jwt.sign(
      { id: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    const userResponse = {
      id: user._id,
      email: user.email,
      name: user.name,
    };

    return Response.json(
      { message: "Signup successful", user: userResponse, token },
      { status: 201 }
    );
  } catch (error) {
    console.error("Signup error:", error);
    return Response.json(
      { error: process.env.NODE_ENV === 'development' ? error.message : "Signup failed" },
      { status: 500 }
    );
  }
}