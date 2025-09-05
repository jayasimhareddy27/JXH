import mongoose from 'mongoose';

const userReferencesSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  resumeRefs: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Resume' 
  }],
  primaryResumeRef: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Resume', 
    default: null 
  },
  userDataRef: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'UserData' 
  },
  jobTrackingRefs: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'JobTracking'
  }],
  coverLetterRefs: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CoverLetter'
  }],
  theme: {
    type: String,
    default: 'light', 
    enum: ['light', 'dark'] 
  },

  favResumeTemplateId: {
    type: String,
    default: 'template01' // Default resume template name
  },
  favCoverLetterId: {
    type: String,
    default: 'template01' // Default cover letter template name
  },
  // --- END OF NEW FIELDS ---
  otherRefs: [{
    label: { type: String },
    refId: { type: mongoose.Schema.Types.ObjectId },
    refType: { type: String }
  }]
}, 
{ timestamps: true });

export default mongoose.models.UserReferences || mongoose.model('UserReferences', userReferencesSchema);