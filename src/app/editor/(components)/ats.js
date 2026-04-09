"use client";

import { useState, useCallback, useEffect } from "react";
import { useDispatch } from "react-redux";
import { fetchAIdataforDocument } from "@lib/redux/features/editor/thunks";
import { Loader2, ChevronDown, ChevronUp, Zap } from "lucide-react";
import { getAtsScores } from "@lib/ats/generator";

export default function AtsTab({ formDataMap, displayJob }) {
  const dispatch = useDispatch();
  const [suggestions, setSuggestions] = useState([]);
  const [atsScore, setAtsScore] = useState(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [isScoringLoading, setIsScoringLoading] = useState(false);

  // Quick score state
  const [showQuickScore, setShowQuickScore] = useState(false);
  const [quickJobDesc, setQuickJobDesc] = useState("");
  const [quickScore, setQuickScore] = useState(null);
  const [isQuickScoring, setIsQuickScoring] = useState(false);

  const jobId = displayJob?._id;

  // Load saved AI suggestions from localStorage
  useEffect(() => {
    if (!jobId) {
      setSuggestions([]);
      return;
    }
    try {
      const saved = localStorage.getItem(`ats_suggestions_${jobId}`);
      setSuggestions(saved ? JSON.parse(saved) : []);
    } catch (err) {
      console.error("Failed to load ATS suggestions:", err);
      setSuggestions([]);
    }
  }, [jobId]);

  // Auto-calculate ATS Score when data changes
  useEffect(() => {
    if (!formDataMap || !displayJob) {
      setAtsScore(null);
      return;
    }
    try {
      setAtsScore(getAtsScores(formDataMap, displayJob));
    } catch (err) {
      console.error("Failed to calculate ATS score:", err);
      setAtsScore(null);
    }
  }, [formDataMap, displayJob]);

  // Save AI suggestions to localStorage
  useEffect(() => {
    if (jobId && suggestions.length > 0) {
      try {
        localStorage.setItem(`ats_suggestions_${jobId}`, JSON.stringify(suggestions));
      } catch (err) {
        console.error("Failed to save ATS suggestions:", err);
      }
    }
  }, [jobId, suggestions]);

  // Refresh AI Suggestions
  const runAiAdvice = useCallback(async () => {
    if (!formDataMap || !jobId) return;
    setIsAiLoading(true);
    try {
      const result = await dispatch(fetchAIdataforDocument({ type: "ats" })).unwrap();
      const newSuggestions = result.suggestions || [];
      setSuggestions(newSuggestions);
      localStorage.setItem(`ats_suggestions_${jobId}`, JSON.stringify(newSuggestions));
    } catch (err) {
      console.error("AI Advice Failed:", err);
    } finally {
      setIsAiLoading(false);
    }
  }, [dispatch, formDataMap, jobId]);

  // Redo Scoring
  const redoScoring = useCallback(async () => {
    if (!formDataMap || !displayJob) return;
    setIsScoringLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 180));
      setAtsScore(getAtsScores(formDataMap, displayJob));
    } catch (err) {
      console.error("Failed to recalculate ATS score:", err);
    } finally {
      setIsScoringLoading(false);
    }
  }, [formDataMap, displayJob]);

  // Quick Score against pasted JD
  const runQuickScore = useCallback(async () => {
    if (!formDataMap || !quickJobDesc.trim()) return;
    setIsQuickScoring(true);
    try {
      await new Promise((r) => setTimeout(r, 180));
      const tempJob = { rawDescription: quickJobDesc };
      setQuickScore(getAtsScores(formDataMap, tempJob));
    } catch (err) {
      console.error("Quick score failed:", err);
    } finally {
      setIsQuickScoring(false);
    }
  }, [formDataMap, quickJobDesc]);

  const clearQuickScore = () => {
    setQuickJobDesc("");
    setQuickScore(null);
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500 pb-10">

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          className="flex-1 py-4 rounded-2xl border border-dashed text-[10px] font-black uppercase text-slate-400 hover:bg-slate-50 transition-colors disabled:opacity-60"
          onClick={runAiAdvice}
          disabled={isAiLoading || !formDataMap || !jobId}
        >
          {isAiLoading ? (
            <><Loader2 className="inline w-4 h-4 mr-2 animate-spin" />Refreshing AI...</>
          ) : "Refresh AI Suggestions"}
        </button>

        <button
          className="flex-1 py-4 rounded-2xl border border-dashed text-[10px] font-black uppercase text-emerald-600 hover:bg-emerald-50 transition-colors disabled:opacity-60"
          onClick={redoScoring}
          disabled={isScoringLoading || !formDataMap || !displayJob}
        >
          {isScoringLoading ? (
            <><Loader2 className="inline w-4 h-4 mr-2 animate-spin" />Recalculating...</>
          ) : "Redo Scoring"}
        </button>
      </div>

      {/* ── Quick Score Panel ── */}
      <div className="rounded-2xl border border-dashed border-violet-200 overflow-hidden">
        {/* Collapse toggle */}
        <button
          className="w-full flex items-center justify-between px-5 py-3 bg-violet-50/60 hover:bg-violet-50 transition-colors"
          onClick={() => {
            setShowQuickScore((v) => !v);
            if (showQuickScore) clearQuickScore();
          }}
        >
          <span className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-violet-500">
            <Zap className="w-3.5 h-3.5" />
            Quick Score — Paste Any Job Description
          </span>
          {showQuickScore
            ? <ChevronUp className="w-4 h-4 text-violet-400" />
            : <ChevronDown className="w-4 h-4 text-violet-400" />}
        </button>

        {showQuickScore && (
          <div className="p-5 flex flex-col gap-4 bg-white">
            <textarea
              className="w-full min-h-[140px] resize-y rounded-xl border border-slate-200 bg-slate-50 p-3 text-[11px] text-slate-700 leading-relaxed placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-300 focus:border-transparent transition"
              placeholder="Paste the job description here for a quick ATS score against your resume…"
              value={quickJobDesc}
              onChange={(e) => {
                setQuickJobDesc(e.target.value);
                setQuickScore(null); // reset result when text changes
              }}
            />

            <div className="flex gap-2">
              <button
                className="flex-1 py-3 rounded-xl bg-violet-500 hover:bg-violet-600 text-white text-[10px] font-black uppercase tracking-widest transition disabled:opacity-50"
                onClick={runQuickScore}
                disabled={isQuickScoring || !quickJobDesc.trim() || !formDataMap}
              >
                {isQuickScoring ? (
                  <><Loader2 className="inline w-4 h-4 mr-2 animate-spin" />Scoring...</>
                ) : "Score It"}
              </button>

              {(quickJobDesc || quickScore) && (
                <button
                  className="px-4 py-3 rounded-xl border border-slate-200 text-[10px] font-black uppercase text-slate-400 hover:bg-slate-50 transition"
                  onClick={clearQuickScore}
                >
                  Clear
                </button>
              )}
            </div>

            {/* Quick score result */}
            {quickScore && (
              <div className="rounded-xl border border-violet-100 bg-violet-50/40 p-4 space-y-4 animate-in fade-in duration-300">
                {/* Overall */}
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-widest text-violet-500">
                    Quick ATS Score
                  </span>
                  <span className="text-3xl font-black text-violet-600">
                    {quickScore.overallScore}
                    <span className="text-base font-normal text-slate-400">/100</span>
                  </span>
                </div>

                {/* Section breakdown */}
                <div className="space-y-3">
                  {Object.entries(quickScore.sections).map(([key, section]) => (
                    <div key={key} className="border-t border-violet-100 pt-3 first:border-t-0 first:pt-0">
                      <div className="flex justify-between items-center mb-1">
                        <p className="text-[11px] font-semibold capitalize text-slate-600">
                          {key.replace(/([A-Z])/g, " $1").trim()}
                        </p>
                        <span className="font-mono text-[11px] font-bold text-violet-500">
                          {section.score}
                        </span>
                      </div>
                      {section.notes && (
                        <p className="text-[10px] text-slate-400 leading-relaxed">{section.notes}</p>
                      )}
                      {section.missing?.length > 0 && (
                        <p className="text-[10px] text-rose-400 mt-1">
                          Missing: {section.missing.slice(0, 5).join(", ")}
                        </p>
                      )}
                    </div>
                  ))}
                </div>

                {/* Quick suggestions */}
                {quickScore.suggestions?.length > 0 && (
                  <div className="border-t border-violet-100 pt-3 space-y-2">
                    <p className="text-[10px] font-black uppercase tracking-widest text-violet-400">
                      Suggestions
                    </p>
                    {quickScore.suggestions.map((s, i) => (
                      <div key={i} className="flex gap-3 items-start">
                        <div className="w-5 h-5 shrink-0 rounded-full bg-violet-100 text-[9px] font-black flex items-center justify-center text-violet-500">
                          {i + 1}
                        </div>
                        <p className="text-[10px] text-slate-600 leading-relaxed">{s}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ATS Score Section (linked job) */}
      {atsScore && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200">
          <div className="flex items-center justify-between mb-6">
            <h5 className="text-[10px] font-black uppercase tracking-widest text-slate-500">
              Overall ATS Score
            </h5>
            <div className="text-5xl font-black text-cyan-600">
              {atsScore.overallScore}
              <span className="text-2xl font-normal text-slate-400">/100</span>
            </div>
          </div>

          <div className="space-y-5">
            {Object.entries(atsScore.sections).map(([key, section]) => (
              <div key={key} className="border-t border-slate-100 pt-4 first:border-t-0 first:pt-0">
                <div className="flex justify-between items-center mb-2">
                  <p className="text-sm font-semibold capitalize text-slate-700">
                    {key.replace(/([A-Z])/g, " $1").trim()}
                  </p>
                  <span className="font-mono font-bold text-emerald-600">{section.score}</span>
                </div>
                {section.notes && (
                  <p className="text-xs text-slate-500 leading-relaxed">{section.notes}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* AI Suggestions Section */}
      <div className="bg-cyan-50/50 rounded-[2rem] p-6 border border-cyan-100 space-y-5">
        <h5 className="text-[10px] font-black uppercase text-cyan-700">
          AI Powered Recommendations
        </h5>
        <div className="space-y-3">
          {suggestions.length > 0 ? (
            suggestions.map((s, i) => (
              <div key={i} className="flex gap-4 items-start">
                <div className="w-6 h-6 shrink-0 bg-white border border-cyan-200 rounded-full text-[10px] font-black flex items-center justify-center text-cyan-500">
                  {i + 1}
                </div>
                <p className="text-[11px] text-cyan-900 leading-relaxed font-bold italic">{s}</p>
              </div>
            ))
          ) : (
            <p className="text-cyan-700/70 text-[11px] italic py-8 text-center">
              Click "Refresh AI Suggestions" to generate personalized AI recommendations.
            </p>
          )}
        </div>
      </div>

    </div>
  );
}