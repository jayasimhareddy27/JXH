import { flattenWeightedResume, getEmbedding } from "@lib/vectorutils";
function cosineSimilarity(vecA, vecB) {
  const dotProduct = vecA.reduce((sum, a, i) => sum + a * vecB[i], 0);
  const magA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0));
  const magB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0));
  return magA && magB ? dotProduct / (magA * magB) : 0;
}

function getMissingKeywords(resumeText, jdText) {
  const metaNoise = new Set(['job', 'description', 'resume', 'match', 'keywords', 'simplify', 'senior', 'specialist']);
  const stopWords = new Set(['and', 'the', 'with', 'for', 'you', 'will', 'our']);
  
  const jdWords = jdText.toLowerCase().match(/\b[a-z]{3,}\b/g) || [];
  const resumeWords = new Set(resumeText.toLowerCase().match(/\b[a-z]{3,}\b/g) || []);
  
  return [...new Set(jdWords)].filter(word => 
    !resumeWords.has(word) && !stopWords.has(word) && !metaNoise.has(word)
  ).slice(0, 8);
}

export async function POST(req) {
  try {
    const { formDataMap, jobDescription } = await req.json();
    const vJD = await getEmbedding(jobDescription);

    const scorePart = async (text) => {
      if (!text || text.length < 5) return 0;
      const vec = await getEmbedding(text);
      return cosineSimilarity(vec, vJD);
    };

    // Calculate sectional similarities
    const sSum = await scorePart(formDataMap.careerSummary?.summary);
    const sExp = await scorePart(formDataMap.workExperience?.map(e => e.responsibilities).join(" "));
    const sTech = await scorePart(formDataMap.skillsSummary?.technicalSkills);
    const sSoft = await scorePart(formDataMap.skillsSummary?.softSkills);
    const sProj = await scorePart(formDataMap.projects?.map(p => p.projectDescription).join(" "));
    const sCert = await scorePart(formDataMap.certifications?.map(c => c.certificationName).join(" "));

    // NORMALIZATION LOGIC: Don't penalize empty sections in your data
    const sections = [
      { val: sSum, w: 26, present: !!formDataMap.careerSummary?.summary },
      { val: sExp, w: 35, present: !!formDataMap.workExperience?.length },
      { val: sProj, w: 15, present: !!formDataMap.projects?.length },
      { val: sTech, w: 12, present: !!formDataMap.skillsSummary?.technicalSkills },
      { val: sSoft, w: 8, present: !!formDataMap.skillsSummary?.softSkills },
      { val: sCert, w: 4, present: !!formDataMap.certifications?.length }
    ];

    const activeWeight = sections.reduce((acc, s) => s.present ? acc + s.w : acc, 0);
    const rawBaseScore = sections.reduce((acc, s) => acc + (s.val * s.w), 0);
    
    // Scale the score based on available sections
    const normalizedScore = activeWeight > 0 ? (rawBaseScore / activeWeight) * 100 : 0;
    
    // Numerical Bonus (Up to 10%)
    const numMatch = (formDataMap.workExperience?.map(e => e.responsibilities).join(" ") || "").match(/\d+/g) || [];
    const bonus = Math.min(numMatch.length / 10, 1) * 0.1;

    return Response.json({
      score: Math.min(Math.round(normalizedScore * (1 + bonus)), 100),
      missingKeywords: getMissingKeywords(flattenWeightedResume(formDataMap), jobDescription),
      breakdown: {
        summary: Math.round(sSum * 100),
        experience: Math.round(sExp * 100),
        technical: Math.round(sTech * 100),
        softSkills: Math.round(sSoft * 100),
        projects: Math.round(sProj * 100),
        certs: Math.round(sCert * 100)
      }
    });
  } catch (error) {
    return Response.json({ error: "Analysis failed" }, { status: 500 });
  }
}