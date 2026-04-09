// Prompt templates for Cover Letter extraction and generation
const clFormatPrompts = {
  personalInformation: {
    id: 1,
    key: 'personalInformation',
    title: 'Your Contact Info', // UPDATED
    arrayFieldKey: false,
    fields: ['name', 'email', 'phone', 'address', ],
    initial: {   name: '',   email: '',   phone: '',   address: ''},
    prompt: `Act as an expert document parser. Extract the sender's contact details.
Return ONLY a valid JSON object. No prose, no markdown code blocks, no explanation.
{
  "name": "Full Name",
  "email": "Email Address",
  "phone": "Phone Number",
  "address": "Full physical address"
}
Use null for any field not explicitly found.

Source Text:`
  },

  recipientInformation: {
    id: 2,
    key: 'recipientInformation',
    title: 'Employer Information', // UPDATED
    arrayFieldKey: false,
    fields: ['managerName', 'companyName', 'companyAddress', 'positionTitle'],
    initial: {   managerName: '',   companyName: '',   companyAddress: '',   positionTitle: ''},
    prompt: `Identify the hiring manager and company details from the text.
Return ONLY a valid JSON object. 
{
  "managerName": "Name of manager or 'Hiring Manager'",
  "companyName": "Name of the target company",
  "companyAddress": "Full company address if available",
  "positionTitle": "The job title being applied for"
}
Use null for missing fields.

Source Text:`
  },

  letterMeta: {
    id: 3,
    key: 'letterMeta',
    title: 'Date & Subject Line', // UPDATED
    arrayFieldKey: false,
    fields: ['date', 'subjectLine', 'referenceNumber'],
    initial: { 
      date: '', 
      subjectLine: '', 
      referenceNumber: '' 
    },
    prompt: `Extract the formal elements of the letter.
Return ONLY a valid JSON object.
{
  "date": "MM-DD-YYYY",
  "subjectLine": "The RE: or Subject line of the letter",
  "referenceNumber": "Job ID or Ref Number"
}
If no date is found, use the current date. 

Source Text:`
  },

  letterContent: {
    id: 4,
    key: 'letterContent',
    title: 'Greeting & Opening', // UPDATED
    arrayFieldKey: false,
    fields: ['salutation', 'intro', 'conclusion'],
    initial: { 
      salutation: '', 
      intro: '', 
      conclusion: ''
    },
    prompt: `Extract the opening and closing remarks. Do not extract the main body paragraphs here.
Return ONLY a valid JSON object.
{
  "salutation": "The formal greeting",
  "intro": "The opening paragraph stating intent",
  "conclusion": "The final call to action or closing paragraph"
}

Source Text:`
  },

  Letterbody: {
    id: 5,
    key: 'letterBodyParagraphs',
    title: 'Letter Content', // UPDATED
    arrayFieldKey: true,
    fields: ['bodyParagraph'],
    initial: [
      { bodyParagraph: "" }
    ],
    prompt: `Extract the core experience paragraphs. Break the main text into a logical sequence of paragraphs.
Return ONLY a JSON array of objects.
[
  { "bodyParagraph": "" },
] 
Do not include the salutation or the sign-off.

Source Text:`
  },  
  onlineProfiles: {
    id: 6,
    key: 'onlineProfiles',
    title: 'Social & Portfolio Links', // UPDATED
    arrayFieldKey: false,
    fields: ['linkedin', 'github', 'portfolio', 'other'],
    initial: {
      linkedin: '', 
      github: '', 
      portfolio: '', 
      other: ''
    },
    prompt: `Extract the core experience paragraphs. Break the main text into a logical sequence of paragraphs.
Return ONLY a JSON array of objects.
{
  "linkedin": "",
  "github": "",
  "portfolio": "",
  "other": ""
}
Do not include the salutation or the sign-off.

Source Text:`
  },  

  signOff: {
    id: 7,
    key: 'signOff',
    title: 'Closing & Signature', // UPDATED
    arrayFieldKey: false,
    fields: ['complimentaryClose', 'signatureName'],
    initial: { 
      complimentaryClose: '', 
      signatureName: '' 
    },
    prompt: `Extract the formal sign-off.
Return ONLY a valid JSON object.
{
  "complimentaryClose": "e.g., Sincerely, or Best Regards,",
  "signatureName": "The sender's full name as written at the bottom"
}

Source Text:`
  }
};

// Exports remains the same
export const clExtractionPhases = Object.values(clFormatPrompts);
export const clPromptMap = Object.fromEntries(
  Object.values(clFormatPrompts).map((p) => [p.id, p.prompt])
);
export { clFormatPrompts };