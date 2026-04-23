/**
 * Global Constants and Persona Presets for UserData
 * Matches Mongoose Schema: profile, workEligibility, demographics, legal, availability, languages, links
 */

export const INITIAL_STATE = {
  profile: {
    userStatus: 'Working Professional',
    yearsOfExperience: 0,
    targetJobTitles: [],
    preferredWorkLocation: [],
    expectedSalary: { currency: 'JPY', min: 0 }
  },
  workEligibility: {
    requiresSponsorship: false,
    eligibleToWorkInCountry: true,
    visaType: '',
    currentLocationType: 'Local',
    securityClearance: 'None'
  },
  demographics: {
    gender: 'Prefer not to say',
    ethnicity: 'Prefer not to say',
    isVeteran: 'I am not a veteran',
    disabilityStatus: 'No, I do not have a disability'
  },
  legal: {
    hasCriminalRecord: false,
    subjectToNonCompete: false,
    everDischargedFromJob: false,
    formerEmployee: false
  },
  availability: {
    noticePeriod: 'Immediate',
    earliestStartDate: '',
    willingToTravel: '0%',
    referredBy: ''
  },
  languages: [{ language: 'English', proficiency: 'Professional' }],
  links: {
    linkedin: '',
    github: '',
    portfolio: '',
    other: []
  }
};

export const USER_STATUS_PRESETS = {
  "Citizen": {
    ...INITIAL_STATE,
    profile: { ...INITIAL_STATE.profile, userStatus: "Citizen" },
    workEligibility: { ...INITIAL_STATE.workEligibility, requiresSponsorship: false, visaType: "N/A" }
  },
  "International Student": {
    ...INITIAL_STATE,
    profile: { ...INITIAL_STATE.profile, userStatus: "International Student" },
    workEligibility: { ...INITIAL_STATE.workEligibility, requiresSponsorship: true, visaType: "F1-OPT" },
    demographics: { ...INITIAL_STATE.demographics, ethnicity: "Asian" }
  },
  "Working Professional": {
    ...INITIAL_STATE,
    profile: { ...INITIAL_STATE.profile, userStatus: "Working Professional", yearsOfExperience: 3 },
    legal: { ...INITIAL_STATE.legal, subjectToNonCompete: true }
  }
};