'use client';
import React from 'react';
import { sampleResume } from '../sampleresume';

export default function Template01Preview() {
  const resume = sampleResume;

  return (
      
      <div className="w-[600px] bg-white p-8 shadow-2xl scale-[0.25] origin-top pointer-events-none font-sans text-slate-900 border border-gray-100 text-left">
        
        {/* Header Section */}
        <header className="mb-6 border-b-2 border-slate-800 pb-4">
          <h1 className="text-4xl font-black uppercase tracking-tight leading-none mb-3">
            {resume.personalInformation.fullName}
          </h1>
          
          <div className="flex flex-wrap gap-y-1 gap-x-4 text-xs font-medium text-slate-500 mb-3">
            <span className="flex items-center gap-1">✉ {resume.personalInformation.email}</span>
            <span className="flex items-center gap-1">📞 {resume.personalInformation.phoneNumber}</span>
          </div>

          <div className="flex gap-4 text-[10px] text-blue-600 font-bold uppercase tracking-widest border-t border-slate-100 pt-2">
            <span>LinkedIn</span>
            <span>GitHub</span>
            <span>Portfolio</span>
          </div>
        </header>

        <div className="space-y-5">
          {/* Career Summary */}
          <section>
            <h2 className="text-[11px] font-black uppercase tracking-widest text-blue-700 mb-2 border-b border-slate-100 pb-1">Professional Profile</h2>
            <p className="text-xs leading-relaxed text-slate-700 text-justify">
              {resume.careerSummary.summary}
            </p>
          </section>

          {/* Work Experience - Mapping multiple entries for realism */}
          <section>
            <h2 className="text-[11px] font-black uppercase tracking-widest text-blue-700 mb-3 border-b border-slate-100 pb-1">Work Experience</h2>
            <div className="space-y-4">
              {resume.workExperience.map((job, i) => (
                <div key={i}>
                  <div className="flex justify-between text-sm font-bold">
                    <span>{job.jobTitle}</span>
                    <span className="text-slate-400 font-normal text-xs">{job.startDate} — {job.endDate}</span>
                  </div>
                  <div className="text-blue-600 text-[11px] font-bold italic mb-1">{job.companyName}</div>
                  <p className="text-[11px] text-slate-600 line-clamp-2 leading-snug">{job.responsibilities}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Projects Section */}
          <section>
            <h2 className="text-[11px] font-black uppercase tracking-widest text-blue-700 mb-3 border-b border-slate-100 pb-1">Key Projects</h2>
            <div className="grid grid-cols-2 gap-4">
              {resume.projects.slice(0, 2).map((proj, i) => (
                <div key={i} className="border-l-2 border-slate-100 pl-3">
                  <div className="text-xs font-bold text-slate-800">{proj.projectName}</div>
                  <div className="text-[9px] text-blue-500 font-medium mb-1 uppercase">{proj.technologiesUsed}</div>
                  <p className="text-[10px] text-slate-500 line-clamp-2">{proj.projectDescription}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Education & Certifications Row */}
          <div className="grid grid-cols-2 gap-8 pt-2">
            <section>
              <h2 className="text-[11px] font-black uppercase tracking-widest text-blue-700 mb-2 border-b border-slate-100 pb-1">Education</h2>
              {resume.educationHistory.map((edu, i) => (
                <div key={i} className="mb-2">
                  <div className="text-xs font-bold">{edu.university}</div>
                  <div className="text-[10px] text-slate-500">{edu.degree} in {edu.major} • GPA: {edu.gpa}</div>
                </div>
              ))}
            </section>
            
            <section>
              <h2 className="text-[11px] font-black uppercase tracking-widest text-blue-700 mb-2 border-b border-slate-100 pb-1">Certifications</h2>
              <ul className="space-y-1">
                {resume.certifications.slice(0, 3).map((cert, i) => (
                  <li key={i} className="text-[10px] text-slate-600 font-medium list-disc ml-3">
                    {cert.certificationName}
                  </li>
                ))}
              </ul>
            </section>
          </div>

          {/* Skills Footer */}
          <section className="bg-slate-50 p-3 rounded-lg border border-slate-100">
            <h2 className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Technical Core & Tools</h2>
            <p className="text-[10px] text-slate-600 leading-relaxed">
              <span className="font-bold text-slate-800 uppercase">Expertise: </span> {resume.skillsSummary.technicalSkills}
            </p>
            <p className="text-[10px] text-slate-600 mt-1">
              <span className="font-bold text-slate-800 uppercase">Utilities: </span> {resume.skillsSummary.tools} • {resume.skillsSummary.softSkills}
            </p>
          </section>
        </div>
      </div>

  );
}