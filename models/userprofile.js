import mongoose from 'mongoose';

const userProfileSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },

  personalInformation: { type: mongoose.Schema.Types.Mixed, default: {} },
  onlineProfiles: { type: mongoose.Schema.Types.Mixed, default: {} },

  educationHistory: { type: mongoose.Schema.Types.Mixed, default: [] }, // can be array or object
  workExperience: { type: mongoose.Schema.Types.Mixed, default: [] },
  projects: { type: mongoose.Schema.Types.Mixed, default: [] },
  certifications: { type: mongoose.Schema.Types.Mixed, default: [] },
  referrals: { type: mongoose.Schema.Types.Mixed, default: [] },

  skillsSummary: { type: mongoose.Schema.Types.Mixed, default: {} },
  careerSummary: { type: mongoose.Schema.Types.Mixed, default: {} },
  addressDetails: { type: mongoose.Schema.Types.Mixed, default: {} },

  personalAttributes: { type: mongoose.Schema.Types.Mixed, default: {} },
  workEligibility: { type: mongoose.Schema.Types.Mixed, default: {} },
  jobPreferences: { type: mongoose.Schema.Types.Mixed, default: {} },
  hobbies: { type: mongoose.Schema.Types.Mixed, default: {} },

}, { timestamps: true, strict: false });

export default mongoose.models.FullUserProfile || mongoose.model('FullUserProfile', userProfileSchema);
