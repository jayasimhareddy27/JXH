import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { connectToDB } from '@lib/mongodb';
import FullUserProfile from '@models/userprofile';
import Resume from '@models/resume';
import UserReferences from "@models/userreferences";

const JWT_SECRET = process.env.JWT_SECRET || "SuperSecretKey";

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

export async function GET(request) {
    await connectToDB();
    const userData = await authenticate(request);
    if (!userData) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const [profile, references] = await Promise.all([
        FullUserProfile.findOne({ userId: userData.id }),
        UserReferences.findOne({ userId: userData.id })
    ]);

    if (!profile) {
        const defaultProfile = new FullUserProfile({ userId: userData.id });
        await defaultProfile.save();
        return NextResponse.json({ 
            success: true, 
            profile: defaultProfile, 
            references: null,
            theme: 'light'
        });
    }

    
    return NextResponse.json({ 
        success: true, 
        profile, 
        references: references,
        theme: references?.theme || 'light'
    });
}

export async function PUT(request) {
    await connectToDB();
    const userData = await authenticate(request);
    if (!userData) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const session = await FullUserProfile.startSession();
    session.startTransaction();

    try {
        const rawData = await request.json();

        // 1. Update or create FullUserProfile
        let profile = await FullUserProfile.findOneAndUpdate(
            { userId: userData.id },
            { $set: rawData },
            { new: true, upsert: true, session }
        );

        // 2. Prepare resume data
        const resumeData = {
            userId: userData.id,
            name: 'Default Resume by JXH',
            personalInformation: profile.personalInformation || {},
            onlineProfiles: profile.onlineProfiles || {},
            educationHistory: profile.educationHistory || [],
            workExperience: profile.workExperience || [],
            projects: profile.projects || [],
            certifications: profile.certifications || [],
            skillsSummary: profile.skillsSummary || {},
            careerSummary: profile.careerSummary || {},
            sectionTitles: profile.sectionTitles?.slice(0, 8)  || []
        };

        // 3. Update or create Resume
        let resume = await Resume.findOneAndUpdate(
            { userId: userData.id, name: 'Default Resume by JXH' },
            { $set: resumeData },
            { new: true, upsert: true, session }
        );

        // 4. Update or create UserReferences
        let references = await UserReferences.findOne({ userId: userData.id }).session(session);

        if (!references) {
            references = new UserReferences({
                userId: userData.id,
                resumeRefs: [resume._id],
                primaryResumeRef: resume._id,
                userDataRef: profile._id,
                theme: rawData.theme || 'light'
            });
            await references.save({ session });
        } else {
            const resumeIdStr = resume._id.toString();
            if (!references.resumeRefs.some(ref => ref.toString() === resumeIdStr)) {
                references.resumeRefs.push(resume._id);
            }
            references.userDataRef = profile._id;
            if (!references.primaryResumeRef) {
                references.primaryResumeRef = resume._id;
            }
            if (rawData.theme) {
                references.theme = rawData.theme;
            }
            await references.save({ session });
        }

        // 5. Commit transaction
        await session.commitTransaction();
        session.endSession();

        return NextResponse.json({ success: true, profile, resume, references });

    } catch (error) {
        await session.abortTransaction();
        session.endSession();

        console.error(error);
        if (error.name === 'VersionError') {
            return NextResponse.json(
                { error: 'Your data is out of sync. Please refresh the page and try again.' },
                { status: 409 }
            );
        }
        return NextResponse.json({ error: 'Failed to save your profile.' }, { status: 500 });
    }
}
