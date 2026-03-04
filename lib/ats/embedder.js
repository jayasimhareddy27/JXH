"use client";
// @lib/ats/embedder.js
import { pipeline, env } from "@xenova/transformers";

env.allowLocalModels = false;
env.useFS = false; 
env.useBrowserCache = true;

let embedder;

/**
 * @param {string} text - The text to embed
 * @param {Function} onProgress - Callback for download progress { status, progress }
 */
export async function getEmbedding(text, onProgress) {
  if (!text) return new Array(384).fill(0);
  
  if (!embedder) {
    embedder = await pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2", {
      progress_callback: (data) => {
        if (onProgress && data.status === "progress") {
          onProgress(data);
        }
      }
    });
  }

  const output = await embedder(text, {
    pooling: "mean",
    normalize: true
  });

  return Array.from(output.data);
}