'use client';

import { useCoverletterLogic } from '@coverlettertemplates/utils/usecoverletterlogic';
import { COVERLETTER_IDS01 as IDS, layoutGrid01 } from './index';
import { renderRichText } from '@coverlettertemplates/utils';

export default function Template01() {
  const logic = useCoverletterLogic(IDS, layoutGrid01);
  if (logic.loading) return null;
  
  const { 
    getBind, 
    handleDeselect, 
    coverletterRef, 
    contentHeight,
    personalInformation: pi,
    recipientInformation: ri,
    letterMeta: meta,
    letterContent: content,
    letterBodyParagraphs: bodyParagraphs,
    signOff: so
  } = logic;
    
  // A4 standard is ~1122px, we use a slightly smaller trigger for the UI indicator
  const A4_HEIGHT_PX = 1120; 

  return (
    <div className="flex flex-col items-center bg-[var(--color-background-tertiary)] min-h-screen print:bg-white print:p-0" onClick={handleDeselect}>
      <div 
        ref={coverletterRef}
        {...getBind(IDS.PAGE, "w-[210mm] h-fit min-h-[296mm] bg-white p-[20mm] flex flex-col font-sans relative shadow-2xl print:shadow-none print:m-0 overflow-hidden")}
      >
        
        {/* PAGE LIMIT INDICATOR -  is vital here */}
        <div className=" pointer-events-none absolute inset-0 z-0">
          {[1, 2].map((page) => (
            contentHeight > (A4_HEIGHT_PX * page) && (
              <div 
                key={page}
                className="absolute left-0 w-full border-t-2 border-dashed border-red-300 opacity-60" 
                style={{ top: `${(297 * page) - 1}mm` }}
              >
                <span className="bg-red-400 text-white text-[10px] px-2 absolute -top-2.5 right-10 font-bold uppercase">
                  Page {page} Limit
                </span>
              </div>
            )
          ))}
        </div>

        {/* 1. SENDER HEADER */}
        <header {...getBind(IDS.HEADER, "mb-10 border-b-2 pb-6 border-slate-900 cursor-pointer group shrink-0")}>
          <h1 {...getBind(IDS.SENDER_NAME, "text-4xl font-black uppercase tracking-tighter text-slate-900 group-hover:text-blue-600 transition-colors break-words")}>
            {pi?.name || "JONATHAN DOE"}
          </h1>
          <div className="flex flex-wrap gap-x-6 gap-y-1 mt-3 text-sm font-medium text-slate-600">
            <span {...getBind(IDS.SENDER_EMAIL)} className="hover:text-blue-500 break-all">{pi?.email || "j.doe@example.com"}</span>
            <span {...getBind(IDS.SENDER_PHONE)} className="hover:text-blue-500">{pi?.phone || "+1 123-456-7890"}</span>
            <span {...getBind(IDS.SENDER_ADDRESS)} className="hover:text-blue-500">{pi?.address || "Aurora, IL"}</span>
          </div>
        </header>

        {/* 2. RECIPIENT & DATE BLOCK */}
        <section {...getBind(IDS.RECIPIENT_BLOCK, "mb-10 space-y-1 text-sm text-slate-800 cursor-pointer hover:bg-slate-50 p-2 -m-2 rounded transition-colors shrink-0")}>
          <div {...getBind(IDS.DATE, "mb-6 text-slate-500 font-bold tracking-widest")}>
            {meta?.date || "February 05, 2026"}
          </div>
          <p {...getBind(IDS.RECIPIENT_NAME, "font-bold text-base break-words")}>{ri?.managerName || "Hiring Manager"}</p>
          <p {...getBind(IDS.RECIPIENT_COMPANY, "uppercase font-semibold break-words")}>{ri?.companyName || "TechCorp Solutions"}</p>
          <p {...getBind(IDS.RECIPIENT_ADDRESS, "break-words")}>{ri?.companyAddress || "456 Enterprise Dr, Chicago, IL 60601"}</p>
        </section>

        {/* 3. SUBJECT BLOCK */}
        <div {...getBind(IDS.SUBJECT_BLOCK, "mb-8 cursor-pointer hover:bg-slate-50 p-2 -m-2 rounded transition-colors shrink-0")}>
          <h2 {...getBind(IDS.SUBJECT, "font-bold text-lg text-slate-900 uppercase underline decoration-2 underline-offset-4 break-words")}>
            {meta?.subjectLine || "Application for Position"}
          </h2>
          {meta?.referenceNumber && (
            <span {...getBind(IDS.REF_NUMBER, "text-xs font-mono text-slate-500 block mt-2")}>
              Ref: {meta.referenceNumber}
            </span>
          )}
        </div>

        {/* 4. CONTENT SECTION - No flex-grow, natural flow only */}
        <article className="text-[11pt] leading-relaxed text-slate-700 space-y-6 break-words overflow-wrap-anywhere min-w-0">
          <p {...getBind(IDS.SALUTATION, "font-bold text-slate-900 cursor-pointer hover:text-blue-600")}>
            {content?.salutation || "Dear Hiring Manager,"}
          </p>
          
          <div {...getBind(IDS.INTRO, "cursor-pointer hover:bg-slate-50 p-1 rounded")}>
            {renderRichText(content?.intro || "I am writing to express my interest...")}
          </div>

          <div {...getBind(IDS.BODY_WRAPPER, "space-y-4")}>
            {bodyParagraphs?.map((para, i) => (
              <div key={i} {...getBind(IDS.BODY_PARA(i), "cursor-pointer hover:bg-slate-50 p-1 rounded border-l-2 border-transparent hover:border-blue-400 transition-all")}>
                {renderRichText(para?.bodyParagraph)}
              </div>
            )) || <p>Details about my experience...</p>}
          </div>

          {/* SIGN OFF INTEGRATED INTO ARTICLE FLOW */}
          <div {...getBind(IDS.CONCLUSION, "cursor-pointer hover:bg-slate-50 rounded mt-6 mb-6")}>
            {renderRichText(content?.conclusion || "Thank you for your consideration.")}
          </div>
          
          <div className="space-y-1">
            <p {...getBind(IDS.CLOSE, "text-slate-600")}>
                {so?.complimentaryClose || "Sincerely,"}
            </p>
            <p {...getBind(IDS.SIGNATURE, "font-bold text-slate-900 tracking-tight")}>
                {so?.signatureName || pi?.name || "Jonathan Doe"}
            </p>
          </div>
        </article>

      </div>
    </div>
  );
}