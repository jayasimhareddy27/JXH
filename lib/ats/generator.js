import { convertResumeToPromptString } from "@lib/redux/features/editor/generate/resume";
import { extractKeywords, keywordCoverage } from "./keywords";
import { TAXONOMY } from "./taxonomy";

/**
 * Advanced Seniority Heuristic
 * Determines level based on keyword density and experience markers.
 */
const detectSeniorityPro = (text) => {
  const content = text.toLowerCase();
  let score = 0;

  Object.entries(TAXONOMY.LEVEL_MAP).forEach(([level, config]) => {
    config.terms.forEach(term => {
      const matches = (content.match(new RegExp(`\\b${term}\\b`, 'g')) || []).length;
      score += (level === 'JUNIOR' ? matches * config.points : matches * config.points);
    });
  });

  if (score > 15) return "Executive / Lead";
  if (score > 5) return "Senior Professional";
  if (score < 0) return "Junior / Entry";
  return "Mid-Level Professional";
};

export const generatescore = async (formDataMap, currentJob) => {
  try {
    const resumeStr = convertResumeToPromptString(formDataMap);
    const jobStr = currentJob.rawDescription || "";

    // 1. Filter out administrative "noise" keywords
    const jdKeywords = extractKeywords(jobStr).filter(k => 
      !TAXONOMY.METADATA_FILTER.has(k.toLowerCase())
    );

    const score = keywordCoverage(resumeStr, jobStr, jdKeywords);

    return {
      score,
      verdict: score >= 85 ? "Strategic Fit" : score >= 60 ? "Strong Potential" : "Low Alignment",
      levels: {
        // Points-based detection ensures you are seen as Mid-Level, not Lead
        candidate: detectSeniorityPro(resumeStr), 
        job: detectSeniorityPro(jobStr)
      },
      found: jdKeywords.filter(k => resumeStr.toLowerCase().includes(k.toLowerCase())).slice(0, 12),
      missing: jdKeywords.filter(k => !resumeStr.toLowerCase().includes(k.toLowerCase())).slice(0, 12)
    };
  } catch (err) {
    return { score: 0, verdict: "System Error" };
  }
};