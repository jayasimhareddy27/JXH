"use client";

import { useState, useCallback, useEffect } from "react";
import { useDispatch } from "react-redux";
import { fetchAIdataforDocument } from "@lib/redux/features/editor/thunks";
import { Loader2 } from "lucide-react";

export default function AtsTab({ formDataMap, displayJob }) {
  const dispatch = useDispatch();
  const [suggestions, setSuggestions] = useState([]);
  const [isAiLoading, setIsAiLoading] = useState(false);

  const jobId = displayJob?._id;

  // Load saved suggestions from localStorage when job changes
  useEffect(() => {
    if (!jobId) {
      setSuggestions([]);
      return;
    }

    try {
      const saved = localStorage.getItem(`ats_suggestions_${jobId}`);
      if (saved) {
        setSuggestions(JSON.parse(saved));
      } else {
        setSuggestions([]);
      }
    } catch (err) {
      console.error("Failed to load ATS suggestions from localStorage:", err);
      setSuggestions([]);
    }
  }, [jobId]);

  // Save suggestions to localStorage whenever they change
  useEffect(() => {
    if (jobId && suggestions.length > 0) {
      try {
        localStorage.setItem(
          `ats_suggestions_${jobId}`,
          JSON.stringify(suggestions)
        );
      } catch (err) {
        console.error("Failed to save ATS suggestions to localStorage:", err);
      }
    }
  }, [jobId, suggestions]);

  // Only runs when user clicks the Refresh button
  const runAiAdvice = useCallback(async () => {
    if (!formDataMap || !jobId) {
      console.warn("Missing formDataMap or displayJob");
      return;
    }

    setIsAiLoading(true);
    try {
      const result = await dispatch(
        fetchAIdataforDocument({ type: "ats" })
      ).unwrap();

      const newSuggestions = result.suggestions || [];
      setSuggestions(newSuggestions);

      // Save immediately after successful fetch
      try {
        localStorage.setItem(
          `ats_suggestions_${jobId}`,
          JSON.stringify(newSuggestions)
        );
      } catch (err) {
        console.error("Failed to save new suggestions:", err);
      }
    } catch (err) {
      console.error("AI Advice Failed:", err);
      // Keep previous suggestions on error
    } finally {
      setIsAiLoading(false);
    }
  }, [dispatch, formDataMap, jobId]);

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500 pb-10">
      <button
        className="w-full py-4 rounded-2xl border border-dashed text-[10px] font-black uppercase text-slate-400 hover:bg-slate-50 transition-colors disabled:opacity-50"
        onClick={runAiAdvice}
        disabled={isAiLoading || !formDataMap || !jobId}
      >
        {isAiLoading ? (
          <>
            <Loader2 className="inline w-4 h-4 mr-2 animate-spin" />
            Generating ATS suggestions...
          </>
        ) : (
          "Refresh All ATS Suggestions"
        )}
      </button>

      <div className="bg-cyan-50/50 rounded-[2rem] p-6 border border-cyan-100 space-y-5 relative">
        {isAiLoading && (
          <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] flex items-center justify-center rounded-[2rem]">
            <Loader2 className="w-8 h-8 animate-spin text-cyan-500" />
          </div>
        )}

        <h5 className="text-[10px] font-black uppercase text-cyan-700 flex items-center gap-2">
          ATS suggestions
        </h5>

        <div className="space-y-3">
          {suggestions.length > 0 ? (
            suggestions.map((s, i) => (
              <div key={i} className="flex gap-4 items-start">
                <div className="w-6 h-6 shrink-0 bg-white border border-cyan-200 rounded-full text-[10px] font-black flex items-center justify-center text-cyan-500">
                  {i + 1}
                </div>
                <p className="text-[11px] text-cyan-900 leading-relaxed font-bold italic">
                  {s}
                </p>
              </div>
            ))
          ) : (
            <p className="text-cyan-700/70 text-[11px] italic py-4">
              Click "Refresh All ATS Suggestions" to generate AI-powered recommendations.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}