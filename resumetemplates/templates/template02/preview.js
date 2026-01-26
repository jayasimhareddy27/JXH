'use client';
import React from 'react';
import { sampleResume } from '../sampleresume';

export default function Template02Preview() {
  const resume = sampleResume;

  return (
      <div className="w-[600px] bg-white p-8 shadow-2xl scale-[0.25] origin-top pointer-events-none font-sans text-slate-900 border text-left">
        
        {/* Decorative Top Accent */}
        <div className="w-16 h-2 bg-gray-900 mb-6" />

        {/* Header Section */}
        <header className="mb-8">
          <h1 className="text-5xl font-black uppercase tracking-tighter leading-none mb-3 text-gray-900">
            {resume.personalInformation.fullName}
          </h1>
          
          <div className="flex items-center gap-4 text-[11px] font-bold uppercase tracking-widest text-gray-500">
            <span>{resume.personalInformation.email}</span>
            <span className="text-gray-300 text-lg">•</span>
            <span>{resume.personalInformation.phoneNumber}</span>
            <span className="text-gray-300 text-lg">•</span>
            <span>{resume.personalInformation.address || "Location"}</span>
          </div>
        </header>

        <div className="space-y-6">
          {/* Career Summary */}
          <section>
            <h2 className="text-sm font-bold uppercase mb-2 border-b border-gray-200 pb-1 text-gray-900">Profile</h2>
            <p className="text-xs leading-relaxed text-gray-600 text-justify">
              {resume.careerSummary.summary}
            </p>
          </section>

          {/* Work Experience */}
          <section>
            <h2 className="text-sm font-bold uppercase mb-3 border-b border-gray-200 pb-1 text-gray-900">Experience</h2>
            <div className="space-y-5">
              {resume.workExperience.map((job, i) => (
                <div key={i}>
                  <div className="flex justify-between items-baseline mb-0.5">
                    <span className="text-sm font-bold text-gray-900">{job.jobTitle}</span>
                    <span className="text-gray-400 font-medium text-[10px] uppercase">{job.startDate} — {job.endDate}</span>
                  </div>
                  <div className="text-blue-700 text-[12px] font-semibold mb-1">{job.companyName}</div>
                  <p className="text-[11px] text-gray-600 line-clamp-3 leading-relaxed">{job.responsibilities}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Education & Projects Layout */}
          <div className="grid grid-cols-2 gap-10">
            <div className="space-y-6">
              <section>
                <h2 className="text-sm font-bold uppercase mb-2 border-b border-gray-200 pb-1 text-gray-900">Education</h2>
                {resume.educationHistory.map((edu, i) => (
                  <div key={i} className="mb-3">
                    <div className="text-[12px] font-bold text-gray-900">{edu.university}</div>
                    <div className="text-[11px] text-gray-600">{edu.degree}</div>
                    <div className="text-[10px] text-gray-400 font-bold uppercase mt-0.5">{edu.startDate} — {edu.endDate}</div>
                  </div>
                ))}
              </section>

              <section>
                <h2 className="text-sm font-bold uppercase mb-2 border-b border-gray-200 pb-1 text-gray-900">Skills</h2>
                <div className="text-[11px] text-gray-600 leading-relaxed space-y-1">
                  <p><span className="font-bold text-gray-800">Core:</span> {resume.skillsSummary.technicalSkills}</p>
                  <p><span className="font-bold text-gray-800">Tools:</span> {resume.skillsSummary.tools}</p>
                </div>
              </section>
            </div>

            <div className="space-y-6">
              <section>
                <h2 className="text-sm font-bold uppercase mb-2 border-b border-gray-200 pb-1 text-gray-900">Key Projects</h2>
                {resume.projects.slice(0, 2).map((proj, i) => (
                  <div key={i} className="mb-3">
                    <div className="text-[12px] font-bold text-gray-900">{proj.projectName}</div>
                    <div className="text-[10px] text-blue-600 italic font-medium mb-1">{proj.technologiesUsed}</div>
                    <p className="text-[11px] text-gray-500 line-clamp-2">{proj.projectDescription}</p>
                  </div>
                ))}
              </section>

              <section>
                <h2 className="text-sm font-bold uppercase mb-2 border-b border-gray-200 pb-1 text-gray-900">Certifications</h2>
                <ul className="space-y-1">
                  {resume.certifications.slice(0, 2).map((cert, i) => (
                    <li key={i} className="text-[10px] text-gray-600 flex gap-2">
                      <span className="text-gray-300">•</span>
                      <span>{cert.certificationName}</span>
                    </li>
                  ))}
                </ul>
              </section>
            </div>
          </div>
        </div>
      </div>

  );
}