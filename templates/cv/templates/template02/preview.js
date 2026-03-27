'use client';
import React from 'react';
import { sampleResume } from '../../sampleresume';

/**
 * Template02Preview
 * Scaled down thumbnail version of the Executive Modern layout.
 * Reflects all sections: Experience, Projects, Education, and Certifications.
 */
export default function Template02Preview() {
  const resume = sampleResume;

  return (
    <div className="w-[600px] bg-white p-10 shadow-2xl scale-[0.25] origin-top pointer-events-none font-sans text-slate-900 border border-gray-100 text-left">
      
      {/* Left-Aligned Header */}
      <header className="mb-8">
        <h1 className="text-6xl font-black tracking-tighter leading-none mb-4 text-slate-900 uppercase">
          {resume.personalInformation.fullName}
        </h1>
        <div className="flex flex-wrap gap-x-6 gap-y-1 text-[11px] font-black uppercase tracking-widest text-slate-400">
          <span>{resume.personalInformation.email}</span>
          <span>{resume.personalInformation.phoneNumber}</span>
          <span>{resume.personalInformation.address}</span>
        </div>
      </header>

      <div className="grid grid-cols-12 gap-10">
        {/* Main Column */}
        <div className="col-span-8 space-y-10">
          
          {/* Executive Summary */}
          <section>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-[5px] h-[22px] bg-slate-900 rounded-sm" />
              <h2 className="text-[15px] font-black uppercase tracking-tight text-slate-900">Professional Profile</h2>
            </div>
            <p className="text-[12px] leading-relaxed text-slate-600 italic font-medium">
              {resume.careerSummary.summary}
            </p>
          </section>

          {/* Experience */}
          <section>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-[5px] h-[22px] bg-slate-900 rounded-sm" />
              <h2 className="text-[15px] font-black uppercase tracking-tight text-slate-900">Experience</h2>
            </div>
            <div className="space-y-8">
              {resume.workExperience.slice(0, 2).map((job, i) => (
                <div key={`preview-job-${i}`}>
                  <div className="flex justify-between items-baseline mb-1">
                    <span className="text-[14px] font-black text-slate-800 uppercase tracking-tight">{job.jobTitle}</span>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{job.startDate} — {job.endDate}</span>
                  </div>
                  <div className="text-blue-600 text-[12px] font-bold mb-3">{job.companyName}</div>
                  <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed">
                    {job.responsibilities}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Projects */}
          <section>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-[5px] h-[22px] bg-slate-900 rounded-sm" />
              <h2 className="text-[15px] font-black uppercase tracking-tight text-slate-900">Key Projects</h2>
            </div>
            <div className="space-y-6">
              {resume.projects.slice(0, 2).map((proj, i) => (
                <div key={`preview-proj-${i}`}>
                  <div className="flex justify-between items-baseline mb-2">
                    <span className="font-black text-[13px] text-slate-800 uppercase">{proj.projectName}</span>
                    <span className="text-[9px] font-bold text-slate-400 bg-slate-50 px-2 py-0.5 border border-slate-100 uppercase">{proj.technologiesUsed}</span>
                  </div>
                  <p className="text-[11px] text-slate-500 italic line-clamp-2 border-l-2 border-slate-100 pl-4">
                    {proj.projectDescription}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Sidebar Column */}
        <div className="col-span-4 border-l border-slate-100 pl-8 space-y-10">
          
          {/* Education */}
          <section>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-[5px] h-[22px] bg-slate-900 rounded-sm" />
              <h2 className="text-[15px] font-black uppercase tracking-tight text-slate-900">Education</h2>
            </div>
            {resume.educationHistory.map((edu, i) => (
              <div key={`preview-edu-${i}`} className="mb-5">
                <div className="text-[12px] font-bold text-slate-800 uppercase">{edu.university}</div>
                <div className="text-[11px] text-blue-600 font-bold">{edu.degree}</div>
                <div className="text-[10px] text-slate-400 font-bold">{edu.startDate} — {edu.endDate}</div>
              </div>
            ))}
          </section>

          {/* Skills */}
          <section>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-[5px] h-[22px] bg-slate-900 rounded-sm" />
              <h2 className="text-[15px] font-black uppercase tracking-tight text-slate-900">Expertise</h2>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {resume.skillsSummary.technicalSkills?.split(',').slice(0, 8).map((skill, i) => (
                <span key={`preview-skill-${i}`} className="text-[9px] font-bold bg-slate-100 text-slate-600 px-2 py-1 rounded uppercase tracking-tighter">
                  {skill.trim()}
                </span>
              ))}
            </div>
          </section>

          {/* Certifications */}
          <section>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-[5px] h-[22px] bg-slate-900 rounded-sm" />
              <h2 className="text-[15px] font-black uppercase tracking-tight text-slate-900">Awards</h2>
            </div>
            <ul className="space-y-3">
              {resume.certifications.slice(0, 3).map((cert, i) => (
                <li key={`preview-cert-${i}`} className="flex gap-2 items-start">
                   <div className="mt-1.5 w-1.5 h-1.5 rounded-sm bg-slate-300" />
                   <span className="text-[10.5px] font-bold text-slate-700 leading-tight">{cert.certificationName}</span>
                </li>
              ))}
            </ul>
          </section>

        </div>
      </div>
    </div>
  );
}