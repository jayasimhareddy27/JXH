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

  useEffect(() => {
    if (resumeRef.current) {
      setContentHeight(resumeRef.current.offsetHeight);
    }
  }, [formDataMap]);

  if (!formDataMap) return null;

  const {
    personalInformation: pi = {},
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

  const getBind = (id, classes = "") => 
    bind(id, designConfig, selectedContainer, dispatch, classes);

  const getSectionTitle = (key, defaultTitle) => {
    const section = sectionTitles.find(s => s.key === key);
    return section ? section.title : defaultTitle;
  };

  const handleDeselect = (e) => {
    if (e.target === e.currentTarget) {
      dispatch(selectContainer(null));
    }
  };

  /**
   * UPDATED VISIBLE WRAPPER
   * Handles both Visibility and Link (href) injection
   */
  const Visible = ({ id, children }) => {
    if (visibility[id] === false) return null;

    // Check if this specific element has a link defined in the Design Tab
    const customHref = designConfig?.containers?.[id]?.style?.href;

    if (customHref && customHref.trim() !== "") {
      return (
        <a 
          href={customHref.startsWith('http') ? customHref : `https://${customHref}`} 
          target="_blank" 
          rel="noopener noreferrer"
          className="hover:underline decoration-dotted"
        >
          {children}
        </a>
      );
    }

    return children;
  };

  const A4_HEIGHT_PX = 1122;

  // ====================== REUSABLE SECTION HEADER ======================
  const SectionHeader = ({ sectionKey, titleId, defaultTitle, decorator }) => (
    <Visible id={sectionKey}>
      <div {...getBind(sectionKey, "flex items-center gap-4 w-full")}>
        <Visible id={titleId}>
          <h3 
            {...getBind(titleId, 
              "text-[14px] font-black uppercase tracking-wider text-[var(--color-button-primary-bg)] whitespace-nowrap"
            )}>
            {getSectionTitle(sectionKey, defaultTitle)}
          </h3>
        </Visible>
        <Visible id={decorator}>
          <hr 
            {...getBind(decorator, 
              "flex-grow border-t-2 border-[var(--color-button-primary-bg)] opacity-30 cursor-pointer py-1" 
            )} 
          />
        </Visible>
      </div>
    </Visible>
  );

  // ====================== SECTIONS ======================

  const CareerSummarySection = visibility.careerSummary !== false && (
    <section {...getBind(IDS.CAREER_SUMMARY, "mb-3 break-inside-avoid")}>
      <SectionHeader 
        sectionKey="careerSummary" 
        titleId={IDS.CAREER_SUMMARY_TITLE} 
        decorator={IDS.CAREER_SUMMARY_DECORATOR}
        defaultTitle="Professional Summary" 
      />
      <Visible id={IDS.CAREER_SUMMARY_CONTENT}>
        <p 
          {...getBind(IDS.CAREER_SUMMARY_CONTENT, 
            "text-[11px] leading-relaxed text-justify text-[var(--color-text-secondary)]"
          )}
        >
          {careerSummary.summary || ""}
        </p>
      </Visible>
    </section>
  );

  const ExperienceSection = visibility.workExperience !== false && (
    <section {...getBind(IDS.EXPERIENCE, "mb-3")}>
      <SectionHeader 
        sectionKey="workExperience" 
        titleId={IDS.EXPERIENCE_TITLE} 
        decorator={IDS.EXPERIENCE_DECORATOR}
        defaultTitle="Experience" 
      />

      <div className="space-y-1">
        {workExperience.map((job, i) => (
          <Visible id={IDS.JOB_ITEM(i)} key={i}>
            <div {...getBind(IDS.JOB_ITEM(i), "break-inside-avoid group")}>
              <Visible id={IDS.JOB_HEADER(i)}>
                <div {...getBind(IDS.JOB_HEADER(i), "flex justify-between items-baseline ")}>
                  <span>
                    <Visible id={IDS.JOB_COMPANY(i)}>
                      <span {...getBind(IDS.JOB_COMPANY(i), "text-[var(--color-button-primary-bg)] text-[10px] font-bold italic mb-2")}>
                        {job.companyName}{","}
                      </span>
                    </Visible>
                    <Visible id={IDS.JOB_TITLE(i)}>
                      <span {...getBind(IDS.JOB_TITLE(i), "font-bold text-[11px] text-[var(--color-text-primary)]")}>
                        {" "}{job.jobTitle}
                      </span>
                    </Visible>
                  </span>
                  <Visible id={IDS.JOB_DATES(i)}>
                    <span {...getBind(IDS.JOB_DATES(i), "text-[9px] font-semibold text-[var(--color-text-placeholder)]")}>
                      {job.startDate} — {job.endDate === "null" || !job.endDate ? "Present" : job.endDate}
                    </span>
                  </Visible>
                </div>
              </Visible>

              <ul className="space-y-1">
                {job.responsibilities?.split('\n').filter(line => line.trim() !== "").map((line, idx) => (
                  <Visible id={IDS.JOB_DESC_POINT(i, idx)} key={idx}>
                    <li 
                      {...getBind(IDS.JOB_DESC_POINT(i, idx), 
                        "text-[10px] text-[var(--color-text-secondary)] leading-relaxed text-justify relative before:absolute before:left-0 before:text-[var(--color-button-primary-bg)]"
                      )}
                    >
                      {line}
                    </li>
                  </Visible>
                ))}
              </ul>
            </div>
          </Visible>
        ))}
      </div>
    </section>
  );

  const ProjectsSection = visibility.projects !== false && (
    <section {...getBind(IDS.PROJECTS, "mb-3")}>
      <SectionHeader 
        sectionKey="projects" 
        titleId={IDS.PROJECTS_TITLE} 
        decorator={IDS.PROJECTS_DECORATOR}
        defaultTitle="Projects" 
      />
      <div className="space-y-5">
        {projects.map((proj, i) => (
          <Visible id={IDS.PROJECT_ITEM(i)} key={i}>
            <div {...getBind(IDS.PROJECT_ITEM(i), "break-inside-avoid")}>
              <Visible id={IDS.PROJECT_HEADER(i)}>
                <div {...getBind(IDS.PROJECT_HEADER(i), "flex justify-between items-baseline mb-1")}>
                  <Visible id={IDS.PROJECT_NAME(i)}>
                    <span {...getBind(IDS.PROJECT_NAME(i), "font-bold text-[11px] text-[var(--color-text-primary)]")}>
                      {proj.projectName}
                    </span>
                  </Visible>
                  <Visible id={IDS.PROJECT_TECH(i)}>
                    <span {...getBind(IDS.PROJECT_TECH(i), "text-[9px] font-normal italic text-[var(--color-text-placeholder)]")}>
                      {proj.technologiesUsed}
                    </span>
                  </Visible>
                </div>
              </Visible>
              <ul className="space-y-1">
                {proj.projectDescription?.split('\n').filter(line => line.trim() !== "").map((line, idx) => (
                  <Visible id={IDS.PROJECT_DESC_POINT(i, idx)} key={idx}>
                    <li 
                      {...getBind(IDS.PROJECT_DESC_POINT(i, idx), 
                        "text-[10px] text-[var(--color-text-secondary)] italic leading-relaxed text-justify pl-5 relative before:content-['•'] before:absolute before:left-0 before:text-[var(--color-button-primary-bg)]"
                      )}
                    >
                      {line}
                    </li>
                  </Visible>
                ))}
              </ul>
            </div>
          </Visible>
        ))}
      </div>
    </section>
  );

  const EducationSection = visibility.educationHistory !== false && (
    <section {...getBind(IDS.EDUCATION, "mb-3 break-inside-avoid")}>
      <SectionHeader 
        sectionKey="educationHistory" 
        titleId={IDS.EDUCATION_TITLE} 
        decorator={IDS.EDUCATION_DECORATOR}
        defaultTitle="Education" 
      />
      <div className="space-y-4">
        {educationHistory.map((edu, i) => (
          <Visible id={IDS.EDU_ITEM(i)} key={i}>
            <div {...getBind(IDS.EDU_ITEM(i))}>
              <Visible id={IDS.EDU_SCHOOL(i)}>
                <div {...getBind(IDS.EDU_SCHOOL(i), "font-bold text-[10px] uppercase text-[var(--color-text-primary)]")}>
                  {edu.university}
                </div>
              </Visible>
              <Visible id={IDS.EDU_DEGREE(i)}>
                <div {...getBind(IDS.EDU_DEGREE(i), "text-[10px] text-[var(--color-button-primary-bg)] font-medium")}>
                  {edu.degree}
                </div>
              </Visible>
              <Visible id={IDS.EDU_DATES(i)}>
                <div {...getBind(IDS.EDU_DATES(i), "text-[9px] text-[var(--color-text-placeholder)] font-medium")}>
                  {edu.startDate} — {edu.endDate}
                </div>
              </Visible>
            </div>
          </Visible>
        ))}
      </div>
    </section>
  );

  const SkillsSection = visibility.skillsSummary !== false && (
    <section {...getBind(IDS.SKILLS_SUMMARY, "mb-3 break-inside-avoid")}>
      <SectionHeader 
        sectionKey="skillsSummary" 
        titleId={IDS.SKILLS_SUMMARY_TITLE} 
        decorator={IDS.SKILLS_SUMMARY_DECORATOR}
        defaultTitle="Expertise" 
      />
      <div className="text-[10px] leading-relaxed text-[var(--color-text-secondary)] space-y-2.5">
        <Visible id={IDS.TECHNICAL_SKILLS}>
          <div {...getBind(IDS.TECHNICAL_SKILLS)}>
            <span className="font-bold text-[var(--color-text-primary)]">Technical: </span>
            {skillsSummary.technicalSkills}
          </div>
        </Visible>
        <Visible id={IDS.TOOLS}>
          <div {...getBind(IDS.TOOLS)}>
            <span className="font-bold text-[var(--color-text-primary)]">Tools: </span>
            {skillsSummary.tools}
          </div>
        </Visible>
        <Visible id={IDS.SOFT_SKILLS}>
          <div {...getBind(IDS.SOFT_SKILLS)}>
            <span className="font-bold text-[var(--color-text-primary)]">Soft Skills: </span>
            {skillsSummary.softSkills}
          </div>
        </Visible>
      </div>
    </section>
  );

  const CertificationsSection = visibility.certifications !== false && (
    <section {...getBind(IDS.CERTIFICATIONS, "mb-3 break-inside-avoid")}>
      <SectionHeader 
        sectionKey="certifications" 
        titleId={IDS.CERTIFICATIONS_TITLE} 
        decorator={IDS.CERTIFICATIONS_DECORATOR}
        defaultTitle="Certifications" 
      />
      <ul className="space-y-1.5 text-[10px] text-[var(--color-text-secondary)]">
        {certifications.map((cert, i) => (
          <Visible id={IDS.CERT_ITEM(i)} key={i}>
            <li {...getBind(IDS.CERT_ITEM(i), "flex gap-2 items-start")}>
              <span className="text-[var(--color-button-primary-bg)] mt-0.5">•</span>
              <Visible id={IDS.CERT_NAME(i)}>
                <span {...getBind(IDS.CERT_NAME(i))}>{cert.certificationName}</span>
              </Visible>
            </li>
          </Visible>
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

  const getSidebarColSpan = () => 
    layoutKey === 'quaternary' ? "col-span-2" : "col-span-1";

  return (
    <div 
      className="flex flex-col items-center bg-[var(--color-background-tertiary)] min-h-screen print:bg-white print:p-0"
      onClick={handleDeselect}
    >
      <div 
        ref={resumeRef}
        {...getBind(IDS.PAGE, 
          "w-[210mm] min-h-[297mm] bg-white p-[10mm] flex flex-col font-sans relative shadow-2xl print:shadow-none print:m-0"
        )}
      >
        <div className="print:hidden pointer-events-none absolute inset-0 z-10">
          {contentHeight > A4_HEIGHT_PX && (
            <div 
              className="absolute left-0 w-full border-t border-dashed border-red-300 opacity-60" 
              style={{ top: '297mm' }}
            >
              <span className="bg-red-400 text-white text-[8px] px-2 absolute -top-2 right-4 font-medium">
                PAGE 1 LIMIT
              </span>
            </div>
          )}
        </div>

        <header {...getBind(IDS.HEADER, "mb-3 text-center break-inside-avoid")}>
          <Visible id={IDS.FULL_NAME}>
            <div {...getBind(IDS.FULL_NAME, "text-5xl font-black mb-2 uppercase tracking-tighter text-[var(--color-text-primary)]")}>
              {pi.fullName || "Your Name"}
            </div>
          </Visible>

          <Visible id={IDS.CONTACT_INFO}>
            <div {...getBind(IDS.CONTACT_INFO, "flex justify-center items-center gap-4 text-[10px] font-bold uppercase tracking-widest text-[var(--color-text-secondary)]")}>
              <Visible id={IDS.EMAIL}><span {...getBind(IDS.EMAIL)}>{pi.email}</span></Visible>
              <Visible id={IDS.PHONE_NUMBER}><span {...getBind(IDS.PHONE_NUMBER)}>{pi.phoneNumber}</span></Visible>
              <Visible id={IDS.ADDRESS}><span {...getBind(IDS.ADDRESS)}>{pi.address || ""}</span></Visible>
            </div>
          </Visible>
        </header>

        <div className={gridClass}>
          <div className={`${getMainColSpan()} `}>
            {CareerSummarySection}
            {ExperienceSection}
            {ProjectsSection}
            {layoutKey === 'primary' && (
              <>
                {EducationSection}
                {CertificationsSection}
                {SkillsSection}
              </>
            )}
          </div>

          {layoutKey !== 'primary' && (
            <div className={`${getSidebarColSpan()} border-l-2 border-[var(--color-border-secondary)] pl-8 space-y-6`}>
              {EducationSection}
              {CertificationsSection}
              {SkillsSection}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}