import { WORD_WEIGHTS } from "./wordweights";
import { normalize } from "./normalize";

function extractPhrases(text) {
  return text.match(/\b[a-z]+(?:\s+[a-z]+){1,3}\b/g) || [];
}

function extractSingles(text) {
  return text.match(/\b[a-z0-9.+#]{2,}\b/g) || [];
}

function keywordWeight(keyword, jdText) {
  const words = keyword.split(" ");
  let weight = 1;

  words.forEach(w => {
    if (WORD_WEIGHTS[w]) weight *= Math.max(WORD_WEIGHTS[w], 0.2);
  });

  if (words.length > 1) weight += 0.3;
  if (jdText.includes(`required ${keyword}`)) weight += 1;
  if (jdText.includes(`must have ${keyword}`)) weight += 1;

  return Math.max(0.05, weight);
}

export function extractKeywords(jdText) {
  const text = normalize(jdText);
  const phrases = extractPhrases(text);
  const singles = extractSingles(text);
  return [...new Set([...phrases, ...singles])];
}

export function keywordCoverage(resumeText, jdText, keywords) {
  const resume = normalize(resumeText);
  const jd = normalize(jdText);

  let hit = 0;
  let total = 0;

  keywords.forEach(k => {
    const w = keywordWeight(k, jd);
    total += w;
    if (resume.includes(k)) hit += w;
  });

  return total ? Math.round((hit / total) * 100) : 0;
}
