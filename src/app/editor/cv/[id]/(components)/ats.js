"use client";
import { useState } from "react";
import { Loader2, Sparkles, Zap, TrendingUp, CheckCircle2 } from "lucide-react";

export default function AtsPage({ formDataMap }) {
  const [data, setData] = useState({ score: null, breakdown: null, missingKeywords: [] });
  const [loading, setLoading] = useState(false);
  const [jd, setJd] = useState("");

  const calculateAtsScore = async () => {
    if (!jd || !formDataMap) return;
    setLoading(true);
    try {
      const res = await fetch("/api/ats/score", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ formDataMap, jobDescription: jd }),
      });
      const result = await res.json();
      setData(result);
    } catch (err) { console.error(err); } 
    finally { setLoading(false); }
  };

  return (
    <div className="max-w-xl mx-auto p-4 space-y-3 text-slate-900">
      <div className="bg-white rounded-xl p-3 border border-slate-200 shadow-sm">
        <textarea 
          className="w-full h-24 p-2 rounded-lg bg-slate-50 border-none focus:ring-1 focus:ring-cyan-500 text-xs resize-none"
          placeholder="Paste Job Description..."
          value={jd}
          onChange={(e) => setJd(e.target.value)}
        />
        <button 
          onClick={calculateAtsScore}
          disabled={loading || !jd}
          className="w-full mt-2 bg-slate-900 text-white text-[10px] font-bold py-2.5 rounded-lg flex justify-center items-center gap-2 transition-all active:scale-[0.98]"
        >
          {loading ? <Loader2 size={12} className="animate-spin" /> : <><Sparkles size={12} /> Match Profile</>}
        </button>
      </div>

      {data.score !== null && !loading && (
        <div className="space-y-3 animate-in fade-in zoom-in-95 duration-300">
          <div className="bg-slate-900 rounded-xl p-4 text-white flex items-center shadow-md">
            <div className="pr-4 border-r border-white/10">
              <div className="text-3xl font-black">{data.score}%</div>
              <p className="text-[8px] font-bold uppercase tracking-widest text-slate-500">Match</p>
            </div>
            <div className="flex-1 pl-4">
              <div className="flex items-center gap-1 text-cyan-400 mb-0.5">
                <TrendingUp size={10} />
                <span className="text-[8px] font-bold uppercase">AI Insight</span>
              </div>
              <p className="text-[10px] text-slate-300 line-clamp-2 leading-tight italic font-medium">
                {data.score > 80 ? "Excellent alignment found." : "Significant keyword gaps detected."}
              </p>
            </div>
          </div>

          <div className="bg-white rounded-xl p-3 border border-slate-200 grid grid-cols-2 gap-x-4 gap-y-2">
            {Object.entries(data.breakdown).map(([key, val]) => (
              <div key={key}>
                <div className="flex justify-between text-[8px] font-bold uppercase mb-1 text-slate-500">
                  <span className="truncate">{key}</span>
                  <span className="text-slate-900">{val}%</span>
                </div>
                <div className="h-1 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-slate-900 transition-all duration-1000" style={{ width: `${val}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}