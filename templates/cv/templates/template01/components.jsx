import { getSectionTitle, renderRichText, Visible } from "@resumetemplates/utils";


const SectionHeader = ({ sectionTitles, designConfig, sectionKey, titleId, getBind, defaultTitle, decorator }) => (
      <Visible designConfig={designConfig} id={sectionKey}>
        <div {...getBind(sectionKey, "flex items-center gap-4 w-full")}>
          <Visible designConfig={designConfig} id={titleId}>
            <h3 
              {...getBind(titleId, 
                "text-[14px] font-black uppercase tracking-wider text-[var(--color-button-primary-bg)] whitespace-nowrap"
              )}>
              {getSectionTitle(sectionTitles,sectionKey, defaultTitle)}
            </h3>
          </Visible>
          <Visible designConfig={designConfig} id={decorator}>
            <hr 
              {...getBind(decorator, 
                "flex-grow border-t-2 border-[var(--color-button-primary-bg)] opacity-30 cursor-pointer" 
              )} 
            />
          </Visible>
        </div>
      </Visible>
);

export const CareerSummarySection = ({ careerSummary, IDS, getBind, designConfig,sectionTitles }) => {
  
    if (designConfig.visibility?.careerSummary === false) return null;
return (
    <section {...getBind(IDS.CAREER_SUMMARY, "mb-3 break-inside-avoid")}>
      <SectionHeader designConfig={designConfig} sectionTitles={sectionTitles} getBind={getBind} sectionKey="careerSummary"  titleId={IDS.CAREER_SUMMARY_TITLE}  decorator={IDS.CAREER_SUMMARY_DECORATOR} defaultTitle="Professional Summary" />
      <Visible designConfig={designConfig} id={IDS.CAREER_SUMMARY_CONTENT}>
        <div 
          {...getBind(IDS.CAREER_SUMMARY_CONTENT, "text-[11px] leading-relaxed text-justify text-[var(--color-text-secondary)]")}
        >
          {renderRichText(careerSummary.summary) || ""}
        </div>
      </Visible>
    </section>
)};

export const ExperienceSection = ({ workExperience, IDS, getBind, designConfig,sectionTitles }) => {

    if (designConfig.visibility?.workExperience === false) return null;
return(
    <section {...getBind(IDS.EXPERIENCE, "mb-3")}>
      <SectionHeader designConfig={designConfig} sectionTitles={sectionTitles} getBind={getBind}
        sectionKey="workExperience" 
        titleId={IDS.EXPERIENCE_TITLE} 
        decorator={IDS.EXPERIENCE_DECORATOR}
        defaultTitle="Experience" 
      />

      <div className="space-y-1">
        {workExperience.map((job, i) => (
          <Visible designConfig={designConfig} id={IDS.JOB_ITEM(i)} key={i}>
            <div {...getBind(IDS.JOB_ITEM(i), "break-inside-avoid group")}>
              <Visible designConfig={designConfig} id={IDS.JOB_HEADER(i)}>
                <div {...getBind(IDS.JOB_HEADER(i), "flex justify-between items-baseline ")}>
                  <span>
                    <Visible designConfig={designConfig} id={IDS.JOB_COMPANY(i)}>
                      <span {...getBind(IDS.JOB_COMPANY(i), "text-[var(--color-button-primary-bg)] text-[10px] font-bold italic mb-2")}>
                        {renderRichText(job.companyName)}{","}
                      </span>
                    </Visible>
                    <Visible designConfig={designConfig} id={IDS.JOB_TITLE(i)}>
                      <span {...getBind(IDS.JOB_TITLE(i), "font-bold text-[11px] text-[var(--color-text-primary)]")}>
                        {" "}{renderRichText(job.jobTitle)}
                      </span>
                    </Visible>
                  </span>
                  <Visible designConfig={designConfig} id={IDS.JOB_DATES(i)}>
                    <span {...getBind(IDS.JOB_DATES(i), "text-[9px] font-semibold text-[var(--color-text-placeholder)]")}>
                      {renderRichText(job.startDate)} — {renderRichText(job.endDate) === "null" || !renderRichText(job.endDate) ? "Present" : renderRichText(job.endDate)}
                    </span>
                  </Visible>
                </div>
              </Visible>

{job.responsibilities?.includes('<li') ? (
  <Visible designConfig={designConfig} id={IDS.JOB_DESC_POINT(i, 0)}>
    <div
      {...getBind(
        IDS.JOB_DESC_POINT(i, 0),
        "text-[10px] text-[var(--color-text-secondary)] leading-relaxed text-justify"
      )}
    >
      {renderRichText(job.responsibilities)}
    </div>
  </Visible>
) : (
  <ul className="space-y-1">
    {job.responsibilities
      ?.split('\n')
      .filter(line => line.trim() !== "")
      .map((line, idx) => (
        <Visible designConfig={designConfig} id={IDS.JOB_DESC_POINT(i, idx)} key={idx}>
          <li
            {...getBind(
              IDS.JOB_DESC_POINT(i, idx),
              "text-[10px] text-[var(--color-text-secondary)] leading-relaxed text-justify relative before:absolute before:left-0 before:text-[var(--color-button-primary-bg)]"
            )}
          >
            {renderRichText(line)}
          </li>
        </Visible>
      ))}
  </ul>
)}
            </div>
          </Visible>
        ))}
      </div>
    </section>
)};

export const ProjectsSection = ({ projects, IDS, getBind, designConfig,sectionTitles }) => {
    if (designConfig.visibility?.projects === false) return null;

    return (
        <section {...getBind(IDS.PROJECTS, "mb-3")}>
            <SectionHeader designConfig={designConfig} sectionTitles={sectionTitles} getBind={getBind}
                sectionKey="projects" 
                titleId={IDS.PROJECTS_TITLE} 
        decorator={IDS.PROJECTS_DECORATOR}
        defaultTitle="Projects" 
      />
      <div className="space-y-5">
        {projects.map((proj, i) => (
          <Visible designConfig={designConfig} id={IDS.PROJECT_ITEM(i)} key={i}>
            <div {...getBind(IDS.PROJECT_ITEM(i), "break-inside-avoid")}>
              <Visible designConfig={designConfig} id={IDS.PROJECT_HEADER(i)}>
                <div {...getBind(IDS.PROJECT_HEADER(i), "flex justify-between items-baseline mb-1")}>
                  <Visible designConfig={designConfig} id={IDS.PROJECT_NAME(i)}>
                    <span {...getBind(IDS.PROJECT_NAME(i), "font-bold text-[11px] text-[var(--color-text-primary)]")}>
                      {renderRichText(proj.projectName)}
                    </span>
                  </Visible>
                  <Visible designConfig={designConfig} id={IDS.PROJECT_TECH(i)}>
                    <span {...getBind(IDS.PROJECT_TECH(i), "text-[9px] font-normal italic text-[var(--color-text-placeholder)]")}>
                      {renderRichText(proj.technologiesUsed)}
                    </span>
                  </Visible>
                </div>
              </Visible>
                {proj.projectDescription?.includes('<li') ? (
                <Visible designConfig={designConfig} id={IDS.PROJECT_DESC_POINT(i, 0)}>
                    <div
                    {...getBind(
                        IDS.PROJECT_DESC_POINT(i, 0),
                        "text-[10px] text-[var(--color-text-secondary)] leading-relaxed text-justify"
                    )}
                    >
                    {renderRichText(proj.projectDescription)}
                    </div>
                </Visible>
                ) : (
                <ul className="space-y-1">
                    {proj.projectDescription
                    ?.split('\n')
                    .filter(line => line.trim() !== "")
                    .map((line, idx) => (
                        <Visible designConfig={designConfig} id={IDS.PROJECT_DESC_POINT(i, idx)} key={idx}>
                        <li
                            {...getBind(
                            IDS.PROJECT_DESC_POINT(i, idx),
                            "text-[10px] text-[var(--color-text-secondary)] leading-relaxed text-justify relative before:absolute before:left-0 before:text-[var(--color-button-primary-bg)]"
                            )}
                        >
                            {renderRichText(line)}
                        </li>
                        </Visible>
                    ))}
                </ul>
                )}
                    
            </div>
          </Visible>
        ))}
      </div>
    </section>
    )
};

export const EducationSection = ({ educationHistory, IDS, getBind, designConfig,sectionTitles }) => {
    if (designConfig.visibility?.educationHistory === false) return null;

    return (
        <section {...getBind(IDS.EDUCATION, "mb-3 break-inside-avoid")}>
            <SectionHeader designConfig={designConfig} sectionTitles={sectionTitles} getBind={getBind}
                sectionKey="educationHistory" 
        titleId={IDS.EDUCATION_TITLE} 
        decorator={IDS.EDUCATION_DECORATOR}
        defaultTitle="Education" 
      />
      <div className="space-y-4">
        {educationHistory.map((edu, i) => (
          <Visible designConfig={designConfig} id={IDS.EDU_ITEM(i)} key={i}>
            <div {...getBind(IDS.EDU_ITEM(i))}>
              <Visible designConfig={designConfig} id={IDS.EDU_SCHOOL(i)}>
                <div {...getBind(IDS.EDU_SCHOOL(i), "font-bold text-[10px] uppercase text-[var(--color-text-primary)]")}>
                  {renderRichText(edu.university)}
                </div>
              </Visible>
              <Visible designConfig={designConfig} id={IDS.EDU_DEGREE(i)}>
                <div {...getBind(IDS.EDU_DEGREE(i), "text-[10px] text-[var(--color-button-primary-bg)] font-medium")}>
                  {renderRichText(edu.degree)}
                </div>
              </Visible>
              <Visible designConfig={designConfig} id={IDS.EDU_DATES(i)}>
                <div {...getBind(IDS.EDU_DATES(i), "text-[9px] text-[var(--color-text-placeholder)] font-medium")}>
                  {renderRichText(edu.startDate)} — {renderRichText(edu.endDate)}
                </div>
              </Visible>
            </div>
          </Visible>
        ))}
      </div>
    </section>
)};

export const SkillsSection = ({ skillsSummary, IDS, getBind, designConfig,sectionTitles }) => {
    if (designConfig.visibility?.skillsSummary === false) return null;

    return (
        <section {...getBind(IDS.SKILLS_SUMMARY, "mb-3 break-inside-avoid")}>
            <SectionHeader designConfig={designConfig} sectionTitles={sectionTitles} getBind={getBind}
                sectionKey="skillsSummary" 
        titleId={IDS.SKILLS_SUMMARY_TITLE} 
        decorator={IDS.SKILLS_SUMMARY_DECORATOR}
        defaultTitle="Expertise" 
      />
      <div className="text-[10px] leading-relaxed text-[var(--color-text-secondary)] space-y-2.5">
        <Visible designConfig={designConfig} id={IDS.TECHNICAL_SKILLS}>
          <div {...getBind(IDS.TECHNICAL_SKILLS)}>
            <span className="font-bold text-[var(--color-text-primary)]">Technical: </span>
            {renderRichText(skillsSummary.technicalSkills)}
          </div>
        </Visible>
        <Visible designConfig={designConfig} id={IDS.TOOLS}>
          <div {...getBind(IDS.TOOLS)}>
            <span className="font-bold text-[var(--color-text-primary)]">Tools: </span>
            {renderRichText(skillsSummary.tools)}
          </div>
        </Visible>
        <Visible designConfig={designConfig} id={IDS.SOFT_SKILLS}>
          <div {...getBind(IDS.SOFT_SKILLS)}>
            <span className="font-bold text-[var(--color-text-primary)]">Soft Skills: </span>
            {renderRichText(skillsSummary.softSkills)}
          </div>
        </Visible>
      </div>
    </section>
)};

export const CertificationsSection = ({ certifications, IDS, getBind, designConfig,sectionTitles }) => {
    if (designConfig.visibility?.certifications === false) return null;

    return (
        <section {...getBind(IDS.CERTIFICATIONS, "mb-3 break-inside-avoid")}>
            <SectionHeader designConfig={designConfig} sectionTitles={sectionTitles} getBind={getBind}
                sectionKey="certifications" 
        titleId={IDS.CERTIFICATIONS_TITLE} 
        decorator={IDS.CERTIFICATIONS_DECORATOR}
        defaultTitle="Certifications" 
      />
      <ul className="space-y-1.5 text-[10px] text-[var(--color-text-secondary)]">
        {certifications.map((cert, i) => (
          <Visible designConfig={designConfig} id={IDS.CERT_ITEM(i)} key={i}>
            <li {...getBind(IDS.CERT_ITEM(i), "flex gap-2 items-start")}>
              <Visible designConfig={designConfig} id={IDS.CERT_NAME(i)}>
                <span {...getBind(IDS.CERT_NAME(i))}>{renderRichText(cert.certificationName)}</span>
              </Visible>
            </li>
          </Visible>
        ))}
      </ul>
    </section>
)};
