import mongoose from 'mongoose'
import aikeySchema from './aikey.js'



/* -------------------- UserReferences Schema -------------------- */
const userreferencesSchema = new mongoose.Schema({
  userId: {   type: mongoose.Schema.Types.ObjectId,   ref: 'User',   required: true },

  /* Resume & UserData */
  resumeRefs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Resume' }],
  primaryResumeRef: { type: mongoose.Schema.Types.ObjectId, ref: 'Resume', default: null },
  aiResumeRef: { type: mongoose.Schema.Types.ObjectId, ref: 'Resume', default: null },
  myProfileRef: { type: mongoose.Schema.Types.ObjectId, ref: 'Resume', default: null },
  
  userDataRef: { type: mongoose.Schema.Types.ObjectId, ref: 'UserData' },

  /* Job & Cover Letters */
  jobTrackingRefs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Job' }],
  coverLetterRefs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'CoverLetter' }],

  /* Preferences */
  theme: {  type: String,  default: 'light',  enum: ['light', 'dark']},
  favResumeTemplateId: { type: String, default: 'template01' },
  favCoverLetterId: { type: String, default: 'Default Cover letter' },

  /* Cloud Storage */
  extendedStorageUrl: { type: String, default: null },

  /* AI Keys */
  aiKeys: [aikeySchema]

}, { timestamps: true })



/* -------------------- Export -------------------- */
export default mongoose.models.UserReferences 
  || mongoose.model('UserReferences', userreferencesSchema)
