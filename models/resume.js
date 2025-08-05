import mongoose from 'mongoose';

const resumeSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  name: { type: String, required: true, default: 'Default Resume by JXH' },
  
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

export default mongoose.models.Resume || mongoose.model('Resume', resumeSchema);