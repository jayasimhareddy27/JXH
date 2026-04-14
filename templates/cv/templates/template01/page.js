'use client';

import React from 'react';
import { useResumeLogic } from '@resumetemplates/utils/useresumelogic';
import { RESUME_IDS01 as IDS, layoutGrid01 } from './index';
import { renderRichText, Visible } from '@resumetemplates/utils';
import {   CareerSummarySection,   ExperienceSection,   ProjectsSection,   EducationSection,   CertificationsSection,   SkillsSection } from './components';

export default function Template01() {
  const logic = useResumeLogic(IDS, layoutGrid01);
  if (logic.loading) return null;

  const { getBind, handleDeselect, resumeRef, contentHeight, layoutKey, gridClass, designConfig
    , personalInformation: pi, sectionTitles } = logic;

  const A4_HEIGHT_PX = 1122;
  const sharedProps = { IDS, getBind, designConfig, sectionTitles };

  const getMainColSpan = () => {
    const spans = { secondary: "col-span-2", tertiary: "col-span-3", quaternary: "col-span-4" };
    return spans[layoutKey] || "col-span-1";
  };

  const getSidebarColSpan = () => (layoutKey === 'quaternary' ? "col-span-2" : "col-span-1");

  return (
    <div className="flex flex-col items-center bg-[var(--color-background-tertiary)] min-h-screen print:bg-white print:p-0" onClick={handleDeselect}>
      <div 
        ref={resumeRef} id='header'
        {...getBind(IDS.PAGE,   "w-[210mm] min-h-[297mm] bg-white p-[15mm] flex flex-col font-sans relative shadow-2xl print:shadow-none print:m-0 print:p-10  ")}
>
        {/* PAGE LIMIT INDICATOR */}
        <div className="print:hidden pointer-events-none absolute inset-0 z-10">
          {contentHeight > A4_HEIGHT_PX && (
            <div 
              className="absolute left-0 w-full border-t border-dashed border-red-300 opacity-60" 
              style={{ top: '297mm' }}
            >
              <span className="bg-red-400 text-white text-[8px] px-2 absolute -top-2 right-4 font-medium uppercase tracking-wider">
                Page 1 Limit
              </span>
            </div>
          )}
        </div>

        {/* HEADER SECTION */}
        <header {...getBind(IDS.HEADER, "mb-6 text-center break-inside-avoid")} >
          <Visible id={IDS.FULL_NAME} designConfig={designConfig}>
            <div {...getBind(IDS.FULL_NAME, "text-4xl font-black mb-1 uppercase tracking-tighter text-[var(--color-text-primary)]")}>
              {renderRichText(pi.fullName || "Your Name")}
            </div>
          </Visible>

          <Visible id={IDS.CONTACT_INFO} designConfig={designConfig}>
            <div className="flex justify-center items-center gap-6 text-[10px] font-bold uppercase tracking-widest text-[var(--color-text-secondary)]">
              <Visible id={IDS.EMAIL} designConfig={designConfig}>
                <div {...getBind(IDS.EMAIL, "text-xxs ")}>
                  <span>{renderRichText(pi.email)}</span>
                </div>
              </Visible>
              <Visible id={IDS.PHONE_NUMBER} designConfig={designConfig}>
                <div {...getBind(IDS.PHONE_NUMBER, "text-xxs ")}>
                  <span>{renderRichText(pi.phoneNumber)}</span>
                </div>
              </Visible>
              <Visible id={IDS.ADDRESS} designConfig={designConfig}>
                <div {...getBind(IDS.ADDRESS, "text-xxs ")}>
                <span>{renderRichText(pi.address || "")}</span>
                </div>
              </Visible>
            </div>
          </Visible>
        </header>

        {/* CONTENT GRID */}
        <div className={`${gridClass} space-y-5`}>
          {/* MAIN COLUMN */}
          <div className={`${getMainColSpan()} space-y-5`}>
            <CareerSummarySection careerSummary={logic.careerSummary} {...sharedProps} />
            <ExperienceSection workExperience={logic.workExperience} {...sharedProps} />
            <ProjectsSection projects={logic.projects} {...sharedProps} />
            
            {/* If Single Column Layout, render everything here */}
            {layoutKey === 'primary' && (
              <div className="space-y-5">
                <EducationSection educationHistory={logic.educationHistory} {...sharedProps} />
                <CertificationsSection certifications={logic.certifications} {...sharedProps} />
                <SkillsSection skillsSummary={logic.skillsSummary} {...sharedProps} />
              </div>
            )}
          </div>

          {/* SIDEBAR COLUMN (Only for Multi-Column Layouts) */}
          {layoutKey !== 'primary' && (
            <aside className={`${getSidebarColSpan()} border-l-2 border-[var(--color-border-secondary)] pl-8 space-y-6`}>
              <EducationSection educationHistory={logic.educationHistory} {...sharedProps} />
              <CertificationsSection certifications={logic.certifications} {...sharedProps} />
              <SkillsSection skillsSummary={logic.skillsSummary} {...sharedProps} />
            </aside>
          )}
        </div>
      </div>
    </div>
  );
}