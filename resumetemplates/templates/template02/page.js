"use client";

import { useSelector, useDispatch, shallowEqual } from "react-redux";
import { RESUME_IDS02 as IDS } from "./index"; // Using IDS02 from your specific file
import { bind } from "@resumetemplates/editorstyles";
import { selectContainer } from "@lib/redux/features/resumes/resumeeditor/slice";
import { useRef, useEffect, useState } from "react";
import { layoutGrid02 } from "./index";

export default function Template02() {
  const dispatch = useDispatch();
  const resumeRef = useRef(null);
  const [contentHeight, setContentHeight] = useState(0);

  const formDataMap = useSelector((state) => state.resumeEditor.formDataMap, shallowEqual);

  // Measure content height whenever data changes to toggle page guides
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
  const layoutKey = designConfig.layout || "primary";
  const gridClass = layoutGrid02[layoutKey] || "grid grid-cols-1";
  const visibility = designConfig.visibility || {};

  const getBind = (id, classes = "") => bind(id, designConfig, selectedContainer, dispatch, classes);

  const getSectionTitle = (key, defaultTitle) => {
    const section = sectionTitles.find((s) => s.key === key);
    return section ? section.title : defaultTitle;
  };

  const handleDeselect = (e) => {
    if (e.target === e.currentTarget) {
      dispatch(selectContainer(null));
    }
  };

  const A4_HEIGHT_PX = 1122;

  // --- REUSABLE SECTION BLOCKS ---

  const SummaryBlock = visibility.careerSummary !== false && careerSummary.summary && (
    <section {...getBind(IDS.CAREER_SUMMARY, "mb-4")}>
      <h3 {...getBind("SUMM_H3", "text-sm font-bold uppercase mb-2 border-b border-gray-300 pb-1")}>
        {getSectionTitle("careerSummary", "Profile")}
      </h3>
      <p className="text-[12px] leading-relaxed text-gray-700 text-justify">
        {careerSummary.summary}
      </p>
    </section>
  );

  const ExperienceBlock = visibility.workExperience !== false && (
    <section {...getBind(IDS.EXPERIENCE, "mb-4")}>
      <h3 {...getBind("EXP_H3", "text-sm font-bold uppercase mb-2 border-b border-gray-300 pb-1")}>
        {getSectionTitle("workExperience", "Experience")}
      </h3>
      <div className="space-y-4">
        {workExperience.map((job, i) => (
          <div key={i} {...getBind(IDS.JOB_ITEM(i), "break-inside-avoid")}>
            <div className="flex justify-between items-baseline">
              <span {...getBind(IDS.JOB_TITLE(i), "font-bold text-[14px] text-gray-900")}>
                {job.jobTitle}
              </span>
              <span {...getBind(IDS.JOB_DATES(i), "text-xs text-gray-500 font-medium")}>
                {job.startDate} — {job.endDate || "Present"}
              </span>
            </div>
            <div {...getBind(IDS.JOB_COMPANY(i), "text-[13px] font-semibold text-blue-700")}>
              {job.companyName} {job.location && `• ${job.location}`}
            </div>
            <p {...getBind(IDS.JOB_DESC(i), "text-[12px] leading-relaxed mt-1 text-gray-600")}>
              {job.responsibilities}
            </p>
          </div>
        ))}
      </div>
    </section>
  );

  const EducationBlock = visibility.educationHistory !== false && (
    <section {...getBind(IDS.EDUCATION, "mb-4")}>
      <h3 {...getBind("EDU_H3", "text-sm font-bold uppercase mb-2 border-b border-gray-300 pb-1")}>
        {getSectionTitle("educationHistory", "Education")}
      </h3>
      <div className="space-y-3">
        {educationHistory.map((edu, i) => (
          <div key={i} {...getBind(IDS.EDU_ITEM(i), "break-inside-avoid")}>
            <div className="flex justify-between items-baseline">
              <span {...getBind(IDS.EDU_DEGREE(i), "font-bold text-[14px] text-gray-900")}>
                {edu.degree} {edu.major && `in ${edu.major}`}
              </span>
              <span className="text-xs text-gray-500">{edu.startDate} — {edu.endDate}</span>
            </div>
            <div className="flex justify-between text-xs mt-0.5">
              <span {...getBind(IDS.EDU_SCHOOL(i), "font-medium text-gray-600")}>{edu.university}</span>
              {edu.gpa && <span className="font-bold text-gray-600">GPA: {edu.gpa}</span>}
            </div>
          </div>
        ))}
      </div>
    </section>
  );

  const ProjectsBlock = visibility.projects !== false && (
    <section {...getBind(IDS.PROJECTS, "mb-4")}>
      <h3 {...getBind("PROJ_H3", "text-sm font-bold uppercase mb-2 border-b border-gray-300 pb-1")}>
        {getSectionTitle("projects", "Projects")}
      </h3>
      <div className="space-y-4">
        {projects.map((p, i) => (
          <div key={i} {...getBind(IDS.PROJECT_ITEM(i), "break-inside-avoid")}>
            <div className="flex justify-between items-baseline">
              <span {...getBind(IDS.PROJECT_NAME(i), "font-bold text-[14px] text-gray-900")}>{p.projectName}</span>
              <span className="text-xs text-gray-500">{p.startDate} — {p.endDate}</span>
            </div>
            <div {...getBind(IDS.PROJECT_TECH(i), "text-xs italic text-blue-600 font-medium")}>{p.technologiesUsed}</div>
            <p {...getBind(IDS.PROJECT_DESC(i), "text-[12px] mt-1 text-gray-600")}>{p.projectDescription}</p>
          </div>
        ))}
      </div>
    </section>
  );

  const CertsBlock = visibility.certifications !== false && (
    <section {...getBind(IDS.CERTIFICATIONS, "mb-4")}>
      <h3 {...getBind("CERT_H3", "text-sm font-bold uppercase mb-2 border-b border-gray-300 pb-1")}>
        {getSectionTitle("certifications", "Certifications")}
      </h3>
      <div className="flex flex-wrap gap-2">
        {certifications.map((c, i) => (
          <span key={i} {...getBind(IDS.CERT_ITEM(i), "text-[11px] px-2 py-1 bg-gray-100 border border-gray-200 rounded text-gray-800")}>
            {c.certificationName}
          </span>
        ))}
      </div>
    </section>
  );

  const SkillsBlock = (
    <section {...getBind(IDS.SIDEBAR_LEFT, "mb-4")}>
      <h3 {...getBind("SKILLS_H3", "text-sm font-bold uppercase mb-2 border-b border-gray-300 pb-1")}>
        {getSectionTitle("skillsSummary", "Skills")}
      </h3>
      <div className="text-[12px] space-y-2 text-gray-700">
        {skillsSummary.technicalSkills && (
           <div><span className="font-bold">Technical:</span> {skillsSummary.technicalSkills}</div>
        )}
        {skillsSummary.tools && (
           <div><span className="font-bold">Tools:</span> {skillsSummary.tools}</div>
        )}
      </div>
    </section>
  );

  return (
    <div 
      className="flex flex-col items-center bg-gray-200 min-h-screen py-10 print:bg-white print:p-0"
      onClick={handleDeselect}
    >
      <div 
        ref={resumeRef}
        {...getBind(IDS.PAGE, "w-[794px] min-h-[1123px] h-auto bg-white p-12 flex flex-col font-sans relative shadow-2xl print:shadow-none print:m-0")}
      >
        {/* PAGE GUIDES */}
        <div className="print:hidden pointer-events-none absolute inset-0">
          {contentHeight > A4_HEIGHT_PX && (
            <div className="absolute left-0 w-full border-t border-dashed border-red-300 opacity-60" style={{ top: '297mm' }}>
              <span className="bg-red-400 text-white text-[8px] px-2 absolute right-0">PAGE 1 LIMIT</span>
            </div>
          )}
        </div>

        {/* HEADER - Updated to a cleaner, left-aligned professional style */}
        <header {...getBind(IDS.HEADER, "mb-6")}>
          <div {...getBind(IDS.FULL_NAME, "text-4xl font-black text-gray-900 leading-tight")}>
            {pi.fullName || "Your Name"}
          </div>
          <div {...getBind(IDS.CONTACT, "text-sm flex flex-wrap gap-x-4 gap-y-1 mt-2 text-gray-600 font-medium")}>
            {pi.email && <span {...getBind(IDS.EMAIL)}>{pi.email}</span>}
            {pi.phoneNumber && <span {...getBind(IDS.PHONE_NUMBER)}>{pi.phoneNumber}</span>}
            {pi.address && <span {...getBind(IDS.ADDRESS)}>{pi.address}</span>}
            {pi.linkedin && <span>LinkedIn</span>}
          </div>
        </header>

        {SummaryBlock}

        <div className={gridClass}>
          {/* Layout logic: if tertiary, we use a sidebar */}
          {layoutKey === "tertiary" ? (
            <div className="grid grid-cols-3 gap-8">
              <aside className="col-span-1 space-y-2">
                {SkillsBlock}
                {EducationBlock}
                {CertsBlock}
              </aside>
              <main className="col-span-2 space-y-2">
                {ExperienceBlock}
                {ProjectsBlock}
              </main>
            </div>
          ) : (
            <main className="space-y-4">
              {ExperienceBlock}
              {ProjectsBlock}
              {EducationBlock}
              {CertsBlock}
              {SkillsBlock}
            </main>
          )}
        </div>
      </div>
    </div>
  );
}