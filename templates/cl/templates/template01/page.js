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
    signOff: so
  } = logic;
    
  const A4_HEIGHT_PX = 1122; // Height of one A4 page in pixels

  return (
    <div className="flex flex-col items-center bg-[var(--color-background-tertiary)] min-h-screen py-10 print:bg-white print:p-0 print:py-0" onClick={handleDeselect}>
      <div 
        ref={coverletterRef}
        {...getBind(IDS.PAGE, "w-[210mm] h-auto min-h-[297mm] bg-white p-[20mm] flex flex-col font-sans relative shadow-2xl print:shadow-none print:m-0")}
      >
        
        {/* PAGE 1 LIMIT INDICATOR (Repeats for page 2 if needed) */}
        <div className="print:hidden pointer-events-none absolute inset-0 z-10">
          {[1, 2].map((page) => (
            contentHeight > (A4_HEIGHT_PX * page) && (
              <div 
                key={page}
                className="absolute left-0 w-full border-t-2 border-dashed border-red-300 opacity-60" 
                style={{ top: `${297 * page}mm` }}
              >
                <span className="bg-red-400 text-white text-[10px] px-2 absolute -top-2.5 right-10 font-bold uppercase">
                  Page {page} Limit
                </span>
              </div>
            )
          ))}
        </div>

        {/* 1. SENDER HEADER */}
        <header {...getBind(IDS.HEADER, "mb-10 border-b-2 pb-6 border-slate-900 cursor-pointer group")}>
          <h1 {...getBind(IDS.SENDER_NAME, "text-4xl font-black uppercase tracking-tighter text-slate-900 group-hover:text-blue-600 transition-colors")}>
            {pi?.name || "JONATHAN DOE"}
          </h1>
          <div className="flex flex-wrap gap-x-6 gap-y-1 mt-3 text-sm font-medium text-slate-600">
            <span {...getBind(IDS.SENDER_EMAIL)} className="hover:text-blue-500">{pi?.email || "j.doe@example.com"}</span>
            <span {...getBind(IDS.SENDER_PHONE)} className="hover:text-blue-500">{pi?.phone || "+1 123-456-7890"}</span>
            <span {...getBind(IDS.SENDER_ADDRESS)} className="hover:text-blue-500">{pi?.address || "Aurora, IL"}</span>
          </div>
        </header>

        {/* 2. RECIPIENT & DATE BLOCK */}
        <section {...getBind(IDS.RECIPIENT_BLOCK, "mb-10 space-y-1 text-sm text-slate-800 cursor-pointer hover:bg-slate-50 p-2 -m-2 rounded transition-colors")}>
          <div {...getBind(IDS.DATE, "mb-6 text-slate-500 font-bold tracking-widest")}>
            {meta?.date || "February 05, 2026"}
          </div>
          <p {...getBind(IDS.RECIPIENT_NAME, "font-bold text-base")}>{ri?.managerName || "Hiring Manager"}</p>
          <p {...getBind(IDS.RECIPIENT_COMPANY, "uppercase font-semibold")}>{ri?.companyName || "TechCorp Solutions"}</p>
          <p {...getBind(IDS.RECIPIENT_ADDRESS)}>{ri?.companyAddress || "456 Enterprise Dr, Chicago, IL 60601"}</p>
        </section>

        {/* 3. SUBJECT BLOCK */}
        <div {...getBind(IDS.SUBJECT_BLOCK, "mb-8 cursor-pointer hover:bg-slate-50 p-2 -m-2 rounded transition-colors")}>
          <h2 {...getBind(IDS.SUBJECT, "font-bold text-lg text-slate-900 uppercase underline decoration-2 underline-offset-4")}>
            {meta?.subjectLine || "Application for Position"}
          </h2>
          {meta?.referenceNumber && (
            <span {...getBind(IDS.REF_NUMBER, "text-xs font-mono text-slate-500 block mt-2")}>
              Ref: {meta.referenceNumber}
            </span>
          )}
        </div>

        {/* 4. CONTENT SECTION */}
        <article className="flex-grow text-[11pt] leading-relaxed text-slate-700 space-y-6">
          <p {...getBind(IDS.SALUTATION, "font-bold text-slate-900 cursor-pointer hover:text-blue-600")}>
            {content?.salutation || "Dear Hiring Manager,"}
          </p>
          
          <div {...getBind(IDS.INTRO, "cursor-pointer hover:bg-slate-50 p-1 rounded")}>
            {renderRichText(content?.intro || "I am writing to express my interest...")}
          </div>

          <div {...getBind(IDS.BODY_WRAPPER, "space-y-4")}>
            {content?.bodyParagraphs?.map((para, i) => (
              <div key={i} {...getBind(IDS.BODY_PARA(i), "cursor-pointer hover:bg-slate-50 p-1 rounded border-l-2 border-transparent hover:border-blue-400 transition-all")}>
                {renderRichText(para)}
              </div>
            )) || <p>Details about my experience in Next.js and full-stack development.</p>}
          </div>

          <div {...getBind(IDS.CONCLUSION, "cursor-pointer hover:bg-slate-50 p-1 rounded")}>
            {renderRichText(content?.conclusion || "Thank you for your consideration.")}
          </div>
        </article>

        {/* 5. SIGN OFF BLOCK */}
        <footer {...getBind(IDS.SIGN_OFF_BLOCK, "mt-12 pt-6 border-t border-slate-100 cursor-pointer hover:bg-slate-50 p-2 -m-2 rounded transition-colors")}>
          <p {...getBind(IDS.CLOSE, "mb-10 text-slate-600")}>
            {so?.complimentaryClose || "Sincerely,"}
          </p>
          <p {...getBind(IDS.SIGNATURE, "text-2xl font-bold text-slate-900 tracking-tight")}>
            {so?.signatureName || pi?.name || "Jonathan Doe"}
          </p>
        </footer>
      </div>
    </div>
  );
}