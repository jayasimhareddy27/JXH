import mongoose from 'mongoose';

const JobSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true, 
    index: true 
  },
  resumeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Resume' },
  coverLetterId: { type: mongoose.Schema.Types.ObjectId, ref: 'CoverLetter' },
  // --- CORE INFO ---
  companyName: { type: String, required: true, trim: true },
  position: { type: String, required: true, trim: true },
  seniorityLevel: { 
    type: String, 
    enum: ['Intern', 'Entry Level', 'Junior', 'Mid-Level', 'Senior', 'Staff/Principal', 'Lead/Manager', ''],
    default: '' 
  },
  // Add this field to your JobSchema
  jobType: { 
    type: String, 
    enum: ['Full-time', 'Part-time', 'Contract', 'Internship', 'Not Mentioned', ''],
    default: 'Not Mentioned' 
  },
  
  // --- DESCRIPTION SYSTEM ---
  rawDescription: { type: String, required: true }, 
  aiDescription: { type: String, default: "" }, // Full extracted duties (Phase 2)

  // --- ANALYTICS, TAGS & COMPANY STRATEGY ---
  requirements: { type: [String], default: [] }, // Red Flag Hurdles (Phase 3)
  perks: { type: [String], default: [] },        // Benefits (Phase 4)
  businessModel: { type: String, trim: true },   // What they do (Phase 4 - NEW)
  companyInsights: { type: String, trim: true }, // Culture fluff (Phase 4)

  // --- LOGISTICS & STATUS ---
  stage: {
    type: String,
    enum: [
      'saved', 'applied','screening', 'interview', 'assessment',  
      'offer', 'decision', 'archived'
    ],
    default: 'saved',
    index: true,
  },
  state: {
    type: String,
    enum: [
      "pending",     // Waiting for response
      "completed",   // Finished this stage
      "ghosted",     // No response / ghosted
      "rejected",    // Rejected at this stage
      "withdrawn",   // You withdrew
    ],
    default: "pending",
    index: true,
  },
  postedDate: { type: Date },                   // From AI extraction
  applicationDate: { type: Date, default: Date.now },
  jobLocation: { type: String, default: '' },
  jobUrl: { type: String, trim: true },
  salary: { type: String, trim: true },
  followUpIds: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'FollowUp',
    default: []
  }],


  // The "Work done for the user" section

  skills: { 
    type: [String], 
    default: [], 
    index: true 
  },
  
  marketIntel: {
    interviewQuestions: [{
      question: { type: String },
      focusArea: { type: String } // e.g., "Technical", "Behavioral"
    }],
    difficultyRating: { 
      type: Number, 
      min: 1, 
      max: 5, 
      default: 3 
    },
    isFeatured: { type: Boolean, default: false }
  },
});

// Optimized compound index for high-speed dashboard filtering
JobSchema.index({ userId: 1, stage: 1, state: 1, createdAt: -1 });

export default mongoose.models.Job || mongoose.model('Job', JobSchema);