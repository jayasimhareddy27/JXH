import { formatPrompts } from '@components/prompts/userdetailextraction';
import mongoose from 'mongoose';

const defaultSectionTitles = Object.values(formatPrompts).map(phase => ({
    key: phase.key,
    title: phase.title,
}));

const userProfileSchema = new mongoose.Schema({
    userId: { type: String, required: true, unique: true },
    sectionTitles: {
        type: [{
            key: { type: String, required: true },
            title: { type: String, required: true },
        }],
        default: () => [...defaultSectionTitles]
    },
    personalInformation: { type: mongoose.Schema.Types.Mixed, default: {} },
    onlineProfiles: { type: mongoose.Schema.Types.Mixed, default: {} },
    educationHistory: { type: mongoose.Schema.Types.Mixed, default: [] },
    workExperience: { type: mongoose.Schema.Types.Mixed, default: [] },
    projects: { type: mongoose.Schema.Types.Mixed, default: [] },
    certifications: { type: mongoose.Schema.Types.Mixed, default: [] },
    skillsSummary: { type: mongoose.Schema.Types.Mixed, default: {} },
    careerSummary: { type: mongoose.Schema.Types.Mixed, default: {} },
    addressDetails: { type: mongoose.Schema.Types.Mixed, default: {} },
}, { timestamps: true, strict: false });

export default mongoose.models.FullUserProfile || mongoose.model('FullUserProfile', userProfileSchema);