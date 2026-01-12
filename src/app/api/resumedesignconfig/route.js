import { NextResponse } from 'next/server';
import Resume from '@models/resume'; // Adjust based on your Resume model
import { connectToDB } from '@lib/mongodb';


export async function POST(req) {
  try {
    await connectToDB();
    const { resumeId, designConfig } = await req.json();

    if (!resumeId) {
      return NextResponse.json({ error: "Missing Resume ID" }, { status: 400 });
    }

    const updatedResume = await Resume.findByIdAndUpdate(
      resumeId,
      { designConfig },
      { new: true }
    );

    return NextResponse.json({ success: true, data: updatedResume });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}