"use client";

import { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAIdataforDocument } from "@lib/redux/features/editor/thunks";
import { 
  TrendingUp, Zap, CheckCircle2, XCircle, 
  Sparkles, Loader2, Target, BarChart3, Award
} from "lucide-react";

const Ring = ({ score, size = 100 }) => {
  const r = 40; 
  const circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;
  const color = score >= 80 ? "#10b981" : score >= 60 ? "#f59e0b" : "#ef4444";
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" className="shrink-0 drop-shadow-sm">
      <circle cx="50" cy="50" r={r} fill="none" stroke="#f3f4f6" strokeWidth="8" />
      <circle cx="50" cy="50" r={r} fill="none" stroke={color} strokeWidth="8"
        strokeDasharray={circ} strokeDashoffset={offset}
        strokeLinecap="round" transform="rotate(-90 50 50)" className="transition-all duration-700" />
      <text x="50" y="50" textAnchor="middle" dy="0.3em" fontSize="18" fontWeight="800" fill={color}>{score}%</text>
    </svg>
  );
};

export default function AtsTab({ formDataMap, displayJob }) {
  const dispatch = useDispatch();
  const [analysis, setAnalysis] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const { loading } = useSelector((state) => state.editor);

  const runAiAnalysis = useCallback(async () => {
    if (!formDataMap || !displayJob) return;
    
    setIsCalculating(true);
    try {
      const aiResult = await dispatch(fetchAIdataforDocument({ 
        type: "ats", 
        sectionIds: [] 
      })).unwrap();

      setAnalysis(aiResult);
    } catch (err) {
      console.error("AI ATS Analysis Failed:", err);
    } finally {
      setIsCalculating(false);
    }
  }, [dispatch, formDataMap, displayJob]);

  useEffect(() => {
    runAiAnalysis();
  }, [displayJob?._id]);

  if (isCalculating || loading === "loading") {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <Loader2 className="w-10 h-10 animate-spin text-slate-400" />
        <div className="text-center space-y-1">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">AI Matcher is thinking...</p>
          <p className="text-[9px] text-slate-300 italic">Verifying seniority & keyword density</p>
        </div>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="py-20 text-center opacity-40">
        <Target size={48} className="mx-auto text-slate-300 mb-2" />
        <p className="text-[10px] font-black uppercase tracking-widest">Select a job to generate AI insights</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-3 duration-500 pb-10">
      
      {/* ── MAIN SCORE CARD ── */}
      <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden border border-slate-800 shadow-2xl">
        <TrendingUp className="absolute -right-6 -bottom-6 text-white/5" size={160} />
        <div className="relative z-10 flex items-center gap-8">
          <Ring score={analysis.score} size={110} />
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-[9px] bg-emerald-500/20 text-emerald-400 px-2.5 py-0.5 rounded-full font-black uppercase tracking-tighter border border-emerald-500/30">
                AI Scan Complete
              </span>
            </div>
            <h2 className="text-2xl font-black italic tracking-tight text-slate-50">
               {analysis.score >= 80 ? "Optimized Fit" : analysis.score >= 60 ? "Average Match" : "Low Alignment"}
            </h2>
            <p className="text-[11px] text-slate-400 leading-relaxed font-medium">
              {analysis.verdict}
            </p>
          </div>
        </div>
      </div>

      {/* ── SENIORITY & KEYWORD STATS ── */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm space-y-2">
          <div className="flex items-center gap-2">
            <BarChart3 size={16} className="text-amber-500" />
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Coverage</p>
          </div>
          <span className="text-2xl font-black text-slate-800">{analysis.keywordScore}%</span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm space-y-2">
          <div className="flex items-center gap-2">
            <Award size={16} className="text-indigo-500" />
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Level Match</p>
          </div>
          <p className="text-[11px] font-bold text-slate-700 truncate">
            {analysis.levels?.candidate || "Unknown"}
          </p>
        </div>
      </div>

      {/* ── KEYWORD GRIDS ── */}
      <div className="bg-white rounded-[2rem] p-6 border border-slate-200 shadow-sm space-y-6">
        <div className="space-y-4">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
            <CheckCircle2 size={14} className="text-emerald-500" /> Matched Skills
          </p>
          <div className="flex flex-wrap gap-1.5">
            {analysis.foundKeywords?.length > 0 ? (
              analysis.foundKeywords.map((k) => (
                <span key={k} className="text-[9px] bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-xl font-black uppercase border border-emerald-100 italic">
                  {k}
                </span>
              ))
            ) : (
              <span className="text-[10px] text-slate-400">No major skills matched yet.</span>
            )}
          </div>
        </div>
        
        <div className="h-px bg-slate-50 w-full" />
        
        <div className="space-y-4">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
            <XCircle size={14} className="text-rose-500" /> Critical Gaps
          </p>
          <div className="flex flex-wrap gap-1.5">
            {analysis.missingKeywords?.length > 0 ? (
              analysis.missingKeywords.map((k) => (
                <span key={k} className="text-[9px] bg-rose-50 text-rose-600 px-3 py-1.5 rounded-xl font-black uppercase border border-rose-100 italic">
                  {k}
                </span>
              ))
            ) : (
              <span className="text-[10px] text-emerald-500">Perfect coverage!</span>
            )}
          </div>
        </div>
      </div>

      {/* ── AI ACTION PLAN ── */}
      <div className="bg-cyan-50/50 rounded-[2rem] p-6 border border-cyan-100 space-y-5">
        <h5 className="text-[10px] font-black uppercase tracking-widest text-cyan-700 flex items-center gap-2">
          <Sparkles size={14} /> Strategic Advice
        </h5>
        <div className="space-y-3">
          {analysis.suggestions?.map((s, i) => (
            <div key={i} className="flex gap-4 items-start group">
              <div className="w-6 h-6 shrink-0 bg-white border border-cyan-200 rounded-full text-[10px] font-black flex items-center justify-center text-cyan-500 shadow-sm group-hover:bg-cyan-500 group-hover:text-white transition-colors">
                {i + 1}
              </div>
              <p className="text-[11px] text-cyan-900 leading-relaxed font-bold italic">{s}</p>
            </div>
          ))}
        </div>
      </div>

      <button 
        onClick={runAiAnalysis}
        className="w-full py-4 rounded-2xl border border-dashed border-slate-200 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:border-slate-400 hover:text-slate-600 transition-all active:scale-95 flex items-center justify-center gap-2"
      >
          Re-Analyze Match <TrendingUp size={14} />
      </button>

    </div>
  );
}