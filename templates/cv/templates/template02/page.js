'use client';

import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import { RESUME_IDS02 as IDS, layoutGrid02 } from './index';
import { bind } from '@/app/editor/(shared)/editorstyles';
import { selectContainer } from '@lib/redux/features/editor/slice';
import { useRef, useEffect, useState } from 'react';

export default function Template02() {
  const dispatch = useDispatch();
  const resumeRef = useRef(null);
  const [contentHeight, setContentHeight] = useState(0);

  const formDataMap = useSelector((state) => state.editor.formDataMap, shallowEqual);

  // Measure height for page break guide to ensure consistency with Template 01
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
  const gridClass = layoutGrid02[layoutKey] || layoutGrid02.primary;
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
   * UNIVERSAL VISIBILITY & LINK WRAPPER
   * Prevents rendering if hidden and injects <a> tags for links
   */
  const Visible = ({ id, children }) => {
    if (visibility[id] === false) return null;

    const customHref = designConfig?.containers?.[id]?.style?.href;
    if (customHref && customHref.trim() !== "") {
      return (
        <a 
          href={customHref.startsWith('http') ? customHref : `https://${customHref}`} 
          target="_blank" 
          rel="noopener noreferrer"
          className="hover:underline decoration-dotted transition-all"
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
      <div {...getBind(sectionKey, "flex flex-col mb-6")}>
        <div className="flex items-center gap-3">
          <Visible id={decorator}>
            <div {...getBind(decorator, "w-[5px] h-[24px] bg-[var(--color-button-primary-bg)] rounded-sm")} />
          </Visible>
          <Visible id={titleId}>
            <h3 
              {...getBind(titleId, 
                "text-[16px] font-black uppercase tracking-tight text-[var(--color-text-primary)]"
              )}>
              {getSectionTitle(sectionKey, defaultTitle)}
            </h3>
          </Visible>
        </div>
      </div>
    </Visible>
  );

  // ====================== GRANULAR SUB-SECTIONS ======================

  const EducationSection = visibility.educationHistory !== false && (
    <section {...getBind(IDS.EDUCATION, "mb-8 break-inside-avoid")}>
      <SectionHeader sectionKey="educationHistory" titleId={IDS.EDUCATION_TITLE} decorator={IDS.EDUCATION_DECORATOR} defaultTitle="Education" />
      <div className="space-y-5">
        {educationHistory.map((edu, i) => (
          <Visible id={IDS.EDU_ITEM(i)} key={i}>
            <div {...getBind(IDS.EDU_ITEM(i))}>
              <Visible id={IDS.EDU_SCHOOL(i)}>
                <div {...getBind(IDS.EDU_SCHOOL(i), "font-bold text-[13px] text-slate-800 uppercase")}>{edu.university}</div>
              </Visible>
              <Visible id={IDS.EDU_DEGREE(i)}>
                <div {...getBind(IDS.EDU_DEGREE(i), "text-[11px] text-[var(--color-button-primary-bg)] font-bold")}>{edu.degree}</div>
              </Visible>
              <Visible id={IDS.EDU_DATES(i)}>
                <div {...getBind(IDS.EDU_DATES(i), "text-[10px] text-slate-400 font-bold mt-0.5")}>{edu.startDate} — {edu.endDate}</div>
              </Visible>
            </div>
          </Visible>
        ))}
      </div>
    </section>
  );

  const SkillsSection = visibility.skillsSummary !== false && (
    <section {...getBind(IDS.SKILLS_SUMMARY, "mb-8 break-inside-avoid")}>
      <SectionHeader sectionKey="skillsSummary" titleId={IDS.SKILLS_SUMMARY_TITLE} decorator={IDS.SKILLS_SUMMARY_DECORATOR} defaultTitle="Expertise" />
      <div className="space-y-5 pt-1">
        <Visible id={IDS.TECHNICAL_SKILLS}>
          <div {...getBind(IDS.TECHNICAL_SKILLS)}>
            <p className="text-[10px] font-black text-slate-400 uppercase mb-2 tracking-widest">Technical Proficiency</p>
            <div className="flex flex-wrap gap-1.5">
              {skillsSummary.technicalSkills?.split(',').map((skill, i) => (
                <span key={i} className="text-[9px] font-bold bg-slate-100 text-slate-600 px-2.5 py-1 rounded uppercase tracking-tighter hover:bg-slate-200 transition-colors">
                  {skill.trim()}
                </span>
              ))}
            </div>
          </div>
        </Visible>
        <Visible id={IDS.TOOLS}>
          <div {...getBind(IDS.TOOLS)}>
            <p className="text-[10px] font-black text-slate-400 uppercase mb-1 tracking-widest">Tools & Infrastructure</p>
            <p {...getBind(IDS.TOOLS, "text-[11px] text-slate-600 leading-relaxed font-medium")}>{skillsSummary.tools}</p>
          </div>
        </Visible>
        <Visible id={IDS.SOFT_SKILLS}>
           <div {...getBind(IDS.SOFT_SKILLS)}>
            <p className="text-[10px] font-black text-slate-400 uppercase mb-1 tracking-widest">Core Competencies</p>
            <p {...getBind(IDS.SOFT_SKILLS, "text-[11px] text-slate-600 leading-relaxed font-medium")}>{skillsSummary.softSkills}</p>
          </div>
        </Visible>
      </div>
    </section>
  );

  const CertificationsSection = visibility.certifications !== false && (
    <section {...getBind(IDS.CERTIFICATIONS, "mb-8 break-inside-avoid")}>
      <SectionHeader sectionKey="certifications" titleId={IDS.CERTIFICATIONS_TITLE} decorator={IDS.CERTIFICATIONS_DECORATOR} defaultTitle="Certifications" />
      <ul className="space-y-3">
        {certifications.map((cert, i) => (
          <Visible id={IDS.CERT_ITEM(i)} key={i}>
            <li {...getBind(IDS.CERT_ITEM(i), "flex gap-3 items-start group")}>
              <div className="mt-1.5 w-2 h-2 rounded-sm bg-[var(--color-button-primary-bg)] opacity-30 group-hover:opacity-100 transition-opacity" />
              <Visible id={IDS.CERT_NAME(i)}>
                <span {...getBind(IDS.CERT_NAME(i), "text-[11.5px] font-bold text-slate-700 leading-tight")}>{cert.certificationName}</span>
              </Visible>
            </li>
          </Visible>
        ))}
      </ul>
    </section>
  );

  // ====================== MAIN LAYOUT CALCULATIONS ======================
  const getMainColSpan = () => {
    if (layoutKey === 'secondary') return "col-span-2";
    if (layoutKey === 'tertiary') return "col-span-3";
    if (layoutKey === 'quaternary') return "col-span-3";
    return "col-span-1";
  };

  const getSidebarColSpan = () => 
    (layoutKey === 'quaternary' || layoutKey === 'tertiary') ? "col-span-1" : "col-span-1";

  // ====================== RENDER ======================

  return (
    <div className="flex flex-col items-center bg-[var(--color-background-tertiary)] min-h-screen print:bg-white print:p-0" onClick={handleDeselect}>
      <div ref={resumeRef} {...getBind(IDS.PAGE, "w-[210mm] min-h-[297mm] bg-white p-[18mm] flex flex-col font-sans relative shadow-2xl print:shadow-none print:m-0")}>
        
        {/* Page Break Guide */}
        <div className="print:hidden pointer-events-none absolute inset-0 z-10">
          {contentHeight > A4_HEIGHT_PX && (
            <div className="absolute left-0 w-full border-t border-dashed border-red-300 opacity-60" style={{ top: '297mm' }}>
              <span className="bg-red-400 text-white text-[8px] px-2 absolute -top-2 right-4 font-medium uppercase tracking-widest">Page 1 Boundary</span>
            </div>
          )}
        </div>

        {/* HEADER - Left Aligned Modern Style */}
        <header {...getBind(IDS.HEADER, "mb-12 text-left flex flex-col gap-4")}>
          <Visible id={IDS.FULL_NAME}>
            <h1 {...getBind(IDS.FULL_NAME, "text-6xl font-black tracking-tighter text-slate-900 leading-[0.85] uppercase")}>
              {pi.fullName || "Your Name"}
            </h1>
          </Visible>

          <Visible id={IDS.CONTACT_INFO}>
            <div {...getBind(IDS.CONTACT_INFO, "flex flex-wrap gap-x-8 gap-y-2 text-[11px] font-black uppercase tracking-[0.15em] text-slate-400")}>
              <Visible id={IDS.EMAIL}><span {...getBind(IDS.EMAIL)} className="flex items-center gap-2">{pi.email}</span></Visible>
              <Visible id={IDS.PHONE_NUMBER}><span {...getBind(IDS.PHONE_NUMBER)} className="flex items-center gap-2">{pi.phoneNumber}</span></Visible>
              <Visible id={IDS.ADDRESS}><span {...getBind(IDS.ADDRESS)} className="flex items-center gap-2">{pi.address}</span></Visible>
            </div>
          </Visible>
        </header>

        <div className={gridClass}>
          {/* Main Content Column */}
          <div className={`${getMainColSpan()} space-y-12`}>
            
            {/* Career Summary */}
            {visibility.careerSummary !== false && (
              <section {...getBind(IDS.CAREER_SUMMARY, "break-inside-avoid")}>
                <SectionHeader sectionKey="careerSummary" titleId={IDS.CAREER_SUMMARY_TITLE} decorator={IDS.CAREER_SUMMARY_DECORATOR} defaultTitle="Professional Profile" />
                <Visible id={IDS.CAREER_SUMMARY_CONTENT}>
                  <p {...getBind(IDS.CAREER_SUMMARY_CONTENT, "text-[12.5px] leading-relaxed text-slate-600 text-justify italic font-medium")}>
                    {careerSummary.summary}
                  </p>
                </Visible>
              </section>
            )}

            {/* Work Experience */}
            {visibility.workExperience !== false && (
              <section {...getBind(IDS.EXPERIENCE)}>
                <SectionHeader sectionKey="workExperience" titleId={IDS.EXPERIENCE_TITLE} decorator={IDS.EXPERIENCE_DECORATOR} defaultTitle="Experience" />
                <div className="space-y-10">
                  {workExperience.map((job, i) => (
                    <Visible id={IDS.JOB_ITEM(i)} key={i}>
                      <div {...getBind(IDS.JOB_ITEM(i), "break-inside-avoid")}>
                        <Visible id={IDS.JOB_HEADER(i)}>
                          <div {...getBind(IDS.JOB_HEADER(i), "flex justify-between items-baseline mb-1")}>
                            <Visible id={IDS.JOB_TITLE(i)}><span {...getBind(IDS.JOB_TITLE(i), "font-black text-[15px] text-slate-900 uppercase tracking-tight")}>{job.jobTitle}</span></Visible>
                            <Visible id={IDS.JOB_DATES(i)}><span {...getBind(IDS.JOB_DATES(i), "text-[10px] font-black text-slate-400 uppercase tracking-widest")}>{job.startDate} — {job.endDate || "Present"}</span></Visible>
                          </div>
                        </Visible>
                        <Visible id={IDS.JOB_COMPANY(i)}><div {...getBind(IDS.JOB_COMPANY(i), "text-[var(--color-button-primary-bg)] text-[12.5px] font-bold mb-4")}>{job.companyName}</div></Visible>
                        <ul className="space-y-2.5 ml-1">
                          {job.responsibilities?.split('\n').filter(l => l.trim()).map((line, idx) => (
                            <Visible id={IDS.JOB_DESC_POINT(i, idx)} key={idx}>
                              <li {...getBind(IDS.JOB_DESC_POINT(i, idx), "text-[11.5px] text-slate-600 leading-relaxed text-justify relative pl-5 before:content-[''] before:absolute before:left-0 before:top-[9px] before:w-2 before:h-[1px] before:bg-slate-300")}>
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
            )}

            {/* Projects Section */}
            {visibility.projects !== false && (
              <section {...getBind(IDS.PROJECTS)}>
                <SectionHeader sectionKey="projects" titleId={IDS.PROJECTS_TITLE} decorator={IDS.PROJECTS_DECORATOR} defaultTitle="Key Projects" />
                <div className="space-y-10">
                  {projects.map((proj, i) => (
                    <Visible id={IDS.PROJECT_ITEM(i)} key={i}>
                      <div {...getBind(IDS.PROJECT_ITEM(i), "break-inside-avoid")}>
                        <Visible id={IDS.PROJECT_HEADER(i)}>
                           <div className="flex justify-between items-baseline mb-3">
                            <Visible id={IDS.PROJECT_NAME(i)}><span {...getBind(IDS.PROJECT_NAME(i), "font-black text-[14px] text-slate-900 uppercase")}>{proj.projectName}</span></Visible>
                            <Visible id={IDS.PROJECT_TECH(i)}><span {...getBind(IDS.PROJECT_TECH(i), "text-[10px] font-bold text-slate-400 bg-slate-50 px-2 py-0.5 border border-slate-100 uppercase tracking-tighter")}>{proj.technologiesUsed}</span></Visible>
                          </div>
                        </Visible>
                        <ul className="space-y-2">
                          {proj.projectDescription?.split('\n').filter(l => l.trim()).map((line, idx) => (
                            <Visible id={IDS.PROJECT_DESC_POINT(i, idx)} key={idx}>
                              <li {...getBind(IDS.PROJECT_DESC_POINT(i, idx), "text-[11.5px] text-slate-500 leading-relaxed italic pl-5 border-l-2 border-slate-100")}>{line}</li>
                            </Visible>
                          ))}
                        </ul>
                      </div>
                    </Visible>
                  ))}
                </div>
              </section>
            )}

            {/* Extra Sections for Single Column Layout */}
            {layoutKey === 'primary' && (
              <div className="space-y-12">
                {EducationSection}
                {CertificationsSection}
                {SkillsSection}
              </div>
            )}
          </div>

          {/* Sidebar Column */}
          {layoutKey !== 'primary' && (
            <div className={`${getSidebarColSpan()} border-l border-slate-100 pl-8 space-y-12`}>
              {EducationSection}
              {SkillsSection}
              {CertificationsSection}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}