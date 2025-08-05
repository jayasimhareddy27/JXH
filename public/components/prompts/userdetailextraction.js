// Prompt templates with clear structure and format expectations
const formatPrompts = {
//Not array
  personalInformation: {
    id: 1,
    key: 'personalInformation',
    title: 'Personal Information',
    arrayFieldKey: false,
    fields: ['sectionTitle','fullName', 'firstName', 'lastName', 'email', 'phoneNumber'],
    initial: { sectionTitle:'Personal Information',fullName: '', firstName: '', lastName: '', email: '', phoneNumber: '' },
    prompt: `Extract the following personal information.
Return as JSON, donot wrap the content in ''' or any other characters or donot add comments or explanation:
{
  "sectionTitle":"Personal Information",
  "fullName": "",
  "firstName": "",
  "lastName": "",
  "email": "",
  "phoneNumber": ""
}
Set null if not found.

Resume text:`
  },
  onlineProfiles: {
    id: 2,
    key: 'onlineProfiles',
    title: 'Online Profiles',
    arrayFieldKey: false,
    fields: ['sectionTitle','linkedin', 'github', 'portfolio', 'personalWebsite', 'otherLinks', ],
    initial: {sectionTitle:'Online Profiles', linkedin: '', github: '', portfolio: '', personalWebsite: '', otherLinks: '',  },
    prompt: `Extract links.
Return as JSON, donot wrap the content in ''' or any other characters or donot add comments or explanation:
{
  "sectionTitle":"Online Profiles",
  "linkedin": "",
  "github": "",
  "portfolio": "",
  "personalWebsite": "",
  "otherLinks": ""

}
Set null if missing. "otherLinks" is comma-separated.

Resume text:`
  },

//array
  educationHistory: {
    id: 3,
    key: 'educationHistory',
    title: 'Education History',
    arrayFieldKey: true,
    fields: ['degree', 'major', 'university', 'location', 'startDate', 'endDate', 'gpa'],
    initial: [{ sectionTitle:'Education History'},{degree:'', major:'', university:'', location:'', startDate:'', endDate:'',gpa:''}],
    prompt: `Extract education details.
Return as JSON array, donot wrap the content in ''' or any other characters or donot add comments or explanation:
[ { sectionTitle:'Education History'},
  {
    "degree": "",
    "major": "",
    "university": "",
    "location": "",
    "startDate": "MM-DD-YYYY",
    "endDate": "MM-DD-YYYY",
    "gpa": ""
  }
]
Use MM-DD-YYYY. Set null if missing.

Resume text:`
  },
  workExperience: {
    id: 4,
    key: 'workExperience',
    title: 'Work Experience',
    arrayFieldKey: true,
    fields: ['companyName', 'jobTitle', 'responsibilities', 'location', 'startDate', 'endDate'],
    initial: [ {sectionTitle:'Work Experience'}, {companyName:'', jobTitle:'', responsibilities:'', location:'', startDate:'', endDate:''}],

    prompt: `Extract work experience.
Return as JSON array, donot wrap the content in ''' or any other characters or donot add comments or explanation:
[ {"sectionTitle":'Work Experience'},
  {
    "companyName": "",
    "jobTitle": "",
    "responsibilities": "",
    "location": "",
    "startDate": "MM-DD-YYYY",
    "endDate": "MM-DD-YYYY"
  }
]
Preserve newlines in responsibilities. Use MM-DD-YYYY. Set null if missing.

Resume text:`
  },
  projects: {
    id: 5,
    key: 'projects',
    title: 'Projects',
    arrayFieldKey: true,
    fields: ['projectName', 'projectDescription', 'technologiesUsed', 'startDate', 'endDate', 'projectLink'],
    initial: [ {sectionTitle:'Projects'},{projectName:'', projectDescription:'', technologiesUsed:'', startDate:'', endDate:'', projectLink:''}],

    prompt: `Extract projects.
Return as JSON array, donot wrap the content in ''' or any other characters or donot add comments or explanation:
[ {"sectionTitle":'Projects'},
  {
    "projectName": "",
    "projectDescription": "",
    "technologiesUsed": "",
    "startDate": "MM-DD-YYYY",
    "endDate": "MM-DD-YYYY",
    "projectLink": ""
  }
]
"technologiesUsed" is comma-separated. Set null if missing.

Resume text:`
  },

//Not array
  skillsSummary: {
    id: 6,
    key: 'skillsSummary',
    title: 'Skills Summary',
    fields: ['sectionTitle','technicalSkills', 'tools', 'softSkills', 'languagesSpoken', 'certificationsSkills' ],
    initial: {  sectionTitle:'Skills Summary', technicalSkills: '', tools: '', softSkills: '', languagesSpoken: '', certificationsSkills: '' },
    prompt: `Extract skills.
Return as JSON, donot wrap the content in ''' or any other characters or donot add comments or explanation:
{ "sectionTitle":'Skills Summary',
  "sectionTitle":"",
  "technicalSkills": "",
  "tools": "",
  "softSkills": "",
  "languagesSpoken": "",
  "certificationsSkills": ""
}
Use comma-separated strings. Set null if missing.

Resume text:`
  },

//array
  certifications: {
    id: 7,
    key: 'certifications',
    title: 'Certifications',
    arrayFieldKey: true,
    fields: ['certificationName', 'issuer', 'credentialURL'],
    initial: [ {sectionTitle:'Certifications'}, {certificationName:'', issuer:'', credentialURL: ''}],
    prompt: `Extract certifications.
Return as JSON array, donot wrap the content in ''' or any other characters or donot add comments or explanation:
[ {"sectionTitle":'Certifications'},
  {
    "certificationName": "",
    "issuer": "",
    "credentialURL": ""
  }
]
Set null if missing.

Resume text:`
  },

//Not array
  careerSummary: {
    id: 8,
    key: 'careerSummary',
    title: 'Career Summary',
    arrayFieldKey: false,
    fields: ['sectionTitle','summary', 'summaryGenerated', ],
    initial: { sectionTitle:'Career Summary' , summary: '', summaryGenerated: '', },
    prompt: `Extract career summary.
Return as JSON, donot wrap the content in ''' or any other characters or donot add comments or explanation:
{
  "sectionTitle":'Career Summary',
  "summary": "",
  "summaryGenerated": ""
}
Set summaryGenerated to null if unavailable.

Resume text:`
  },
  addressDetails: {
    id: 9,
    key: 'addressDetails',
    title: 'Address Details',
    arrayFieldKey: false,
    fields: ['sectionTitle','street', 'city', 'state', 'zipCode', 'country', ],
    initial: {  sectionTitle:'Address Details', street: '', city: '', state: '', zipCode: '', country: '' },
    prompt: `Extract address.
Return as JSON, donot wrap the content in ''' or any other characters or donot add comments or explanation:
{
  "sectionTitle":"Address Details",
  "street": "",
  "city": "",
  "state": "",
  "zipCode": "",
  "country": ""
}
Set null if missing.

Resume text:`
  },
  personalAttributes: {
    id: 10,
    key: 'personalAttributes',
    title: 'Personal Attributes',
    arrayFieldKey: false,
    fields: [ 'sectionTitle', 'gender',  'dateOfBirth',  'nationality',  'maritalStatus',  'languages',  'disabilityStatus',  'criminalRecord',  'veteranStatus',  'raceEthnicity',  'healthRestrictions',  'emergencyContactName',  'emergencyContactPhone'],
    initial: { sectionTitle:'Personal Attributes',  gender: '',  dateOfBirth: '',  nationality: '',  maritalStatus: '',  languages: '',  disabilityStatus: '',  criminalRecord: '',  veteranStatus: '',  raceEthnicity: '',  healthRestrictions: '',  emergencyContactName: '',  emergencyContactPhone: ''
  },
  prompt: `Extract personal attributes.
  Return as JSON, donot wrap the content in ''' or any other characters or donot add comments or explanation:
  { 
    "sectionTitle":"Personal Attributes",
    "gender": "",
    "dateOfBirth": "MM-DD-YYYY",
    "nationality": "",
    "maritalStatus": "",
    "languages": "",
    "disabilityStatus": "",
    "criminalRecord": "",
    "veteranStatus": "",
    "raceEthnicity": "",
    "healthRestrictions": "",
    "emergencyContactName": "",
    "emergencyContactPhone": ""
  }
  Use MM-DD-YYYY format for dateOfBirth. Use comma-separated string for languages. Set null if missing.
Resume text:`
  },
  workEligibility: {
  id: 11,
  key: 'workEligibility',
  title: 'Work Eligibility',
  arrayFieldKey: false,
  fields: [ 'sectionTitle', 'workAuthorization',  'visaStatus',  'sponsorshipNeeded',  'relocationWillingness',  'rightToWorkInCountry',  'citizenshipStatus'
  ],
  initial: {sectionTitle:'Work Eligibility',  workAuthorization: '',  visaStatus: '',  sponsorshipNeeded: '',  relocationWillingness: '',  rightToWorkInCountry: '',  citizenshipStatus: ''
  },
  prompt: `Extract work eligibility information.
  Return as JSON, donot wrap the content in ''' or any other characters or donot add comments or explanation:
  {
    "sectionTitle":"Work Eligibility",
    "workAuthorization": "",
    "visaStatus": "",
    "sponsorshipNeeded": "",
    "relocationWillingness": "",
    "rightToWorkInCountry": "",
    "citizenshipStatus": ""
  }
  Set null if missing.

  Resume text:`
  },
  jobPreferences: {
    id: 12,
    key: 'jobPreferences',
    title: 'Job Preferences',
    arrayFieldKey: false,
    fields: ['sectionTitle',  'preferredJobTitle',  'preferredLocation',  'desiredSalary',  'employmentType',  'availability',  'willingToTravel',  'remoteWorkPreference'],
    initial: { sectionTitle:'Job Preferences', preferredJobTitle: '',  preferredLocation: '',  desiredSalary: '',  employmentType: '',  availability: '',  willingToTravel: '',  remoteWorkPreference: ''},
    prompt: `Extract job preferences.
  Return as JSON, donot wrap the content in ''' or any other characters or donot add comments or explanation:
  {
    "sectionTitle":"",
    "preferredJobTitle": "",
    "preferredLocation": "",
    "desiredSalary": "",
    "employmentType": "",
    "availability": "",
    "willingToTravel": "",
    "remoteWorkPreference": ""
  }
  Set null if missing.

  Resume text:`
  },

//array
  referrals: {
  id: 13,
  key: 'referrals',
  title: 'Referrals',
  arrayFieldKey: true,
  fields: ['referralName', 'referralContact', 'referralRelationship', 'referralNotes'],
  initial:   [{sectionTitle:'Referrals'},{referralName: '',  referralContact: '',  referralRelationship: '',  referralNotes: ''}],
  prompt: `Extract referral information.
  Return as JSON, donot wrap the content in ''' or any other characters or donot add comments or explanation:
  [{"sectionTitle":'Referrals'},{
    "referralName": "",
    "referralContact": "",
    "referralRelationship": "",
    "referralNotes": ""
  }]
  Set null if missing.

  Resume text:`
  },
//Not Array
  hobbies: {
  id: 14,
  key: 'hobbies',
  title: 'Hobbies',
  arrayFieldKey: false,
  fields: ['sectionTitle','hobbiesList'],
  initial: {"sectionTitle":'Hobbies',"hobbiesList": ''},
  prompt: `Extract hobbies or interests.
  Return as JSON, donot wrap the content in ''' or any other characters or donot add comments or explanation:
  {
    "sectionTitle":"Hobbies",
    "hobbiesList": ""
  }
  Use comma-separated string. Set null if missing.

  Resume text:`
  },
};

// Exports
export const extractionPhases = Object.values(formatPrompts);
export const promptMap = Object.fromEntries(
  Object.values(formatPrompts).map((p) => [p.id, p.prompt])
);
export {formatPrompts}