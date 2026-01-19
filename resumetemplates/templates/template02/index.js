import Template02Preview from './preview';
import Template02 from './page';

export const layoutGrid02 = {
    primary: "grid grid-cols-1 gap-8",
    secondary: "grid grid-cols-3 gap-8",
    tertiary: "grid grid-cols-3 gap-8",
    quaternary: "grid grid-cols-3 gap-8"
  };



export const RESUME_IDS02 = {
  // Page & Layout
  PAGE: "page",
  HEADER: "header",
  FOOTER: "footer",
  
  // Personal Information
  FULL_NAME: "fullName",
  FIRST_NAME: "firstName",
  LAST_NAME: "lastName",
  EMAIL: "email",
  PHONE_NUMBER: "phoneNumber",
  ADDRESS: "address",
  DATE_OF_BIRTH: "dateOfBirth",
  GENDER: "gender",
  NATIONALITY: "nationality",

  // Online Profiles
  LINKEDIN: "linkedin",
  GITHUB: "github",
  PORTFOLIO: "portfolio",
  PERSONAL_WEBSITE: "personalWebsite",
  OTHER_LINKS: "otherLinks",

  // Skills & Summary
  TECHNICAL_SKILLS: "technicalSkills",
  TOOLS: "tools",
  SOFT_SKILLS: "softSkills",
  LANGUAGES_SPOKEN: "languagesSpoken",
  CERTIFICATION_SKILLS: "certificationSkills",
  CAREER_SUMMARY: "careerSummary",

  // Outer Section Wrappers
  EXPERIENCE: "experience",
  PROJECTS: "projects",
  EDUCATION: "education",
  CERTIFICATIONS: "certifications",
  SIDEBAR_LEFT: "sidebarLeft",
  SIDEBAR_RIGHT: "sidebarRight",

  // Work Experience (dynamic)
  JOB_ITEM: (i) => `job_${i}`,
  JOB_TITLE: (i) => `jobTitle_${i}`,
  JOB_COMPANY: (i) => `jobCompany_${i}`,
  JOB_START: (i) => `jobStart_${i}`,
  JOB_END: (i) => `jobEnd_${i}`,
  JOB_DATES: (i) => `jobDates_${i}`, // combined display string
  JOB_LOCATION: (i) => `jobLocation_${i}`,
  JOB_DESC: (i) => `jobDesc_${i}`,

  // Projects (dynamic)
  PROJECT_ITEM: (i) => `project_${i}`,
  PROJECT_NAME: (i) => `projectName_${i}`,
  PROJECT_TECH: (i) => `projectTech_${i}`,
  PROJECT_DESC: (i) => `projectDesc_${i}`,
  PROJECT_LINK: (i) => `projectLink_${i}`,
  PROJECT_START: (i) => `projectStart_${i}`,
  PROJECT_END: (i) => `projectEnd_${i}`,

  // Education (dynamic)
  EDU_ITEM: (i) => `edu_${i}`,
  EDU_DEGREE: (i) => `eduDegree_${i}`,
  EDU_MAJOR: (i) => `eduMajor_${i}`,
  EDU_SCHOOL: (i) => `eduSchool_${i}`,
  EDU_GPA: (i) => `eduGpa_${i}`,
  EDU_START: (i) => `eduStart_${i}`,
  EDU_END: (i) => `eduEnd_${i}`,
  EDU_LOCATION: (i) => `eduLocation_${i}`,

  // Certifications (dynamic)
  CERT_ITEM: (i) => `cert_${i}`,
  CERT_NAME: (i) => `certName_${i}`,
  CERT_ISSUER: (i) => `certIssuer_${i}`,
  CERT_LINK: (i) => `certLink_${i}`,
  CERT_DATE: (i) => `certDate_${i}`,

  // Generic / fallback for any custom dynamic section
  CUSTOM_FIELD: (sectionKey, i, field) => `${sectionKey}_${i}_${field}`,
};


export {Template02,Template02Preview}
