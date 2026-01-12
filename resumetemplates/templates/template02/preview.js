'use client';
import React from 'react';
import { sampleResume } from '../sampleresume';

export default function Template02Preview() {
  const resume = sampleResume;

  return (
    <div className="w-full h-full bg-slate-100 flex justify-center items-start overflow-hidden border border-slate-200 rounded-xl relative">
      
      {/* Scaled Resume Sheet */}
      <div className="w-[800px] bg-white shadow-2xl scale-[0.32] origin-top pointer-events-none mt-4 font-sans text-slate-900 grid grid-cols-12 min-h-[1120px]">
        
        {/* LEFT SIDEBAR (Dark Accents) */}
        <aside className="col-span-4 bg-slate-900 text-white p-8 space-y-8">
          <div className="border-b border-slate-700 pb-6">
            <h1 className="text-2xl font-black uppercase leading-tight text-white mb-2">
              {resume.personalInformation.firstName}<br/>
              <span className="text-blue-400">{resume.personalInformation.lastName}</span>
            </h1>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest italic">Professional Profile</p>
          </div>

          <section className="space-y-4">
            <h2 className="text-[11px] font-black uppercase tracking-widest text-blue-400 border-b border-slate-700 pb-1">Contact</h2>
            <div className="text-[10px] space-y-2 text-slate-300">
              <p className="flex items-center gap-2">✉ {resume.personalInformation.email}</p>
              <p className="flex items-center gap-2">📞 {resume.personalInformation.phoneNumber}</p>
              <div className="pt-2 flex flex-col gap-1 text-blue-400 font-bold">
                <span>LINKEDIN</span>
                <span>GITHUB</span>
                <span>PORTFOLIO</span>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-[11px] font-black uppercase tracking-widest text-blue-400 border-b border-slate-700 pb-1">Technical Skills</h2>
            <div className="flex flex-wrap gap-2">
              {resume.skillsSummary.technicalSkills.split(',').slice(0, 8).map((skill, i) => (
                <span key={i} className="text-[9px] bg-slate-800 px-2 py-1 rounded border border-slate-700">
                  {skill.trim()}
                </span>
              ))}
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-[11px] font-black uppercase tracking-widest text-blue-400 border-b border-slate-700 pb-1">Education</h2>
            <div className="text-[10px] space-y-3">
              <p className="font-bold text-white">{resume.educationHistory[0].university}</p>
              <p className="text-slate-400">{resume.educationHistory[0].degree} • {resume.educationHistory[0].major}</p>
              <p className="text-blue-400 font-black">GPA: {resume.educationHistory[0].gpa}</p>
            </div>
          </section>
        </aside>

        {/* RIGHT MAIN CONTENT */}
        <main className="col-span-8 p-10 bg-white space-y-8">
          <section>
            <h2 className="text-[12px] font-black uppercase tracking-widest text-slate-900 mb-3 flex items-center gap-2">
               Summary <span className="h-px bg-slate-200 flex-1"></span>
            </h2>
            <p className="text-xs leading-relaxed text-slate-600 italic">
              {resume.careerSummary.summary}
            </p>
          </section>

          <section>
            <h2 className="text-[12px] font-black uppercase tracking-widest text-slate-900 mb-4 flex items-center gap-2">
               Experience <span className="h-px bg-slate-200 flex-1"></span>
            </h2>
            <div className="space-y-6">
              {resume.workExperience.map((job, i) => (
                <div key={i} className="relative pl-4 border-l-2 border-slate-100">
                  <div className="absolute w-2 h-2 bg-blue-600 rounded-full -left-[5px] top-1.5"></div>
                  <div className="flex justify-between font-bold text-sm text-slate-800">
                    <span>{job.jobTitle}</span>
                    <span className="text-[10px] text-slate-400 uppercase">{job.startDate} — {job.endDate}</span>
                  </div>
                  <div className="text-blue-600 text-xs font-black uppercase mb-2">{job.companyName}</div>
                  <p className="text-[11px] text-slate-500 line-clamp-2">{job.responsibilities}</p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-[12px] font-black uppercase tracking-widest text-slate-900 mb-4 flex items-center gap-2">
               Projects <span className="h-px bg-slate-200 flex-1"></span>
            </h2>
            <div className="space-y-4">
              {resume.projects.slice(0, 2).map((proj, i) => (
                <div key={i} className="bg-slate-50 p-3 rounded border border-slate-100">
                  <div className="text-xs font-bold text-slate-800 mb-1">{proj.projectName}</div>
                  <p className="text-[10px] text-slate-500 line-clamp-1 italic">{proj.projectDescription}</p>
                  <div className="text-[9px] text-blue-600 font-black mt-2">{proj.technologiesUsed}</div>
                </div>
              ))}
            </div>
          </section>
        </main>
      </div>

      <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_40px_rgba(0,0,0,0.05)]" />
    </div>
  );
}