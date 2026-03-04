// index.js
import Template01Preview from './preview';
import Template01 from './page';

export const layoutGrid01 = {
  primary: "grid grid-cols-1 gap-6",
};

export const COVERLETTER_IDS01 = {
  PAGE: "page",
  HEADER: "header",
  
  // Sender info
  SENDER_NAME: "senderName",
  SENDER_EMAIL: "senderEmail",
  SENDER_PHONE: "senderPhone",
  SENDER_ADDRESS: "senderAddress",

  // --- NEW: RECIPIENT BLOCK WRAPPER ---
  // Allows the user to select the entire block for spacing/style changes
  RECIPIENT_BLOCK: "recipientBlock", 
  DATE: "letterDate",
  RECIPIENT_NAME: "managerName",
  RECIPIENT_COMPANY: "companyName",
  RECIPIENT_ADDRESS: "companyAddress",

  // --- NEW: SUBJECT SECTION ---
  // Vital for formal letters to keep the 'RE:' line distinct
  SUBJECT_BLOCK: "subjectBlock",
  SUBJECT: "subjectLine",
  REF_NUMBER: "referenceNumber",

  // Content
  SALUTATION: "salutation",
  INTRO: "intro",
  BODY_WRAPPER: "letterBodyParagraphs",
  BODY_PARA: (i) => `bodyParagraph_${i}`,
  CONCLUSION: "conclusion",

  // Sign off
  // --- NEW: SIGN OFF WRAPPER ---
  SIGN_OFF_BLOCK: "signOffBlock",
  CLOSE: "complimentaryClose",
  SIGNATURE: "signatureName",
};

export { Template01, Template01Preview };