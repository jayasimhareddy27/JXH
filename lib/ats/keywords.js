import { WORD_WEIGHTS } from "./wordweights";
import { normalize } from "./normalize";
import { TAXONOMY } from "./taxonomy";

function extractPhrases(text) {
  // Matches 2 to 4 word sequences to catch "project management" or "cloud architecture"
  return text.match(/\b[a-z]+(?:\s+[a-z]+){1,3}\b/g) || [];
}

function extractSingles(text) {
  // Matches single words including technical ones like C++, C#, .Net, Node.js
  return text.match(/\b[a-z0-9.+#]{2,}\b/g) || [];
}

function keywordWeight(keyword, jdText) {
  const words = keyword.split(" ");
  let weight = 1;

  words.forEach(w => {
    // Apply weight from dictionary; default to 0.2 for common words not found
    if (WORD_WEIGHTS[w]) weight *= Math.max(WORD_WEIGHTS[w], 0.2);
  });

  // Bonus for phrases (multi-word matches are usually more specific)
  if (words.length > 1) weight += 0.3;

  // Extra weight for explicitly required skills
  if (jdText.includes(`required ${keyword}`) || jdText.includes(`requirements ${keyword}`)) weight += 1;
  if (jdText.includes(`must have ${keyword}`) || jdText.includes(`essential ${keyword}`)) weight += 1;

  return Math.max(0.05, weight);
}


export function extractKeywords(text) {
  const cleanText = normalize(text);
  
  // Pattern 1: Multi-word technical concepts (2-3 words)
  const phrases = cleanText.match(/\b[a-z0-9#+.]+(?:\s+[a-z0-9#+.]+){1,2}\b/g) || [];
  
  // Pattern 2: Vital single technical entities (3+ chars, excluding noise)
  const singles = (cleanText.match(/\b[a-z0-9#+.]{3,}\b/g) || [])
    .filter(word => !TAXONOMY.METADATA_FILTER.has(word));

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