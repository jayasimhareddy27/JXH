"use client";
import { getAtsScores } from '@lib/ats/generator';
import React, { useState } from 'react';

export default function AtsScorePage() {
  const [resumeText, setResumeText] = useState("");
  const [jobText, setJobText] = useState("");
  const [results, setResults] = useState(null);

  const handleAnalyze = () => {
    const trimmedResume = resumeText.trim();
    const trimmedJob = jobText.trim();

    if (!trimmedResume || !trimmedJob) {
      alert("Please paste both your resume and the job description to continue.");
      return;
    }

    try {
      const scoreData = getAtsScores(
        { resumetextAireference: trimmedResume },
        { rawDescription: trimmedJob }
      );
      setResults(scoreData);
    } catch (error) {
      console.error("Scoring Error:", error);
      alert("Analysis failed. Please check your inputs.");
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)]">
      <div className="flex flex-col md:flex-row min-h-screen">
        
        {/* === LEFT SIDE: INPUT PANEL (40%) === */}
        <aside className="w-full md:w-[40%] p-6 border-r border-[var(--color-border-primary)] bg-[var(--color-bg)] md:sticky md:top-0 md:h-screen overflow-y-auto">
          <div className="max-w-md mx-auto">
            <h1 className="text-2xl font-bold mb-2">ATS Optimizer</h1>
            <p className="text-sm text-[var(--color-text-secondary)] mb-8">
              Paste your details below to calculate your match score.
            </p>
            
            <div className="space-y-6">
              <div className="flex flex-col">
                <label className="text-xs font-bold uppercase tracking-widest mb-2 opacity-60">Your Resume</label>
                <textarea 
                  value={resumeText}
                  onChange={(e) => setResumeText(e.target.value)}
                  placeholder="Paste resume text here..."
                  className="w-full h-60 p-4 rounded-xl border border-[var(--color-border-primary)] bg-[var(--color-background-secondary)] outline-none focus:ring-2 focus:ring-[var(--color-cta-bg)] transition-all resize-none text-sm"
                />
              </div>

              <div className="flex flex-col">
                <label className="text-xs font-bold uppercase tracking-widest mb-2 opacity-60">Job Description</label>
                <textarea 
                  value={jobText}
                  onChange={(e) => setJobText(e.target.value)}
                  placeholder="Paste job description here..."
                  className="w-full h-60 p-4 rounded-xl border border-[var(--color-border-primary)] bg-[var(--color-background-secondary)] outline-none focus:ring-2 focus:ring-[var(--color-cta-bg)] transition-all resize-none text-sm"
                />
              </div>

              <button 
                onClick={handleAnalyze}
                className="w-full rounded-xl py-4 font-bold text-lg bg-[var(--color-cta-bg)] text-[var(--color-cta-text)] shadow-lg hover:bg-[var(--color-cta-hover-bg)] transition-all active:scale-[0.98]"
              >
                Analyze Match
              </button>
            </div>
          </div>
        </aside>

        {/* === RIGHT SIDE: RESULTS DASHBOARD (60%) === */}
        <main className="w-full md:w-[60%] p-8 md:p-16 bg-[var(--color-background-secondary)]">
          {!results ? (
            <div className="h-full flex flex-col items-center justify-center opacity-20 text-center py-20">
              <div className="text-8xl mb-6">🔍</div>
              <h2 className="text-2xl font-semibold">Ready to Analyze</h2>
              <p className="max-w-xs mt-2">Enter your resume and the target job description on the left to see your compatibility score.</p>
            </div>
          ) : (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
              {/* Score Header */}
              <div className="flex flex-col sm:flex-row items-center justify-between mb-12 gap-8 border-b border-[var(--color-border-primary)] pb-10">
                <div>
                  <h2 className="text-4xl font-black">Match Report</h2>
                  <p className="text-[var(--color-text-secondary)] mt-1">AI-driven ATS compatibility analysis.</p>
                </div>
                <div className="flex flex-col items-center">
                  <div className="relative flex items-center justify-center w-32 h-32 rounded-full border-[10px] border-[var(--color-bg)] bg-[var(--color-background-secondary)] shadow-2xl">
                    <span className="text-4xl font-black text-[var(--color-cta-bg)]">{results.overallScore}%</span>
                  </div>
                  <span className="mt-2 text-xs font-bold uppercase tracking-widest opacity-50">Overall Score</span>
                </div>
              </div>

              <div className="space-y-12">
                {/* Improvement Suggestions */}
                <section>
                  <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <span className="w-2 h-2 bg-[var(--color-cta-bg)] rounded-full"></span>
                    Actionable Feedback
                  </h3>
                  <div className="grid gap-3">
                    {results.suggestions.map((s, i) => (
                      <div key={i} className="p-4 rounded-xl bg-[var(--color-bg)] border border-[var(--color-border-primary)] flex gap-4 items-start">
                        <span className="text-[var(--color-cta-bg)] font-bold">0{i+1}</span>
                        <p className="text-sm leading-relaxed">{s}</p>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Skills Breakdown */}
                <section className="grid md:grid-cols-2 gap-6">
                  <div className="p-6 rounded-2xl bg-[var(--color-bg)] border border-[var(--color-border-primary)]">
                    <h4 className="font-bold mb-4 text-green-500 text-sm uppercase tracking-wider">Matched Skills</h4>
                    <div className="flex flex-wrap gap-2">
                      {results.sections.skillsAlignment.matched.length > 0 ? (
                        results.sections.skillsAlignment.matched.map(skill => (
                          <span key={skill} className="px-3 py-1 bg-green-500/10 text-green-500 text-xs rounded-full border border-green-500/20 font-medium">{skill}</span>
                        ))
                      ) : (
                        <span className="text-xs opacity-40 italic">No skills matched yet.</span>
                      )}
                    </div>
                  </div>

                  <div className="p-6 rounded-2xl bg-[var(--color-bg)] border border-[var(--color-border-primary)]">
                    <h4 className="font-bold mb-4 text-red-500 text-sm uppercase tracking-wider">Missing Critical Skills</h4>
                    <div className="flex flex-wrap gap-2">
                      {results.sections.skillsAlignment.missing.slice(0, 12).map(skill => (
                        <span key={skill} className="px-3 py-1 bg-red-500/10 text-red-500 text-xs rounded-full border border-red-500/20 font-medium">{skill}</span>
                      ))}
                    </div>
                  </div>
                </section>

                {/* === UPDATED SIGNUP CTA SECTION === */}
                <section className="p-8 rounded-3xl bg-gradient-to-br from-[var(--color-background-secondary)] to-[var(--color-bg)] border border-[var(--color-cta-bg)] shadow-xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4">
                    <span className="px-3 py-1 text-[10px] font-bold uppercase tracking-widest bg-[var(--color-cta-bg)] text-[var(--color-cta-text)] rounded-full">Pro Panel</span>
                  </div>
                  <div className="relative z-10">
                    <h3 className="text-2xl font-bold mb-2">Take the Next Step</h3>
                    <p className="text-[var(--color-text-secondary)] mb-8 max-w-md">
                      Sign in to unlock advanced AI keyword optimization, save your scan history, or manage your existing resumes.
                    </p>
                    
                    <div className="flex flex-col sm:flex-row gap-4">
                      {/* New User / Advanced Features Path */}
                      <a 
                        href="/login" 
                        className="flex-1 inline-flex items-center justify-center px-6 py-3 rounded-xl font-bold bg-[var(--color-cta-bg)] text-[var(--color-cta-text)] shadow-lg hover:scale-[1.02] transition-transform duration-200"
                      >
                        Get Advanced Access
                      </a>

                      {/* Existing User Path */}
                      <a 
                        href="/dashboard/myresumes" 
                        className="flex-1 inline-flex items-center justify-center px-6 py-3 rounded-xl font-bold border-2 border-[var(--color-cta-bg)] text-[var(--color-cta-bg)] hover:bg-[var(--color-cta-bg)] hover:text-[var(--color-cta-text)] transition-all duration-200"
                      >
                        Go to My Resumes
                      </a>
                    </div>
                  </div>
                </section>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}