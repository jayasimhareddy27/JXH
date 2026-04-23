import mongoose from 'mongoose';

const userdataSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },


/* --- Professional Profile --- */
  profile: {
    userStatus: { 
      type: String, 
      required: true,
      enum: ['Citizen', 'International Student', 'Recent Graduate', 'Working Professional', 'Other'],
      default: 'Working Professional'
    },
    yearsOfExperience: { type: Number, default: 0 },
    targetJobTitles: [{ type: String }],
    preferredWorkLocation: [{ type: String }],
    expectedSalary: {
      currency: { type: String, default: 'JPY' },
      min: { type: Number, default: 0 }
    }
  },
  /* --- Work Eligibility & Security --- */
  workEligibility: {
    requiresSponsorship: { type: Boolean, default: false },
    eligibleToWorkInCountry: { type: Boolean, default: true },
    visaType: { type: String, default: null }, 
    currentLocationType: { 
      type: String, 
      enum: ['Local', 'Willing to Relocate', 'Remote Only'], 
      default: 'Local' 
    },
    securityClearance: { 
      type: String, 
      enum: ['None', 'Secret', 'Top Secret', 'TS/SCI', 'Other'],
      default: 'None' 
    }
  },

  /* --- Diversity & Inclusion (EEO Data) --- */
  demographics: {
    gender: { type: String, enum: ['Male', 'Female', 'Non-binary', 'Prefer not to say'] },
    ethnicity: { 
      type: String, 
      enum: ['Hispanic or Latino', 'White', 'Black or African American', 'Asian', 'Native Hawaiian or Pacific Islander', 'American Indian or Alaska Native', 'Two or More Races', 'Prefer not to say'] 
    },
    isVeteran: { type: String, enum: ['I am not a veteran', 'Protected veteran', 'Prefer not to say'], default: 'I am not a veteran' },
    disabilityStatus: { type: String, enum: ['Yes, I have a disability', 'No, I do not have a disability', 'Prefer not to say'], default: 'No, I do not have a disability' }
  },

  /* --- Legal & Compliance (Commonly Asked) --- */
  legal: {
    hasCriminalRecord: { type: Boolean, default: false },
    subjectToNonCompete: { type: Boolean, default: false },
    everDischargedFromJob: { type: Boolean, default: false },
    formerEmployee: { type: Boolean, default: false }
  },

  /* --- Logistics & Availability --- */
  availability: {
    noticePeriod: { type: String, default: 'Immediate' }, 
    earliestStartDate: { type: Date },
    willingToTravel: { type: String, enum: ['0%', '25%', '50%', '75%', '100%'], default: '0%' },
  },

  /* --- Languages & Skills Summary --- */
  languages: [{
    language: String,
    
    proficiency: { type: String, enum: ['Native', 'Fluent', 'Professional', 'Intermediate', 'Beginner'] }
  }],

  /* --- Social & Links --- */
  links: {
    linkedin: String,
    github: String,
    portfolio: String,
    other: [{ label: String, url: String }]
  },



}, { timestamps: true });

export default mongoose.models.UserData || mongoose.model('UserData', userdataSchema);