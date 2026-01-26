import mongoose from 'mongoose';

const coverLetterSchema = new mongoose.Schema({
  userId: { type: String, required: true, index: true },
  name: { type: String, required: true, default: 'Default Cover letter by JXH' },
  designConfig: { type: mongoose.Schema.Types.Mixed, default: {layout: 'primary',containers: {},selectedContainer: null, } },
  
  templateId: {type: String,default: 'template01'},

  personalInformation: { 
    type: mongoose.Schema.Types.Mixed, 
    default: {email: "",name: "",phone: "",address: {},onlineProfiles: []} 
  },
  
  recipientInformation: { 
    type: mongoose.Schema.Types.Mixed, 
    default: {managerName: "",companyName: "",companyAddress: "",positionTitle: ""} 
  },

  letterMeta: {
    type: mongoose.Schema.Types.Mixed,
    default: {date: new Date(),subjectLine: "", referenceNumber: "" }
  },

  letterContent: { 
    type: mongoose.Schema.Types.Mixed, 
    default: {salutation: "Dear Hiring Manager,",intro: "",bodyParagraphs: [], conclusion: ""} 
  },

  signOff: { 
    type: mongoose.Schema.Types.Mixed, 
    default: {complimentaryClose: "Sincerely,",signatureName: "", signatureImage: "" } 
  },
    
}, { timestamps: true, strict: false });

export default mongoose.models.CoverLetter || mongoose.model('CoverLetter', coverLetterSchema);