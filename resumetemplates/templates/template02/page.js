"use client";

import { shallowEqual, useSelector } from "react-redux";
import { RESUME_IDS02 as IDS } from "./index";
import { useTemplateEditor } from "@resumetemplates/templates/usetemplateeditor";
import { layoutGrid02 } from "./index";

export default function Template02({ selectedContainer, setSelectedContainer }) {
  const { formDataMap } = useSelector((state) => state.resumeEditor, shallowEqual);
  const { register } = useTemplateEditor(
    formDataMap?.designConfig,
    selectedContainer,
    setSelectedContainer
  );

  if (!formDataMap) return null;

  const {
    personalInformation: pi = {},
    workExperience: work = [],
    onlineProfiles: op={},
    addressDetails: addrs={},
    sectionTitles: st=[],
    educationHistory: edu = [],
    projects: proj = [],
    certifications: certs = [],
    skillsSummary: skills = {},
    careerSummary: summary = {},
    designConfig = {},
  } = formDataMap;

     
  
  

  const layout = designConfig?.layout || "primary";
  const layoutGrid01Class = layoutGrid01[layout] || "grid grid-cols-1";

  const getStyle = (id, defaultColor = "#1a1a1a") => {
    const registered = register(id);
    return {
      color: defaultColor,
      ...registered.style,
    };
  };

  return (
    <div
      {...register(IDS.PAGE)}
      className={`w-[794px] min-h-[1123px] p-4 bg-amber-950 font-sans overflow-hidden ${register(IDS.PAGE).className}`}
      style={{ backgroundColor: "#ffffff", ...getStyle(IDS.PAGE, "#000000") }}
    >
      {/* HEADER */}
      <header {...register(IDS.HEADER)} className={`p-3 ${register(IDS.HEADER).className}`} style={getStyle(IDS.HEADER)}>
        <span
          {...register(IDS.FULL_NAME)}
          className={`text-4xl font-bold inline-block leading-none ${register(IDS.FULL_NAME).className}`}
          style={getStyle(IDS.FULL_NAME, "#000000")}
        >
          {pi.fullName || "Your Name"}
        </span>
        <div
          {...register(IDS.CONTACT)}
          className={`text-sm flex flex-wrap gap-2 mt-1 ${register(IDS.CONTACT).className}`}
          style={getStyle(IDS.CONTACT, "#4b5563")}
        >
          {pi.email && <span {...register(IDS.EMAIL)}>{pi.email}</span>}
          {pi.phoneNumber && <span {...register(IDS.PHONE_NUMBER)}>{pi.phoneNumber}</span>}
          {pi.address && <span {...register(IDS.ADDRESS)}>{pi.address}</span>}
          {pi.dateOfBirth && <span {...register(IDS.DATE_OF_BIRTH)}>DOB: {pi.dateOfBirth}</span>}
          {pi.gender && <span {...register(IDS.GENDER)}>Gender: {pi.gender}</span>}
          {pi.nationality && <span {...register(IDS.NATIONALITY)}>Nationality: {pi.nationality}</span>}
        </div>
      </header>

      {/* CAREER SUMMARY */}
      {summary.summary && (
        <p
          {...register(IDS.CAREER_SUMMARY)}
          className={`text-[13px] p-2 leading-snug ${register(IDS.CAREER_SUMMARY).className}`}
          style={getStyle(IDS.CAREER_SUMMARY, "#374151")}
        >
          {summary.summary}
        </p>
      )}

      <div className={layoutGrid01Class}>
        {/* SIDEBAR */}
        {layout === "tertiary" && (
          <aside
            {...register(IDS.SIDEBAR_LEFT)}
            className={`col-span-1 pr-6 border-r border-gray-200 p-2 ${register(IDS.SIDEBAR_LEFT).className}`}
            style={getStyle(IDS.SIDEBAR_LEFT)}
          >
            <h3 className="text-xs font-bold uppercase mb-2" style={getStyle("SKILLS_H3", "#000000")}>
              Skills
            </h3>
            <div className="text-[12px] whitespace-pre-line" style={getStyle("SKILLS_TEXT", "#374151")}>
              {skills.technicalSkills}
            </div>
          </aside>
        )}

        {/* MAIN */}
        <main className="col-span-2">
          {/* EXPERIENCE */}
          <section {...register(IDS.EXPERIENCE)} className={`p-2 ${register(IDS.EXPERIENCE).className}`} style={getStyle(IDS.EXPERIENCE)}>
            <h3 className="text-sm font-bold uppercase mb-2 border-b border-gray-300 pb-1" style={getStyle("EXP_H3", "#000000")}>
              Experience
            </h3>
            <div className="space-y-3">
              {work.map((j, i) => (
                <div key={i} {...register(IDS.JOB_ITEM(i))} className={register(IDS.JOB_ITEM(i)).className} style={getStyle(IDS.JOB_ITEM(i))}>
                  <div className="flex justify-between leading-tight">
                    <span {...register(IDS.JOB_TITLE(i))} className={`font-bold text-[14px] ${register(IDS.JOB_TITLE(i)).className}`} style={getStyle(IDS.JOB_TITLE(i), "#000000")}>
                      {j.jobTitle || "Job Title"}
                    </span>
                    <span {...register(IDS.JOB_DATES(i))} className={`text-xs ${register(IDS.JOB_DATES(i)).className}`} style={getStyle(IDS.JOB_DATES(i), "#6b7280")}>
                      {j.startDate || "Start"} - {j.endDate || "Present"}
                    </span>
                  </div>
                  <div {...register(IDS.JOB_COMPANY(i))} className={`text-[13px] font-medium mt-0.5 ${register(IDS.JOB_COMPANY(i)).className}`} style={getStyle(IDS.JOB_COMPANY(i), "#1d4ed8")}>
                    {j.companyName || "Company Name"} {j.location && `, ${j.location}`}
                  </div>
                  <p {...register(IDS.JOB_DESC(i))} className={`text-[12px] leading-relaxed mt-1 ${register(IDS.JOB_DESC(i)).className}`} style={getStyle(IDS.JOB_DESC(i), "#374151")}>
                    {j.responsibilities || "Responsibilities"}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* PROJECTS */}
          <section {...register(IDS.PROJECTS)} className={`p-2 ${register(IDS.PROJECTS).className}`} style={getStyle(IDS.PROJECTS)}>
            <h3 className="text-sm font-bold uppercase mb-2 border-b border-gray-300 pb-1" style={getStyle("PROJ_H3", "#000000")}>
              Projects
            </h3>
            <div className="space-y-3">
              {proj.map((p, i) => (
                <div key={i} {...register(IDS.PROJECT_ITEM(i))} className={register(IDS.PROJECT_ITEM(i)).className} style={getStyle(IDS.PROJECT_ITEM(i))}>
                  <div className="flex justify-between leading-tight">
                    <span {...register(IDS.PROJECT_NAME(i))} className={`font-bold text-[14px] ${register(IDS.PROJECT_NAME(i)).className}`} style={getStyle(IDS.PROJECT_NAME(i), "#000000")}>
                      {p.projectName || "Project Name"}
                    </span>
                    <span {...register(IDS.PROJECT_START(i))}>{p.startDate}</span> - <span {...register(IDS.PROJECT_END(i))}>{p.endDate}</span>
                  </div>
                  <div {...register(IDS.PROJECT_TECH(i))} className={`text-xs italic mt-0.5 ${register(IDS.PROJECT_TECH(i)).className}`} style={getStyle(IDS.PROJECT_TECH(i), "#2563eb")}>
                    {p.technologiesUsed}
                  </div>
                  <p {...register(IDS.PROJECT_DESC(i))} className={`text-[12px] mt-1 ${register(IDS.PROJECT_DESC(i)).className}`} style={getStyle(IDS.PROJECT_DESC(i), "#374151")}>
                    {p.projectDescription}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* EDUCATION */}
          <section {...register(IDS.EDUCATION)} className={`p-2 ${register(IDS.EDUCATION).className}`} style={getStyle(IDS.EDUCATION)}>
            <h3 className="text-sm font-bold uppercase border-b border-gray-300 pb-1" style={getStyle("EDU_H3", "#000000")}>
              Education
            </h3>
            <div className="space-y-3">
              {edu.map((e, i) => (
                <div key={i} {...register(IDS.EDU_ITEM(i))} className={register(IDS.EDU_ITEM(i)).className} style={getStyle(IDS.EDU_ITEM(i))}>
                  <div className="flex justify-between leading-tight">
                    <span {...register(IDS.EDU_DEGREE(i))} className={`font-bold text-[14px] ${register(IDS.EDU_DEGREE(i)).className}`} style={getStyle(IDS.EDU_DEGREE(i), "#000000")}>
                      {e.degree} in {e.major}
                    </span>
                    <span {...register(IDS.EDU_START(i))}>{e.startDate}</span> - <span {...register(IDS.EDU_END(i))}>{e.endDate}</span>
                  </div>
                  <div className="flex justify-between text-xs mt-1">
                    <span {...register(IDS.EDU_SCHOOL(i))} className={register(IDS.EDU_SCHOOL(i)).className} style={getStyle(IDS.EDU_SCHOOL(i), "#4b5563")}>
                      {e.university} {e.location && `, ${e.location}`}
                    </span>
                    <span {...register(IDS.EDU_GPA(i))} className={`font-medium ${register(IDS.EDU_GPA(i)).className}`} style={getStyle(IDS.EDU_GPA(i), "#4b5563")}>
                      GPA: {e.gpa}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* CERTIFICATIONS */}
          <section {...register(IDS.CERTIFICATIONS)} className={`p-2 ${register(IDS.CERTIFICATIONS).className}`} style={getStyle(IDS.CERTIFICATIONS)}>
            <h3 className="text-sm font-bold uppercase mb-2 border-b border-gray-300 pb-1" style={getStyle("CERT_H3", "#000000")}>
              Certifications
            </h3>
            <div className="flex flex-wrap gap-2">
              {certs.map((c, i) => (
                <span key={i} {...register(IDS.CERT_ITEM(i))} className={`text-[11px] px-2 py-1 border border-gray-200 rounded ${register(IDS.CERT_ITEM(i)).className}`} style={{ backgroundColor: "#f9fafb", ...getStyle(IDS.CERT_ITEM(i), "#1f2937") }}>
                  {c.certificationName}
                </span>
              ))}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
