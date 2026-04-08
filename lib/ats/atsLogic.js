/**
 * OPTIMIZED ATS SCORING ENGINE
 * Built for O(n) performance with pre-compiled regex and single-pass scoring.
 */

// 1. O(1) Lookup Sets & Taxonomies
const TAXONOMY = {
  NOISE: new Set([
    'about', 'job', 'title', 'location', 'remote', 'usa', 'united', 'states', 
    'type', 'full', 'time', 'part', 'flexible', 'role', 'seeking', 'decision', 
    'making', 'advanced', 'requirements', 'details', 'provided', 'description',
    'opportunity', 'benefits', 'salary', 'equal', 'employer', 'assumed', 'text'
  ]),

  // Fast Array scanning for substring matches
  TIERS: {
    HARD: { weight: 2.5, keywords: ['python', 'sql', 'react', 'next.js', 'aws', 'gcp', 'tableau', 'machine learning', 'api'] },
    DOMAIN: { weight: 1.5, keywords: ['analytics', 'visualization', 'git', 'agile', 'scrum', 'statistics'] }
  }
};

// 2. Pre-Compiled Regex for Seniority (Massive performance boost)
// Avoids compiling regex inside loops during runtime
const SENIORITY_LEVELS = [
  { label: "Executive / Lead", points: 5, threshold: 20, regex: /\b(principal|director|vp|head|architect|staff)\b/gi },
  { label: "Senior Level", points: 3, threshold: 10, regex: /\b(senior|sr\.|lead|expert|specialist)\b/gi },
  { label: "Associate Level", points: 1, threshold: 2, regex: /\b(junior|jr\.|associate|intern|entry)\b/gi }
];

// 3. Ultra-fast text normalization
const normalize = (t = "") => t.toLowerCase().replace(/[^a-z0-9.+#\s]/g, " ").replace(/\s+/g, " ").trim();

// 4. Heuristic Level Detection
const detectLevel = (text) => {
  let pts = 0;
  
  // Loop through pre-compiled regexes
  for (const level of SENIORITY_LEVELS) {
    const matches = text.match(level.regex);
    if (matches) {
      pts += matches.length * level.points;
    }
  }

  // Return highest qualified threshold
  if (pts >= SENIORITY_LEVELS[0].threshold) return SENIORITY_LEVELS[0].label;
  if (pts >= SENIORITY_LEVELS[1].threshold) return SENIORITY_LEVELS[1].label;
  if (pts >= SENIORITY_LEVELS[2].threshold) return SENIORITY_LEVELS[2].label;
  return "Professional"; 
};

// 5. Main Scoring Engine (Single Pass O(k) complexity)
export const runAtsAnalysis = (resumeRaw, jobRaw) => {
  const resume = normalize(resumeRaw);
  const job = normalize(jobRaw);

  // A. Fast Pattern Matching
  const phrases = job.match(/\b[a-z0-9+#.]+(?:\s+[a-z0-9+#.]+){1,2}\b/g) || [];
  const singles = (job.match(/\b[a-z0-9+#.]{3,}\b/g) || []).filter(w => !TAXONOMY.NOISE.has(w));
  
  // Deduplicate using Set
  const uniqueJdKeywords = [...new Set([...phrases, ...singles])];

  // B. Single-Pass Math & Sorting
  let hitScore = 0;
  let totalScore = 0;
  const found = [];
  const missing = [];

  for (let i = 0; i < uniqueJdKeywords.length; i++) {
    const k = uniqueJdKeywords[i];
    let weight = 0.5; // Default Soft-Skill Weight

    // Check high-value tiers
    if (TAXONOMY.TIERS.HARD.keywords.some(s => k.includes(s))) {
      weight = TAXONOMY.TIERS.HARD.weight;
    } else if (TAXONOMY.TIERS.DOMAIN.keywords.some(s => k.includes(s))) {
      weight = TAXONOMY.TIERS.DOMAIN.weight;
    }

    totalScore += weight;

    // Check presence in resume
    if (resume.includes(k)) {
      hitScore += weight;
      found.push(k);
    } else {
      missing.push(k);
    }
  }

  // C. Calculate Final Metric (Prevent divide by zero)
  const rawScore = totalScore === 0 ? 0 : Math.round((hitScore / totalScore) * 100);

  return {
    score: Math.min(rawScore, 99), // Cap at 99 to leave room for AI strategy
    verdict: rawScore >= 80 ? "Strategic Alignment" : rawScore >= 55 ? "Solid Foundation" : "Potential Match",
    candidateLevel: detectLevel(resumeRaw), 
    jobLevel: detectLevel(jobRaw),
    // Limit array sizes to prevent UI lag on massive job descriptions
    found: found.slice(0, 15),
    missing: missing.slice(0, 15)
  };
};