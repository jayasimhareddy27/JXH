'use client';

import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import { COVERLETTER_IDS01 as IDS } from './index';
import { bind } from '@/app/editor/(shared)/editorstyles';
import { selectContainer } from '@lib/redux/features/editor/slice';
import { useRef } from 'react';

export default function Template01() {
  const dispatch = useDispatch();
  const clRef = useRef(null);

  const formDataMap = useSelector((state) => state.editor.formDataMap, shallowEqual);

  if (!formDataMap) return null;

  const {
    personalInformation: pi = {},
    recipientInformation: ri = {},
    letterMeta: meta = {},
    letterContent: content = {},
    letterBodyParagraphs = [],
    onlineProfiles: op = {}, 
    signOff = {},
    designConfig = {},
  } = formDataMap;

  const selectedContainer = designConfig.selectedContainer;
  const visibility = designConfig.containers || {}; // Get hide/show states

  // Helper to check if a section is toggled 'on'
  const isVisible = (id) => visibility[id] !== false;

  const getBind = (id, classes = '') => 
    bind(id, designConfig, selectedContainer, dispatch, `${classes} break-words whitespace-pre-wrap overflow-hidden`);

  const handleDeselect = (e) => {
    if (e.target === e.currentTarget) {
      dispatch(selectContainer(null));
    }
  };

  return (
    <div className="flex justify-center bg-slate-200 min-h-screen py-10 print:bg-white print:p-0" onClick={handleDeselect}>
      <div 
        ref={clRef} 
        {...getBind(IDS.PAGE, 'w-[210mm] min-h-[297mm] bg-white p-[25mm] flex flex-col font-serif text-[#111] shadow-2xl print:shadow-none print:m-0')}
      >
        
        {/* HEADER: Only shows if not hidden */}
        {isVisible(IDS.HEADER) && (
          <header {...getBind(IDS.HEADER, "mb-8 text-left border-b border-gray-100 pb-4")}>
            <h1 {...getBind(IDS.SENDER_NAME, "text-2xl font-bold text-black leading-tight")}>
              {pi.name || "Jonathan Doe"}
            </h1>
            
            <div className="text-[10.5pt] font-sans text-gray-700 space-y-0.5">
              <div className="flex gap-x-3 flex-wrap">
                 <span {...getBind(IDS.SENDER_EMAIL)} className="text-blue-600 underline">{pi.email || "j.doe@example.com"}</span>
                 <span {...getBind(IDS.SENDER_PHONE)}>{pi.phone || "+1 (555) 000-0000"}</span>
              </div>
              <div {...getBind(IDS.SENDER_ADDRESS)}>{pi.address || "123 Business Way, New York, NY 10001"}</div>
              
              <div className="text-[9pt] text-gray-500 pt-1 italic font-sans">
                {op.linkedin ? (
                  <span><strong>LinkedIn:</strong> {op.linkedin}</span>
                ) : op.portfolio ? (
                  <span><strong>Portfolio:</strong> {op.portfolio}</span>
                ) : null}
              </div>
            </div>
          </header>
        )}

        <div className="flex-1">
          {/* DATE */}
          {isVisible(IDS.DATE) && (
            <div {...getBind(IDS.DATE, 'mb-8 text-[11pt] text-black')}>
              {meta.date}
            </div>
          )}

          {/* RECIPIENT BLOCK */}
          {isVisible(IDS.RECIPIENT_BLOCK) && (
            <section {...getBind(IDS.RECIPIENT_BLOCK, "mb-8 text-[11pt] leading-snug")}>
              <div {...getBind(IDS.RECIPIENT_NAME, 'font-bold')}>{ri.managerName || "Hiring Manager"}</div>
              <div {...getBind(IDS.RECIPIENT_COMPANY)}>{ri.companyName}</div>
              <div {...getBind(IDS.RECIPIENT_ADDRESS)}>{ri.companyAddress}</div>
            </section>
          )}

          {/* SUBJECT LINE */}
          {isVisible(IDS.SUBJECT_BLOCK) && meta.subjectLine && (
            <div {...getBind(IDS.SUBJECT_BLOCK, "mb-6 text-[11pt] font-bold uppercase")}>
              <span {...getBind(IDS.SUBJECT)}>RE: {meta.subjectLine}</span>
              {meta.referenceNumber && (
                <span {...getBind(IDS.REF_NUMBER)} className="ml-2 font-normal text-gray-600 italic">
                  ({meta.referenceNumber})
                </span>
              )}
            </div>
          )}

          {/* SALUTATION */}
          {isVisible(IDS.SALUTATION) && (
            <p {...getBind(IDS.SALUTATION, 'mb-6 text-[11pt] text-black')}>
              {content.salutation || "Dear Hiring Manager:"}
            </p>
          )}

          {/* LETTER BODY */}
          <div className="space-y-6 text-[11pt] leading-relaxed text-justify text-black">
            {isVisible(IDS.INTRO) && <p {...getBind(IDS.INTRO)}>{content.intro}</p>}

            {/* Check if Body Paragraphs section is hidden */}
            {isVisible(IDS.BODY_WRAPPER) && (
              Array.isArray(letterBodyParagraphs) && letterBodyParagraphs.length > 0 ? (
                letterBodyParagraphs.map((para, i) => {
                  const text = typeof para === 'object' ? (para.bodyParagraph || Object.values(para)[0]) : para;
                  return (
                    <p key={i} {...getBind(IDS.BODY_PARA(i))}>
                      {text}
                    </p>
                  );
                })
              ) : (
                <p>{content.bodyParagraphs}</p>
              )
            )}

            {isVisible(IDS.CONCLUSION) && <p {...getBind(IDS.CONCLUSION)}>{content.conclusion}</p>}
          </div>

          {/* SIGN OFF */}
          {isVisible(IDS.SIGN_OFF_BLOCK) && (
            <div {...getBind(IDS.SIGN_OFF_BLOCK, "mt-12 text-[11pt]")}>
              <p {...getBind(IDS.CLOSE)} className="mb-10">{signOff.complimentaryClose || "Sincerely,"}</p>
              <div className="max-w-[250px]">
                <p {...getBind(IDS.SIGNATURE, 'font-bold text-black border-t border-gray-200 pt-1')}>
                  {signOff.signatureName || "Jonathan Doe"}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}