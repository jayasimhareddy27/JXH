'use client';

import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import { RESUME_IDS01 as IDS } from './index';
import { bind } from '@/app/editor/(shared)/editorstyles';
import { selectContainer } from '@lib/redux/features/editor/slice';
import { useRef, useEffect, useState } from 'react';
import { layoutGrid01 } from './index'; 

export default function Template01() {
  const dispatch = useDispatch();
  const resumeRef = useRef(null);
  const [contentHeight, setContentHeight] = useState(0);

  const formDataMap = useSelector((state) => state.editor.formDataMap, shallowEqual);

  // Measure content height whenever data changes to toggle page guides
  useEffect(() => {
    if (resumeRef.current) {
      setContentHeight(resumeRef.current.offsetHeight);
    }
  }, [formDataMap]);

  if (!formDataMap) return null;

  const { 
    personalInformation: pi = {}, 
    onlineProfiles: online = {},
    educationHistory = [],
    workExperience = [],
    projects = [],
    certifications = [],
    skillsSummary = {},
    careerSummary = {},
    sectionTitles = [],
    designConfig = {},
  } = formDataMap;
  
  const selectedContainer = designConfig.selectedContainer;
  const layoutKey = designConfig.layout || 'primary';
  const gridClass = layoutGrid01[layoutKey] || layoutGrid01.primary;
  const visibility = designConfig.visibility || {};

  const getBind = (id, classes = "") => bind(id, designConfig, selectedContainer, dispatch, classes);

  const getSectionTitle = (key, defaultTitle) => {
    const section = sectionTitles.find(s => s.key === key);
    return section ? section.title : defaultTitle;
  };

  const handleDeselect = (e) => {
    if (e.target === e.currentTarget) {
      dispatch(selectContainer(null));
    }
  };

  const A4_HEIGHT_PX = 1122; 

  // --- REUSABLE SECTION BLOCKS ---

  const CareerSummary = visibility.careerSummary !== false && (
    <section {...getBind(IDS.CAREER_SUMMARY, "mb-6 break-inside-avoid")}>
      <div className="flex items-center gap-3 mb-2">
        <h3 {...getBind(IDS.CAREER_SUMMARY_TITLE, "text-[12px] font-black uppercase tracking-wider text-[var(--color-button-primary-bg)] whitespace-nowrap")}>
          {getSectionTitle('careerSummary', 'Summary')}
        </h3>
        <div className="h-[1px] w-full bg-[var(--color-border-secondary)]" />
      </div>
      <p {...getBind(IDS.CAREER_SUMMARY, "text-[11px] leading-relaxed text-justify text-[var(--color-text-secondary)]")}>
        {careerSummary.summary}
      </p>
    </section>
  );

  const Experience = visibility.workExperience !== false && (
    <section {...getBind(IDS.EXPERIENCE, "mb-6")}>
      <div className="flex items-center gap-3 mb-4">
        <h3 {...getBind(IDS.EXPERIENCE_TITLE, "text-[12px] font-black uppercase tracking-wider text-[var(--color-button-primary-bg)] whitespace-nowrap")}>
          {getSectionTitle('workExperience', 'Experience')}
        </h3>
        <div className="h-[1px] w-full bg-[var(--color-border-secondary)]" />
      </div>
      <div className="space-y-5">
        {workExperience.map((job, i) => {
          const jobStyle = designConfig.containers?.[IDS.JOB_DESC(i)]?.style || {};
          const isBulletMode = jobStyle.display === 'list-item';

          return (
            <div key={i} {...getBind(IDS.JOB_ITEM(i), "break-inside-avoid group")}>
              <div className="flex justify-between items-baseline mb-0.5">
                <span {...getBind(IDS.JOB_TITLE(i), "font-bold text-[11px] text-[var(--color-text-primary)]")}>{job.jobTitle}</span>
                <span {...getBind(IDS.JOB_DATES(i), "text-[9px] font-semibold text-[var(--color-text-placeholder)]")}>
                  {job.startDate} — {job.endDate === "null" || !job.endDate ? "Present" : job.endDate}
                </span>
              </div>
              <div {...getBind(IDS.JOB_COMPANY(i), "text-[var(--color-button-primary-bg)] text-[10px] font-bold italic mb-1.5")}>{job.companyName}</div>
              
              <ul className={`${isBulletMode ? "list-disc ml-4 space-y-1" : "space-y-1"}`}>
                {job.responsibilities?.split('\n').filter(line => line.trim() !== "").map((line, idx) => (
                  <li 
                    key={idx} 
                    {...getBind(IDS.JOB_DESC(i), "text-[10px] text-[var(--color-text-secondary)] leading-relaxed text-justify")}
                    style={{ display: isBulletMode ? 'list-item' : 'block' }}
                  >
                    {line}
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </section>
  );

  const ProjectsBlock = visibility.projects !== false && (
    <section {...getBind(IDS.PROJECTS, "mb-6")}>
      <div className="flex items-center gap-3 mb-4">
        <h3 {...getBind(IDS.PROJECTS_TITLE, "text-[12px] font-black uppercase tracking-wider text-[var(--color-button-primary-bg)] whitespace-nowrap")}>
          {getSectionTitle('projects', 'Projects')}
        </h3>
        <div className="h-[1px] w-full bg-[var(--color-border-secondary)]" />
      </div>
      <div className="space-y-4">
        {projects.map((proj, i) => {
          const projStyle = designConfig.containers?.[IDS.PROJECT_DESC(i)]?.style || {};
          const isBulletMode = projStyle.display === 'list-item';

          return (
            <div key={i} {...getBind(IDS.PROJECT_ITEM(i), "break-inside-avoid")}>
              <div className="flex justify-between font-bold text-[11px]">
                <span {...getBind(IDS.PROJECT_NAME(i), "text-[var(--color-text-primary)]")}>{proj.projectName}</span>
                <span {...getBind(IDS.PROJECT_TECH(i), "text-[9px] font-normal italic text-[var(--color-text-placeholder)]")}>
                  {proj.technologiesUsed}
                </span>
              </div>
              
              <ul className={`${isBulletMode ? "list-disc ml-4 mt-1 space-y-1" : "mt-1 space-y-1"}`}>
                {proj.projectDescription?.split('\n').filter(line => line.trim() !== "").map((line, idx) => (
                  <li 
                    key={idx} 
                    {...getBind(IDS.PROJECT_DESC(i), "text-[10px] text-[var(--color-text-secondary)] italic text-justify leading-relaxed")}
                    style={{ display: isBulletMode ? 'list-item' : 'block' }}
                  >
                    {line}
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </section>
  );

  const EducationBlock = visibility.educationHistory !== false && (
    <section {...getBind(IDS.EDUCATION, "mb-6 break-inside-avoid")}>
      <div className="flex items-center gap-3 mb-3">
        <h3 {...getBind(IDS.EDUCATION_TITLE, "text-[11px] font-black uppercase tracking-wider text-[var(--color-button-primary-bg)] whitespace-nowrap")}>
          {getSectionTitle('educationHistory', 'Education')}
        </h3>
        <div className="h-[1px] w-full bg-[var(--color-border-secondary)]" />
      </div>
      {educationHistory.map((edu, i) => (
        <div key={i} {...getBind(IDS.EDU_ITEM(i), "mb-3")}>
          <div {...getBind(IDS.EDU_SCHOOL(i), "font-bold text-[10px] uppercase text-[var(--color-text-primary)]")}>{edu.university}</div>
          <div {...getBind(IDS.EDU_DEGREE(i), "text-[10px] text-[var(--color-button-primary-bg)] font-medium")}>{edu.degree}</div>
          <div className="text-[9px] text-[var(--color-text-placeholder)] font-bold">{edu.startDate} — {edu.endDate}</div>
        </div>
      ))}
    </section>
  );

  const SkillsBlock = (
    <section {...getBind(IDS.SKILLS_SUMMARY, "mb-6 break-inside-avoid")}>
      <div className="flex items-center gap-3 mb-3">
        <h3 {...getBind(IDS.SKILLS_SUMMARY_TITLE, "text-[11px] font-black uppercase tracking-wider text-[var(--color-text-placeholder)] whitespace-nowrap")}>
          {getSectionTitle('skillsSummary', 'Expertise')}
        </h3>
        <div className="h-[1px] w-full bg-[var(--color-border-secondary)]" />
      </div>
      <div className="text-[10px] leading-relaxed text-[var(--color-text-secondary)] space-y-2">
        <div {...getBind(IDS.TECHNICAL_SKILLS)}><span className="font-bold text-[var(--color-text-primary)]">Technical:</span> {skillsSummary.technicalSkills}</div>
        <div {...getBind(IDS.TOOLS)}><span className="font-bold text-[var(--color-text-primary)]">Tools:</span> {skillsSummary.tools}</div>
        <div {...getBind(IDS.SOFT_SKILLS)}><span className="font-bold text-[var(--color-text-primary)]">Soft Skills:</span> {skillsSummary.softSkills}</div>
      </div>
    </section>
  );

  const CertsBlock = visibility.certifications !== false && (
    <section {...getBind(IDS.CERTIFICATIONS, "mb-6 break-inside-avoid")}>
      <div className="flex items-center gap-3 mb-3">
        <h3 {...getBind(IDS.CERTIFICATIONS_TITLE, "text-[11px] font-black uppercase tracking-wider text-[var(--color-button-primary-bg)] whitespace-nowrap")}>
          {getSectionTitle('certifications', 'Certifications')}
        </h3>
        <div className="h-[1px] w-full bg-[var(--color-border-secondary)]" />
      </div>
      <ul className="list-none space-y-1.5">
        {certifications.map((cert, i) => (
          <li key={i} {...getBind(IDS.CERT_ITEM(i), "text-[10px] text-[var(--color-text-secondary)] flex gap-2")}>
            <span className="text-[var(--color-button-primary-bg)]">•</span>
            <span {...getBind(IDS.CERT_NAME(i))}>{cert.certificationName}</span>
          </li>
        ))}
      </ul>
    </section>
  );

  const getMainColSpan = () => {
    if (layoutKey === 'secondary') return "col-span-2";
    if (layoutKey === 'tertiary') return "col-span-3";
    if (layoutKey === 'quaternary') return "col-span-4";
    return "col-span-1";
  };

  const getSidebarColSpan = () => {
    if (layoutKey === 'quaternary') return "col-span-2";
    return "col-span-1";
  };

  return (
    <div 
      className="flex flex-col items-center bg-[var(--color-background-tertiary)] min-h-screen print:bg-white print:p-0"
      onClick={handleDeselect}
    >
      <div 
        ref={resumeRef}
        {...getBind(IDS.PAGE, "w-[210mm] min-h-[297mm] h-auto bg-white p-[18mm] flex flex-col font-sans relative shadow-2xl print:shadow-none print:m-0")}
      >
        
        {/* DYNAMIC PAGE BREAK GUIDES */}
        <div className="print:hidden pointer-events-none absolute inset-0">
          {contentHeight > A4_HEIGHT_PX && (
            <div className="absolute left-0 w-full border-t border-dashed border-red-300 opacity-60" style={{ top: '297mm' }}>
              <span className="bg-red-400 text-white text-[8px] px-2 absolute right-0">PAGE 1 LIMIT</span>
            </div>
          )}
        </div>

        {/* HEADER */}
        <header {...getBind(IDS.HEADER, "mb-10 text-center break-inside-avoid")}>
          <div className="w-12 h-1.5 bg-[var(--color-button-primary-bg)] mx-auto mb-4" />
          <div {...getBind(IDS.FULL_NAME, "text-5xl font-black mb-2 uppercase tracking-tighter text-[var(--color-text-primary)]")}>
            {pi.fullName || "User Name"}
          </div>
          <div className="flex justify-center items-center gap-4 text-[10px] font-bold uppercase tracking-widest text-[var(--color-text-secondary)]">
            <span {...getBind(IDS.EMAIL)}>{pi.email}</span>
            <span className="text-[var(--color-button-primary-bg)] text-lg leading-none">•</span>
            <span {...getBind(IDS.PHONE_NUMBER)}>{pi.phoneNumber}</span>
            <span className="text-[var(--color-button-primary-bg)] text-lg leading-none">•</span>
            <span {...getBind(IDS.ADDRESS)}>{pi.address || "Location"}</span>
          </div>
        </header>

        <div className={gridClass}>
          {/* MAIN COLUMN */}
          <div className={`${getMainColSpan()} space-y-2`}>
            {CareerSummary}
            {Experience}
            {ProjectsBlock}
            {layoutKey === 'primary' && (
              <>
                {EducationBlock}
                {CertsBlock}
                {SkillsBlock}
              </>
            )}
          </div>

          {/* SIDEBAR COLUMN */}
          {layoutKey !== 'primary' && (
            <div className={`${getSidebarColSpan()} border-l-2 border-[var(--color-border-secondary)] pl-8 space-y-2`}>
              {EducationBlock}
              {CertsBlock}
              {SkillsBlock}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}