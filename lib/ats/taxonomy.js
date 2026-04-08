export const TAXONOMY = {
  // Universal Noise Filter: Scrubs boilerplate from any job posting
  STRUCTURAL_BOILERPLATE: new Set([
    'about', 'job', 'title', 'location', 'remote', 'usa', 'united', 'states', 
    'type', 'full', 'time', 'part', 'flexible', 'role', 'seeking', 'decision', 
    'making', 'advanced', 'requirements', 'details', 'provided', 'description',
    'opportunity', 'benefits', 'salary', 'equal', 'employer', 'assumed', 'text'
  ]),

  // Multiplier Tiers: Logic to weigh Hard Skills vs. Soft Skills
  TIER_MULTIPLIERS: {
    HARD_SKILLS: 2.0,   // High-impact (e.g., Python, AWS, React)
    DOMAIN_KNOWLEDGE: 1.5, // Industry-specific (e.g., SDLC, Agile, HIPAA)
    SOFT_SKILLS: 0.8,   // Transferable (e.g., Leadership, Communication)
    ACTION_VERBS: 1.2   // Impact markers (e.g., Orchestrated, Optimized)
  },

  // Seniority Thresholds: Adaptive level detection
  LEVEL_DEFINITIONS: {
    EXECUTIVE: { terms: ['principal', 'director', 'vp', 'head', 'architect', 'staff'], min_pts: 20 },
    SENIOR: { terms: ['senior', 'sr.', 'lead', 'expert', 'specialist'], min_pts: 10 },
    JUNIOR: { terms: ['junior', 'jr.', 'associate', 'intern', 'entry'], min_pts: 2 }
  }
};