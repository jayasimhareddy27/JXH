import Template01Preview from './preview';
import Template01 from './page';

// Your updated grid configuration
export const layoutGrid01 = {
  primary: "grid grid-cols-1 gap-6",               // Modern Standard
  secondary: "grid grid-cols-3 gap-8",             // Classic Sidebar
  tertiary: "grid grid-cols-4 gap-6",              // Compact Modern
};

export const RESUME_IDS01 = {
  // --- Page & Layout ---
  PAGE: "page",
  HEADER: "header",
  FOOTER: "footer",
  
  // --- Personal Information ---
  PERSONAL_INFO: "personalInformation",
  PERSONAL_INFO_TITLE: "personalInformation_title",
  FULL_NAME: "fullName",
  FIRST_NAME: "firstName",
  LAST_NAME: "lastName",
  EMAIL: "email",
  PHONE_NUMBER: "phoneNumber",
  ADDRESS: "address",

  // --- Online Profiles ---
  ONLINE_PROFILES: "onlineProfiles",
  ONLINE_PROFILES_TITLE: "onlineProfiles_title",
  LINKEDIN: "linkedin",
  GITHUB: "github",
  PORTFOLIO: "portfolio",
  PERSONAL_WEBSITE: "personalWebsite",
  OTHER_LINKS: "otherLinks",

  // --- Skills & Summary ---
  SKILLS_SUMMARY: "skillsSummary",
  SKILLS_SUMMARY_TITLE: "skillsSummary_title",
  TECHNICAL_SKILLS: "technicalSkills",
  TOOLS: "tools",
  SOFT_SKILLS: "softSkills",
  LANGUAGES_SPOKEN: "languagesSpoken",
  CERTIFICATION_SKILLS: "certificationSkills",
  
  CAREER_SUMMARY: "careerSummary",
  CAREER_SUMMARY_TITLE: "careerSummary_title",

  // --- Outer Section Wrappers ---
  EXPERIENCE: "workExperience",
  EXPERIENCE_TITLE: "workExperience_title",
  
  PROJECTS: "projects",
  PROJECTS_TITLE: "projects_title",
  
  EDUCATION: "educationHistory",
  EDUCATION_TITLE: "educationHistory_title",
  
  CERTIFICATIONS: "certifications",
  CERTIFICATIONS_TITLE: "certifications_title",
  
  SIDEBAR_LEFT: "sidebarLeft",
  SIDEBAR_RIGHT: "sidebarRight",

  // --- Work Experience (Dynamic) ---
  JOB_ITEM: (i) => `job_${i}`,
  JOB_TITLE: (i) => `jobTitle_${i}`,
  JOB_COMPANY: (i) => `jobCompany_${i}`,
  JOB_START: (i) => `jobStart_${i}`,
  JOB_END: (i) => `jobEnd_${i}`,
  JOB_DATES: (i) => `jobDates_${i}`,
  JOB_LOCATION: (i) => `jobLocation_${i}`,
  JOB_DESC: (i) => `jobDesc_${i}`,
  /** * NEW: Granular ID for individual bullet points. 
   * Allows clicking and editing a single line in the experience list.
   */
  JOB_DESC_POINT: (jobIdx, pointIdx) => `jobDesc_${jobIdx}_p${pointIdx}`,

  // --- Projects (Dynamic) ---
  PROJECT_ITEM: (i) => `project_${i}`,
  PROJECT_NAME: (i) => `projectName_${i}`,
  PROJECT_TECH: (i) => `projectTech_${i}`,
  PROJECT_DESC: (i) => `projectDesc_${i}`,
  /** * NEW: Granular ID for individual project bullet points. 
   */
  PROJECT_DESC_POINT: (projIdx, pointIdx) => `projectDesc_${projIdx}_p${pointIdx}`,
  PROJECT_LINK: (i) => `projectLink_${i}`,
  PROJECT_START: (i) => `projectStart_${i}`,
  PROJECT_END: (i) => `projectEnd_${i}`,

  // --- Education (Dynamic) ---
  EDU_ITEM: (i) => `edu_${i}`,
  EDU_DEGREE: (i) => `eduDegree_${i}`,
  EDU_MAJOR: (i) => `eduMajor_${i}`,
  EDU_SCHOOL: (i) => `eduSchool_${i}`,
  EDU_GPA: (i) => `eduGpa_${i}`,
  EDU_START: (i) => `eduStart_${i}`,
  EDU_END: (i) => `eduEnd_${i}`,
  EDU_LOCATION: (i) => `eduLocation_${i}`,

  // --- Certifications (Dynamic) ---
  CERT_ITEM: (i) => `cert_${i}`,
  CERT_NAME: (i) => `certName_${i}`,
  CERT_ISSUER: (i) => `certIssuer_${i}`,
  CERT_LINK: (i) => `certLink_${i}`,
  CERT_DATE: (i) => `certDate_${i}`,

  // --- Generic / Fallback ---
  CUSTOM_FIELD: (sectionKey, i, field) => `${sectionKey}_${i}_${field}`,
};


export {Template01,Template01Preview}
