// index.js
import Template01Preview from './preview';
import Template01 from './page';

export const layoutGrid01 = {
  primary: "grid grid-cols-1 gap-6",
};

// index.js
export const COVERLETTER_IDS01 = {
  PAGE: "page",
  
  // Section Wrappers (These open the main tabs)
  HEADER: "personalInformation", 
  RECIPIENT_BLOCK: "recipientInformation", 
  SUBJECT_BLOCK: "letterMeta",
  BODY_WRAPPER: "letterBodyParagraphs",
  SIGN_OFF_BLOCK: "signOff",

  // Individual Fields (These highlight specific inputs within tabs)
  SENDER_NAME: "name",
  SENDER_EMAIL: "email",
  SENDER_PHONE: "phone",
  SENDER_ADDRESS: "address",

  DATE: "date",
  RECIPIENT_NAME: "managerName",
  RECIPIENT_COMPANY: "companyName",
  RECIPIENT_ADDRESS: "companyAddress",

  SUBJECT: "subjectLine",
  REF_NUMBER: "referenceNumber",

  SALUTATION: "salutation",
  INTRO: "intro",
  BODY_PARA: (i) => `bodyParagraph_${i}`,
  CONCLUSION: "conclusion",

  CLOSE: "complimentaryClose",
  SIGNATURE: "signatureName",
};

export { Template01, Template01Preview };