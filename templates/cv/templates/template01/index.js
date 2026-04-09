// index.js
import Template01 from './page';
import Template01Preview from './preview';

// ====================== LAYOUT GRID CONFIG ======================
export const layoutGrid01 = {
  primary: "grid grid-cols-1 ",           // Single Column - Clean Professional
  secondary: "grid grid-cols-3 gap-8",         // Classic Sidebar Layout
  tertiary: "grid grid-cols-4 gap-6",          // Balanced Modern
  quaternary: "grid grid-cols-5 gap-6",        // Wide Sidebar
};

// ====================== RESUME IDS 01 - Comprehensive ======================
export const RESUME_IDS01 = {
  // ==================== PAGE & GLOBAL ====================
  PAGE: "page",
  HEADER: "header",
  PERSONAL_INFO: "personalInformation",
  CONTACT_INFO: "contactInfo",

  // ==================== PERSONAL INFORMATION ====================
  FULL_NAME: "fullName",
  EMAIL: "email",
  PHONE_NUMBER: "phoneNumber",
  ADDRESS: "address",

  // ==================== SECTION WRAPPERS & TITLES ====================
  CAREER_SUMMARY: "careerSummary",
  CAREER_SUMMARY_TITLE: "careerSummary_title",
  CAREER_SUMMARY_DECORATOR: "careerSummary_decorator",
  CAREER_SUMMARY_CONTENT: "summary",

  EXPERIENCE: "workExperience",
  EXPERIENCE_DECORATOR: "experience_decorator",
  EXPERIENCE_TITLE: "workExperience_title",

  PROJECTS: "projects",
  PROJECTS_DECORATOR: "projects_decorator",
  PROJECTS_TITLE: "projects_title",

  EDUCATION: "educationHistory",
  EDUCATION_DECORATOR: "educationHistory_decorator",
  EDUCATION_TITLE: "educationHistory_title",

  SKILLS_SUMMARY: "skillsSummary",
  SKILLS_SUMMARY_DECORATOR: "skillsSummary_decorator",
  SKILLS_SUMMARY_TITLE: "skillsSummary_title",

  CERTIFICATIONS: "certifications",
  CERTIFICATIONS_DECORATOR: "certifications_decorator",
  CERTIFICATIONS_TITLE: "certifications_title",

  // ==================== WORK EXPERIENCE - Fully Granular ====================
  JOB_ITEM: (i) => `job_${i}`,
  JOB_HEADER: (i) => `job_header_${i}`,
  JOB_TITLE: (i) => `jobTitle_${i}`,
  JOB_COMPANY: (i) => `jobCompany_${i}`,
  JOB_DATES: (i) => `jobDates_${i}`,
  JOB_DESC_POINT: (jobIdx, pointIdx) => `jobDesc_${jobIdx}_p${pointIdx}`,

  // ==================== PROJECTS - Fully Granular ====================
  PROJECT_ITEM: (i) => `project_${i}`,
  PROJECT_HEADER: (i) => `project_header_${i}`,
  PROJECT_NAME: (i) => `projectName_${i}`,
  PROJECT_TECH: (i) => `projectTech_${i}`,
  PROJECT_DESC_POINT: (projIdx, pointIdx) => `projectDesc_${projIdx}_p${pointIdx}`,

  // ==================== EDUCATION - Granular ====================
  EDU_ITEM: (i) => `edu_${i}`,
  EDU_SCHOOL: (i) => `eduSchool_${i}`,
  EDU_DEGREE: (i) => `eduDegree_${i}`,
  EDU_DATES: (i) => `eduDates_${i}`,

  // ==================== SKILLS ====================
  TECHNICAL_SKILLS: "technicalSkills",
  TOOLS: "tools",
  SOFT_SKILLS: "softSkills",

  // ==================== CERTIFICATIONS ====================
  CERT_ITEM: (i) => `cert_${i}`,
  CERT_NAME: (i) => `certName_${i}`,

  // ==================== SIDEBAR ====================
  SIDEBAR_LEFT: "sidebarLeft",
  SIDEBAR_RIGHT: "sidebarRight",

  // ==================== HELPERS ====================
};



export { Template01, Template01Preview };