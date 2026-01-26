export const jobExtractionPrompts = [
  {
    id: 1,
    key: 'jobCore',
    title: 'Core Info & Seniority',
    prompt: `Extract details. Return ONLY JSON. 
    IMPORTANT: If a field is missing, use an empty string "" — NEVER use null.
    {
      "companyName": "",
      "position": "",
      "jobLocation": "",
      "salaryRange": "",
      "jobUrl": "",
      "postedDate": "YYYY-MM-DD",
      "seniorityLevel": "",
      "jobType": "",
    } 
    Seniority: Intern, Entry Level, Junior, Mid-Level, Senior, Staff/Principal, or Lead/Manager. 
    JobType MUST be: Full-time, Part-time, Contract, Internship, or Not Mentioned
    Job text:`
  },
  {
    id: 2,
    key: 'jobDuties',
    title: 'Responsibilities',
    prompt: `Extract every duty, responsibility and requirement mentioned. Do not summarize or compress. 
    Return ONLY JSON. If missing, use empty string "":
    {
      "aiDescription": "Full bulleted string..."
    } 
    Job text:`
  },
  {
    id: 3,
    key: 'jobEligibility',
    title: 'Red Flag Eligibility',
    prompt: `Extract specific "deal-breaker" hurdles. Return ONLY a JSON array of objects. 
    If none found, return an empty array [].
    Focus on: Experience years, background checks, drug screens, degree levels, citizenship, and sponsorship status.
    Example: [{"tag": "5+ Years SQL"}, {"tag": "No Sponsorship Provided"}, {"tag": "US Citizen Only"}] 
    Do not assume; only extract if mentioned or strongly implied.
    Job text:`
  },
  {
    id: 4,
    key: 'jobInsights',
    title: 'Company & Culture',
    prompt: `Analyze the company. Return ONLY JSON. 
    IMPORTANT: Use "" for missing strings and [] for missing arrays — NEVER use null.
    {
      "perks": [], 
      "companyInsights": "", 
      "businessModel": ""
    } 
    "businessModel": Summarize what the company actually DOES.
    "companyInsights": Culture/EEO fluff.
    "perks": List specific benefits (401k, PTO, etc.). 
    Job text:`
  }
];

export const jobPromptMap = Object.fromEntries(
  jobExtractionPrompts.map((p) => [p.id, p.prompt])
);

export { jobExtractionPrompts };