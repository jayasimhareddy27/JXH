'use client';
import React from 'react';

export default function Template02({ resume, designConfig }) {
  // Safe data extraction based on your MongoDB structure
  const personalInfo = resume?.personalInformation || {};
  const careerSummary = resume?.careerSummary?.summary || '';
  const experience = resume?.workExperience || [];
  const education = resume?.educationHistory || [];
  const projects = resume?.projects || [];
  const skills = resume?.skillsSummary || {};
  const certifications = resume?.certifications || [];
  
  // Custom theme color from designConfig
  const themeColor = designConfig?.primaryColor || 'var(--color-button-primary-bg)';

  return (
    <div 
      className="mx-auto bg-[var(--color-background-secondary)] text-[var(--color-text-primary)] shadow-lg flex overflow-hidden"
      style={{ 
        width: '800px', 
        minHeight: '1120px',
        fontFamily: 'var(--font-family, sans-serif)'
      }}
    >
      {/* --- LEFT SIDEBAR --- */}
      <aside 
        className="w-[280px] p-8 text-white flex flex-col gap-8"
        style={{ backgroundColor: 'var(--color-text-primary)' }} // Dark contrast background
      >
        {/* Contact Section */}
        <section>
          <h2 className="text-[11px] font-black uppercase tracking-widest mb-4 opacity-60" style={{ color: themeColor }}>
            Contact
          </h2>
          <div className="space-y-3 text-[11px] opacity-90">
            <p className="flex items-center gap-2">✉ {personalInfo.email}</p>
            <p className="flex items-center gap-2">📞 {personalInfo.phoneNumber}</p>
            <div className="flex flex-col gap-2 pt-2" style={{ color: themeColor }}>
               {resume?.onlineProfiles?.linkedin && <span className="font-bold">LINKEDIN</span>}
               {resume?.onlineProfiles?.github && <span className="font-bold">GITHUB</span>}
            </div>
          </div>
        </section>

        {/* Education Section */}
        <section>
          <h2 className="text-[11px] font-black uppercase tracking-widest mb-4 opacity-60" style={{ color: themeColor }}>
            Education
          </h2>
          <div className="space-y-4">
            {education.map((edu, i) => (
              <div key={i} className="text-[11px]">
                <p className="font-bold">{edu.university}</p>
                <p className="opacity-70">{edu.degree} in {edu.major}</p>
                <p style={{ color: themeColor }}>GPA: {edu.gpa}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Skills Section */}
        <section>
          <h2 className="text-[11px] font-black uppercase tracking-widest mb-4 opacity-60" style={{ color: themeColor }}>
            Expertise
          </h2>
          <div className="flex flex-wrap gap-2">
            {skills.technicalSkills?.split(',').map((skill, i) => (
              <span key={i} className="text-[9px] bg-white/10 px-2 py-1 rounded border border-white/10">
                {skill.trim()}
              </span>
            ))}
          </div>
        </section>
      </aside>

      {/* --- RIGHT MAIN CONTENT --- */}
      <main className="flex-1 p-12 flex flex-col gap-8">
        {/* Header */}
        <header>
          <h1 className="text-4xl font-black uppercase tracking-tighter leading-none mb-2">
            {personalInfo.firstName} <br/>
            <span style={{ color: themeColor }}>{personalInfo.lastName}</span>
          </h1>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--color-text-secondary)]">
            Full Stack Developer & Data Scientist
          </p>
        </header>

        {/* Summary */}
        {careerSummary && (
          <section>
            <h2 className="text-[12px] font-black uppercase tracking-widest mb-3 flex items-center gap-4">
              Profile <span className="h-px bg-[var(--color-border-primary)] flex-1"></span>
            </h2>
            <p className="text-[13px] leading-relaxed text-[var(--color-text-secondary)] italic">
              {careerSummary}
            </p>
          </section>
        )}

        {/* Experience */}
        <section>
          <h2 className="text-[12px] font-black uppercase tracking-widest mb-4 flex items-center gap-4">
            Experience <span className="h-px bg-[var(--color-border-primary)] flex-1"></span>
          </h2>
          <div className="space-y-6">
            {experience.map((job, i) => (
              <div key={i} className="relative pl-6 border-l border-[var(--color-border-primary)]">
                {/* Timeline Dot */}
                <div 
                  className="absolute w-2 h-2 rounded-full -left-[4.5px] top-1.5 shadow-sm"
                  style={{ backgroundColor: themeColor }}
                ></div>
                
                <div className="flex justify-between items-start mb-1">
                  <h3 className="text-sm font-bold">{job.jobTitle}</h3>
                  <span className="text-[10px] font-bold text-[var(--color-text-placeholder)] uppercase">
                    {job.startDate} — {job.endDate}
                  </span>
                </div>
                <div className="text-[11px] font-bold uppercase mb-2" style={{ color: themeColor }}>
                  {job.companyName}
                </div>
                <p className="text-[12px] leading-normal text-[var(--color-text-secondary)] whitespace-pre-line">
                  {job.responsibilities}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Projects */}
        <section>
          <h2 className="text-[12px] font-black uppercase tracking-widest mb-4 flex items-center gap-4">
            Projects <span className="h-px bg-[var(--color-border-primary)] flex-1"></span>
          </h2>
          <div className="grid grid-cols-1 gap-3">
            {projects.map((proj, i) => (
              <div key={i} className="p-4 rounded-lg bg-[var(--color-background-tertiary)] border border-[var(--color-border-secondary)]">
                <div className="flex justify-between items-center mb-1">
                  <h3 className="text-[13px] font-bold">{proj.projectName}</h3>
                  <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded bg-white/50" style={{ color: themeColor }}>
                    {proj.technologiesUsed}
                  </span>
                </div>
                <p className="text-[11px] text-[var(--color-text-secondary)] italic">{proj.projectDescription}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}