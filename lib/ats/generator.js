import { convertResumeToPromptString } from "@lib/redux/features/editor/generate/resume";

export function getAtsScores(formDataMap, displayJob) {
  if (!formDataMap || !displayJob) {
    throw new Error("getAtsScores: formDataMap and displayJob are required");
  }

  const resumeStr  = convertResumeToPromptString(formDataMap).toLowerCase();
  const jobStr     = (displayJob.rawDescription || "").toLowerCase();

  if (!jobStr.trim()) {
    throw new Error("getAtsScores: displayJob.rawDescription is empty");
  }

  const jobKeywords    = extractKeywords(jobStr);
  const resumeKeywords = extractKeywords(resumeStr);

  const keywordMatch    = scoreKeywordMatch(jobKeywords, resumeKeywords);
  const skillsAlignment = scoreSkillsAlignment(jobStr, resumeStr);
  const experienceMatch = scoreExperienceMatch(jobStr, resumeStr);
  const formatScore     = scoreFormat(formDataMap);

  const overallScore = Math.round(
    keywordMatch.score    * 0.35 +
    skillsAlignment.score * 0.30 +
    experienceMatch.score * 0.20 +
    formatScore.score     * 0.15
  );

  const suggestions = buildSuggestions({
    keywordMatch,
    skillsAlignment,
    experienceMatch,
    formatScore,
  });

  return {
    overallScore,
    sections: { keywordMatch, skillsAlignment, experienceMatch, formatScore },
    suggestions,
  };
}

// ---------------------------------------------------------------------------
// Keyword extraction
// ---------------------------------------------------------------------------

const STOP_WORDS = new Set([
  "the","and","for","with","that","this","are","you","have","will","from",
  "your","our","their","they","been","has","was","were","but","not","can",
  "all","also","more","into","its","than","such","any","each","when","who",
  "what","which","how","per","via","etc","must","may","able","need","well",
  "work","use","using","used","including","team","role","position","company",
  "about","we","us","an","a","of","to","in","is","it","be","as","at","or",
  "on","by","do","if","so","up","no","he","she","they","we","i","me","my",
]);

function extractKeywords(text) {
  return [
    ...new Set(
      text
        .toLowerCase()
        .replace(/[^a-z0-9+#.\s-]/g, " ")
        .split(/\s+/)
        .filter((w) => w.length > 2 && !STOP_WORDS.has(w))
    ),
  ];
}

// ---------------------------------------------------------------------------
// Section scorers
// ---------------------------------------------------------------------------

const SKILL_PATTERNS = [
  // Languages
  "javascript","typescript","python","java","kotlin","swift","go","rust","c\\+\\+","c#","ruby","php","scala",
  // Frameworks
  "react","next\\.js","vue","angular","node\\.js","express","django","flask","spring","rails","laravel","fastapi",
  // Cloud & infra
  "aws","gcp","azure","docker","kubernetes","terraform","ci/cd","github actions",
  // Data
  "sql","postgresql","mysql","mongodb","redis","elasticsearch","kafka","spark",
  // Soft skills
  "leadership","communication","collaboration","mentoring","agile","scrum","kanban",
  // Design / product
  "figma","ux","ui","product management","a/b testing","analytics",
];

function scoreKeywordMatch(jobKeywords, resumeKeywords) {
  const resumeSet = new Set(resumeKeywords);
  const matched   = jobKeywords.filter((k) => resumeSet.has(k));
  const missing   = jobKeywords.filter((k) => !resumeSet.has(k)).slice(0, 15);

  const score =
    jobKeywords.length === 0
      ? 100
      : Math.min(100, Math.round((matched.length / jobKeywords.length) * 100));

  return { score, matched: matched.slice(0, 20), missing };
}

function scoreSkillsAlignment(jobStr, resumeStr) {
  const matched = [];
  const missing = [];

  for (const pattern of SKILL_PATTERNS) {
    const re       = new RegExp(`\\b${pattern}\\b`, "i");
    const inJob    = re.test(jobStr);
    const inResume = re.test(resumeStr);

    if (inJob && inResume)  matched.push(normalizeSkill(pattern));
    else if (inJob)         missing.push(normalizeSkill(pattern));
  }

  const total = matched.length + missing.length;
  const score =
    total === 0 ? 80 : Math.min(100, Math.round((matched.length / total) * 100));

  return { score, matched, missing };
}

function normalizeSkill(pattern) {
  return pattern
    .replace(/\\b/g, "")
    .replace(/\\\./g, ".")
    .replace(/\\\+/g, "+")
    .replace(/\\#/g, "#");
}

function scoreExperienceMatch(jobStr, resumeStr) {
  const jobYears    = parseYearsRequired(jobStr);
  const resumeYears = parseYearsInResume(resumeStr);

  let score = 80;
  let notes = "Could not detect explicit experience requirements.";

  if (jobYears !== null && resumeYears !== null) {
    if (resumeYears >= jobYears) {
      score = 100;
      notes = `Resume reflects ~${resumeYears} yrs; role requires ${jobYears} yrs. ✓`;
    } else {
      const gap = jobYears - resumeYears;
      score = Math.max(0, Math.round(100 - gap * 15));
      notes = `Resume reflects ~${resumeYears} yrs; role requires ${jobYears} yrs (gap: ${gap} yrs).`;
    }
  } else if (jobYears !== null) {
    notes = `Role requires ${jobYears}+ years experience; could not detect resume total.`;
  }

  return { score, notes };
}

function parseYearsRequired(jobStr) {
  const m = jobStr.match(/(\d+)\+?\s*years?\s*(of\s+)?(experience|exp)/i);
  return m ? parseInt(m[1], 10) : null;
}

function parseYearsInResume(resumeStr) {
  // Handles both "2019 - 2023" and "05-2023" style dates from workExperience
  const yearRanges = [...resumeStr.matchAll(/\b(20\d{2}|19\d{2})\b.*?\b(20\d{2}|present|current)\b/gi)];
  if (!yearRanges.length) return null;

  const now   = new Date().getFullYear();
  // Deduplicate by start year to avoid double-counting overlapping entries
  const seen  = new Set();
  let   total = 0;

  for (const m of yearRanges) {
    const start  = parseInt(m[1], 10);
    const endRaw = m[2].toLowerCase();
    const end    = endRaw === "present" || endRaw === "current" ? now : parseInt(m[2], 10);
    const key    = `${start}-${end}`;
    if (!isNaN(start) && !isNaN(end) && end >= start && !seen.has(key)) {
      seen.add(key);
      total += end - start;
    }
  }

  return total > 0 ? total : null;
}

function scoreFormat(formDataMap) {
  const issues = [];

  // Real field names from formDataMap shape:
  // personalInformation.email, personalInformation.phoneNumber, personalInformation.fullName
  // careerSummary.summary, workExperience[], educationHistory[]
  const pi = formDataMap?.personalInformation;

  if (!pi?.email)                                                                       issues.push("Missing email address");
  if (!pi?.phoneNumber)                                                                 issues.push("Missing phone number");
  if (!pi?.fullName)                                                                    issues.push("Missing candidate name");
  if (!formDataMap?.careerSummary?.summary)                                             issues.push("No career summary section");
  if (!Array.isArray(formDataMap?.workExperience) || !formDataMap.workExperience.length) issues.push("No work experience section detected");
  if (!Array.isArray(formDataMap?.educationHistory) || !formDataMap.educationHistory.length) issues.push("No education section detected");

  const score = Math.max(0, Math.round(((6 - issues.length) / 6) * 100));
  const notes =
    issues.length === 0
      ? "All key sections present — good ATS structure."
      : `Incomplete sections: ${issues.join(", ")}.`;

  return { score, notes };
}

// ---------------------------------------------------------------------------
// Suggestions builder
// ---------------------------------------------------------------------------

function buildSuggestions({ keywordMatch, skillsAlignment, experienceMatch, formatScore }) {
  const suggestions = [];

  if (keywordMatch.missing.length > 0) {
    suggestions.push(
      `Add missing keywords from the job description: ${keywordMatch.missing.slice(0, 5).join(", ")}.`
    );
  }

  if (skillsAlignment.missing.length > 0) {
    suggestions.push(
      `Consider highlighting these required skills: ${skillsAlignment.missing.slice(0, 4).join(", ")}.`
    );
  }

  if (keywordMatch.score < 50) {
    suggestions.push(
      "Your resume matches fewer than half the job's keywords — tailor your bullet points more closely to the job description."
    );
  }

  if (experienceMatch.score < 70) {
    suggestions.push(
      "The job may require more years of experience than your resume shows. Quantify and expand on relevant roles."
    );
  }

  if (formatScore.score < 100) {
    suggestions.push(formatScore.notes);
  }

  if (skillsAlignment.score >= 80 && keywordMatch.score >= 70) {
    suggestions.push(
      "Strong keyword alignment — make sure bullet points include measurable achievements (numbers, %, $)."
    );
  }

  if (suggestions.length === 0) {
    suggestions.push(
      "Resume looks well-aligned. Double-check for tables or graphics that ATS parsers may skip."
    );
  }

  return suggestions;
}