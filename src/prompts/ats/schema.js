export const atsAnalysisPrompt = {
  id: 1,
  key: 'atsAnalysis',
  title: 'Professional Entity Extraction',
  prompt: `You are a professional data parser. Extract all technical and role-related entities from the Resume (JSON) and Job Description (Text). 
Return ONLY a valid JSON object. No explanation. No code blocks.

EXTRACTION RULES:
- "jd_keywords": Every technical tool, software, programming language, and certification mentioned in the Job Description.
- "resume_keywords": Every technical tool, software, programming language, and certification mentioned in the Candidate Resume.
- "soft_skills": Every interpersonal or methodology skill (e.g., Agile, Leadership, Communication) found in the Job Description.
- "jd_level": The required seniority level found in the Job (Intern, Entry, Junior, Mid, Senior, Lead).
- "resume_level": The candidate's detected seniority level based on their titles and years of experience.
- "strategic_advice": 3 short, high-impact phrases on how the candidate can better align their resume keywords with the job's keywords.

SCHEMA:
{
  "jd_keywords": [],
  "resume_keywords": [],
  "soft_skills": [],
  "jd_level": "",
  "resume_level": "",
  "strategic_advice": []
}

INPUT:
Resume: {{resumeData}}

Jobdescription: {{jobDescription}}
`
};

export const atsPromptMap = {
  [atsAnalysisPrompt.key]: atsAnalysisPrompt.prompt
};