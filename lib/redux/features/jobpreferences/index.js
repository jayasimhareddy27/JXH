

export const INITIAL_STATE = {
    label: 'New Profile', // <--- ADD THIS
  profile: {
    careerStage: 'Experienced Professional',
    countryOfCitizenship: 'N/A',
    targetEmploymentCountry: 'N/A',
    yearsOfExperience: 0,
    targetJobTitles: [],
    expectedSalary: { currency: 'USD', min: 0 }
  },
  workEligibility: {
    eligibleToWorkInTargetCountry: false,
    requiresSponsorship: false,
    currentVisaType: 'None',
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
  },
  languages: [{ language: 'English', proficiency: 'Professional' }],
  links: {
    linkedin: '',
    github: '',
    portfolio: '',
    other: []
  }
};

export const CAREER_STAGE_PRESETS = {
  "Student": {
    ...INITIAL_STATE,
    profile: { ...INITIAL_STATE.profile, careerStage: "Student", yearsOfExperience: 0 },
    workEligibility: { ...INITIAL_STATE.workEligibility, requiresSponsorship: true, currentVisaType: "F1-OPT" }
  },
  "Experienced Professional": {
    ...INITIAL_STATE,
    profile: { ...INITIAL_STATE.profile, careerStage: "Experienced Professional", yearsOfExperience: 3 },
    workEligibility: { ...INITIAL_STATE.workEligibility, eligibleToWorkInTargetCountry: true }
  },
  "Recent Graduate": {
    ...INITIAL_STATE,
    profile: { ...INITIAL_STATE.profile, careerStage: "Recent Graduate", yearsOfExperience: 1 }
  }
};