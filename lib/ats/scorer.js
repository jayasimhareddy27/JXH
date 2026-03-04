import { getEmbedding } from "./embedder";
import { cosineSimilarity } from "./cosine";
import { extractKeywords, keywordCoverage } from "./keywords";

export async function scoreATS(resumeText, jobText) {
  const [resumeVec, jobVec] = await Promise.all([
    getEmbedding(resumeText),
    getEmbedding(jobText)
  ]);

  const semanticScore = Math.round(cosineSimilarity(resumeVec, jobVec) * 100);

  const keywords = extractKeywords(jobText);
  const keywordScore = keywordCoverage(resumeText, jobText, keywords);

  const finalScore = Math.round(semanticScore * 0.65 + keywordScore * 0.35);

  return {
    finalScore,
    semanticScore,
    keywordScore
  };
}
