// Prompt templates with clear structure and format expectations
const formatPrompts = {
//Not array
  personalInformation: {
    id: 1,
    key: 'personalInformation',
    title: 'Personal Information',
    arrayFieldKey: false,
    fields: ['fullName', 'firstName', 'lastName', 'email', 'phoneNumber'],
    initial: { fullName: '', firstName: '', lastName: '', email: '', phoneNumber: '' },
    prompt: `Extract the following personal information.
Return as JSON(5 mandatory fields), donot wrap the content in ''' or any other characters or donot add comments or explanation:
{
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
    fields: ['linkedin', 'github', 'portfolio', 'personalWebsite', 'otherLinks', ],
    initial: { linkedin: '', github: '', portfolio: '', personalWebsite: '', otherLinks: '',  },
    prompt: `Extract links.
Return as JSON(5 mandatory fields), donot wrap the content in ''' or any other characters or donot add comments or explanation:
{
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
    initial: [{degree:'', major:'', university:'', location:'', startDate:'', endDate:'',gpa:''}],
    prompt: `Extract education details.
Return as JSON array, donot wrap the content in ''' or any other characters or donot add comments or explanation or donot skip a field every field is important:
[
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
    initial: [ {companyName:'', jobTitle:'', responsibilities:'', location:'', startDate:'', endDate:''}],

    prompt: `Extract work experience.
Return as JSON array, donot wrap the content in ''' or any other characters or donot add comments or explanation or donot skip a field every field is important:
[ 
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
    initial: [ {projectName:'', projectDescription:'', technologiesUsed:'', startDate:'', endDate:'', projectLink:''}],

    prompt: `Extract projects.
Return as JSON array, donot wrap the content in ''' or any other characters or donot add comments or explanation or donot skip a field every field is important:
[ 
  
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
    fields: ['technicalSkills', 'tools', 'softSkills', 'languagesSpoken', 'certificationsSkills' ],
    initial: { technicalSkills: '', tools: '', softSkills: '', languagesSpoken: '', certificationsSkills: '' },
    prompt: `Extract skills.
Return as JSON, donot wrap the content in ''' or any other characters or donot add comments or explanation:
{ 
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
    initial: [ {certificationName:'', issuer:'', credentialURL: ''}],
    prompt: `Extract certifications.
Return as JSON array, donot wrap the content in ''' or any other characters or donot add comments or explanation or donot skip a field every field is important:
[ 
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
    fields: ['summary', 'summaryGenerated', ],
    initial: { summary: '', summaryGenerated: '', },
    prompt: `Extract career summary.
Return as JSON, donot wrap the content in ''' or any other characters or donot add comments or explanation:
{
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
    fields: ['street', 'city', 'state', 'zipCode', 'country', ],
    initial: {   street: '', city: '', state: '', zipCode: '', country: '' },
    prompt: `Extract address.
Return as JSON, donot wrap the content in ''' or any other characters or donot add comments or explanation:
{
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
    fields: [ 'gender',  'dateOfBirth',  'nationality',  'maritalStatus',  'languages',  'disabilityStatus',  'criminalRecord',  'veteranStatus',  'raceEthnicity',  'healthRestrictions',  'emergencyContactName',  'emergencyContactPhone'],
    initial: {   gender: '',  dateOfBirth: '',  nationality: '',  maritalStatus: '',  languages: '',  disabilityStatus: '',  criminalRecord: '',  veteranStatus: '',  raceEthnicity: '',  healthRestrictions: '',  emergencyContactName: '',  emergencyContactPhone: ''
  },
  prompt: `Extract personal attributes.
  Return as JSON, donot wrap the content in ''' or any other characters or donot add comments or explanation:
  { 
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
  fields: [ 'workAuthorization',  'visaStatus',  'sponsorshipNeeded',  'relocationWillingness',  'rightToWorkInCountry',  'citizenshipStatus'
  ],
  initial: {  workAuthorization: '',  visaStatus: '',  sponsorshipNeeded: '',  relocationWillingness: '',  rightToWorkInCountry: '',  citizenshipStatus: ''
  },
  prompt: `Extract work eligibility information.
  Return as JSON, donot wrap the content in ''' or any other characters or donot add comments or explanation:
  {
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
    fields: [  'preferredJobTitle',  'preferredLocation',  'desiredSalary',  'employmentType',  'availability',  'willingToTravel',  'remoteWorkPreference'],
    initial: { preferredJobTitle: '',  preferredLocation: '',  desiredSalary: '',  employmentType: '',  availability: '',  willingToTravel: '',  remoteWorkPreference: ''},
    prompt: `Extract job preferences.
  Return as JSON, donot wrap the content in ''' or any other characters or donot add comments or explanation:
  {
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
  initial:   [{referralName: '',  referralContact: '',  referralRelationship: '',  referralNotes: ''}],
  prompt: `Extract referral information.
Return as JSON array, donot wrap the content in ''' or any other characters or donot add comments or explanation or donot skip a field every field is important:
  [{
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
  fields: ['hobbiesList'],
  initial: {"hobbiesList": ''},
  prompt: `Extract hobbies or interests.
  Return as JSON, donot wrap the content in ''' or any other characters or donot add comments or explanation:
  {
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