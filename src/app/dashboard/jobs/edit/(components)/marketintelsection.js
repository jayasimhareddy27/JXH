import { Zap, Star, Plus, X, Award, MessageSquarePlus } from "lucide-react";
import { useState } from "react";

export default function MarketIntelSection({ jobData, setJobData }) {
  const [newQuestion, setNewQuestion] = useState({ question: "", focusArea: "Technical" });

  // 1. Logic to add a skill tag
  const addSkill = (skill) => {
    if (!skill || !skill.trim()) return;
    const cleanSkill = skill.trim();
    setJobData({ 
      ...jobData, 
      skills: [...new Set([...(jobData.skills || []), cleanSkill])] 
    });
  };

  // 2. Logic to add an interview question
  const addQuestion = () => {
    if (!newQuestion.question.trim()) return;
    setJobData({
      ...jobData,
      marketIntel: {
        ...jobData.marketIntel,
        interviewQuestions: [...(jobData.marketIntel?.interviewQuestions || []), newQuestion]
      }
    });
    setNewQuestion({ question: "", focusArea: "Technical" });
  };

  return (
    <div className="card p-6 space-y-6 border-l-4 border-amber-500 shadow-sm bg-[var(--color-background-secondary)]">
      
      {/* HEADER: PROMOTION & COMPLEXITY */}
      <div className="flex items-center justify-between">
        <button 
          type="button"
          onClick={() => setJobData({
            ...jobData,
            marketIntel: { ...jobData.marketIntel, isFeatured: !jobData.marketIntel?.isFeatured }
          })}
          className={`flex items-center gap-2 px-3 py-1 rounded-full border transition-all ${
            jobData.marketIntel?.isFeatured 
            ? "bg-amber-500 border-amber-500 text-white" 
            : "bg-transparent border-[var(--color-border-secondary)] text-[var(--color-text-secondary)] opacity-50"
          }`}
        >
          <Award size={14} />
          <span className="text-[10px] font-black uppercase">Featured</span>
        </button>

        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((num) => (
            <Star 
              key={num} size={14} 
              className={`cursor-pointer ${num <= (jobData.marketIntel?.difficultyRating || 3) ? "fill-amber-400 text-amber-400" : "text-gray-300"}`} 
              onClick={() => setJobData({
                ...jobData, 
                marketIntel: { ...jobData.marketIntel, difficultyRating: num }
              })}
            />
          ))}
        </div>
      </div>

      {/* --- SECTION 1: SKILLS (THE TECH STACK) --- */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Zap size={14} className="text-amber-500" />
          <label className="text-[10px] font-black uppercase text-[var(--color-text-primary)]">Must-Have Skills</label>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {jobData.skills?.map(skill => (
            <span key={skill} className="px-3 py-1 bg-[var(--color-background-tertiary)] border border-[var(--color-border-secondary)] rounded-lg text-[10px] font-bold flex items-center gap-2">
              {skill}
              <X size={12} className="cursor-pointer text-rose-500" onClick={() => setJobData({
                ...jobData, skills: jobData.skills.filter(s => s !== skill)
              })} />
            </span>
          ))}
          <input 
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill(e.target.value), e.target.value = "")}
            placeholder="+ Add Tech"
            className="bg-transparent border-b border-dashed border-amber-500/30 text-[10px] font-bold outline-none w-24 px-1"
          />
        </div>
      </div>

      {/* --- SECTION 2: INTERVIEW CHEAT SHEET --- */}
      <div className="space-y-4 pt-4 border-t border-[var(--color-border-secondary)]">
        <div className="flex items-center gap-2">
          <MessageSquarePlus size={14} className="text-amber-500" />
          <label className="text-[10px] font-black uppercase text-[var(--color-text-primary)]">Interview Cheat Sheet</label>
        </div>

        {/* Existing Questions List */}
        <div className="space-y-2">
          {jobData.marketIntel?.interviewQuestions?.map((iq, idx) => (
            <div key={idx} className="p-3 bg-[var(--color-background-primary)] rounded-xl border border-[var(--color-border-secondary)] group relative">
              <span className="text-[7px] font-black uppercase text-amber-600 bg-amber-500/10 px-1.5 py-0.5 rounded">
                {iq.focusArea}
              </span>
              <p className="text-[11px] font-bold text-[var(--color-text-secondary)] mt-1 italic">"{iq.question}"</p>
              <button 
                type="button"
                onClick={() => {
                  const updatedQ = jobData.marketIntel.interviewQuestions.filter((_, i) => i !== idx);
                  setJobData({...jobData, marketIntel: {...jobData.marketIntel, interviewQuestions: updatedQ}});
                }}
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 text-rose-500"
              >
                <X size={12} />
              </button>
            </div>
          ))}
        </div>

        {/* New Question Input Area */}
        <div className="p-2 rounded-xl border border-dashed border-amber-500/30 bg-amber-500/5 flex gap-2">
          <select 
            value={newQuestion.focusArea}
            onChange={(e) => setNewQuestion({...newQuestion, focusArea: e.target.value})}
            className="bg-transparent text-[9px] font-black uppercase outline-none text-amber-600"
          >
            <option value="Technical">Tech</option>
            <option value="Behavioral">Behav</option>
          </select>
          <input 
            placeholder="Add insider question..."
            className="flex-1 bg-transparent text-[11px] font-medium outline-none"
            value={newQuestion.question}
            onChange={(e) => setNewQuestion({...newQuestion, question: e.target.value})}
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addQuestion())}
          />
          <button type="button" onClick={addQuestion} className="text-amber-500 hover:scale-125 transition-all">
            <Plus size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}