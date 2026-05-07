import { NextResponse } from 'next/server';
import { connectToDB } from '@lib/mongodb';
import UserData from '@models/userdata';
import UserReferences from '@models/userreferences';
import { getToken } from "next-auth/jwt";
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || "SuperSecretKey";

async function authenticate(request) {
  const session = await getToken({ 
    req: request, 
    secret: process.env.NEXTAUTH_SECRET 
  });

  if (session) {
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
  try {
    await connectToDB();
    const user = await authenticate(request);
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    let refs = await UserReferences.findOne({ userId: user.id }).populate('userDataRefs');

    // Auto-provision Primary Profile if none exist
    if (!refs || !refs.userDataRefs || refs.userDataRefs.length === 0) {
      const primaryProfile = await UserData.create({
        userId: user.id,
        label: "Primary Profile",
        profile: { careerStage: 'Experienced Professional', countryOfCitizenship: 'N/A', targetEmploymentCountry: 'N/A' }
      });

      refs = await UserReferences.findOneAndUpdate(
        { userId: user.id },
        { $set: { userDataRefs: [primaryProfile._id], primaryUserDataRef: primaryProfile._id } },
        { upsert: true, new: true }
      ).populate('userDataRefs');
    }

    // RETURN BOTH profiles and the primary ID
    return NextResponse.json({ 
      profiles: refs.userDataRefs, 
      primaryUserDataRef: refs.primaryUserDataRef 
    });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await connectToDB();
    const user = await authenticate(request);
    const { profiles, primaryUserDataRef } = await request.json();

    const profileOps = profiles.map(async (p) => {
      const profileData = { ...p, userId: user.id };
      if (p._id && /^[0-9a-fA-F]{24}$/.test(p._id)) {
        return UserData.findByIdAndUpdate(p._id, profileData, { new: true });
      } else {
        delete profileData._id;
        return UserData.create(profileData);
      }
    });

    const savedProfiles = await Promise.all(profileOps);
    const profileIds = savedProfiles.map(p => p._id);

    // Save the primary reference sent from frontend
    const finalPrimaryId = primaryUserDataRef || profileIds[0];

    await UserReferences.findOneAndUpdate(
      { userId: user.id },
      { $set: { userDataRefs: profileIds, primaryUserDataRef: finalPrimaryId } },
      { upsert: true }
    );

    return NextResponse.json({ 
      profiles: savedProfiles, 
      primaryUserDataRef: finalPrimaryId 
    });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}