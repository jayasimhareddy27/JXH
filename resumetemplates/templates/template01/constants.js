export const layoutGrid = {
    primary: "grid grid-cols-1 gap-8",
    secondary: "grid grid-cols-3 gap-8",
    tertiary: "grid grid-cols-3 gap-8",
    quaternary: "grid grid-cols-2 gap-8"
  };


export const RESUME_IDS = {
  PAGE: "page",
  HEADER: "header",
  FULL_NAME: "fullName",
  CONTACT: "contact",
  SUMMARY: "summary",
  
  // Outer Section Wrappers
  EXPERIENCE: 'EXPERIENCE',
  PROJECTS: 'PROJECTS',
  EDUCATION: 'EDUCATION',
  CERTIFICATIONS: 'CERTIFICATIONS',

  // Work Experience
  JOB_ITEM: (i) => `job_${i}`,
  JOB_TITLE: (i) => `jobTitle_${i}`,
  JOB_COMPANY: (i) => `jobCompany_${i}`,
  JOB_DATES: (i) => `jobDates_${i}`,
  JOB_DESC: (i) => `jobDesc_${i}`,

  // Projects
  PROJECT_ITEM: (i) => `project_${i}`,
  PROJECT_NAME: (i) => `projectName_${i}`,
  PROJECT_TECH: (i) => `projectTech_${i}`,
  PROJECT_DESC: (i) => `projectDesc_${i}`,

  // Education
  EDU_ITEM: (i) => `edu_${i}`,
  EDU_DEGREE: (i) => `eduDegree_${i}`,
  EDU_SCHOOL: (i) => `eduSchool_${i}`,
  EDU_GPA: (i) => `eduGpa_${i}`,

  // Certs & Sidebar
  CERT_ITEM: (i) => `cert_${i}`,
  SIDEBAR_LEFT: "sidebarLeft",
  SIDEBAR_RIGHT: "sidebarRight",
};