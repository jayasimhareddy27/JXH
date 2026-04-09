// samplecoverletter.js
export const sampleCoverLetter = {
  personalInformation: {
    fullName: "JONATHAN DOE",
    email: "j.doe@example.com",
    phoneNumber: "+1 123-456-7890",
    address: "123 Innovation Way, Aurora, IL 60505" //
  },
  recipientInformation: {
    managerName: "Hiring Manager",
    companyName: "TechCorp Solutions",
    companyAddress: "456 Enterprise Dr, Chicago, IL 60601",
    positionTitle: "Senior Full-Stack Developer"
  },
  letterMeta: {
    date: "February 05, 2026",
    subjectLine: "Application for Senior Full-Stack Developer Position",
    referenceNumber: "REQ-2026-089"
  },
  letterContent: {
    salutation: "Dear Hiring Manager,",
    intro: "I am writing to express my enthusiastic interest in the Senior Full-Stack Developer position at TechCorp Solutions. As a highly motivated developer based in Aurora, IL, currently on an F1 OPT visa, I bring a robust technical foundation in building scalable web applications with Next.js.", //
    bodyParagraphs: [
      "During my development of 'Job x Chaser', a comprehensive job-hunting platform, I architected a full-stack solution using Next.js and MongoDB. I successfully implemented complex features such as DOCX parsing and automated document generation, significantly improving the user experience for career seekers. My experience in analyzing system requirements and optimizing server-side performance aligns perfectly with the goals of your engineering team." //
    ],
    conclusion: "I am excited about the opportunity to bring my unique blend of technical leadership and full-stack expertise to TechCorp Solutions. Thank you for your time and consideration. I look forward to the possibility of discussing how my background in Next.js development can support your team's upcoming initiatives."
  },
  signOff: {
    complimentaryClose: "Sincerely,",
    signatureName: "Jonathan Doe"
  }
};
