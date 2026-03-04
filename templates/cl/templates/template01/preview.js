'use client';
import React from 'react';
import { sampleCoverLetter } from '../../samplercoverletter';

export default function Template01CLPreview() {
  const cl = sampleCoverLetter;

  return (
    <div 
    className="w-[600px] bg-white p-10 shadow-2xl scale-[0.25] origin-top pointer-events-none font-sans text-slate-900 border border-gray-100 text-left min-h-[800px]"
    >
      
      {/* Header Section - Same style as Resume for Brand Consistency */}
      <header className="mb-8 border-b-2 border-slate-800 pb-4">
        <h1 className="text-4xl font-black uppercase tracking-tight leading-none mb-3">
          {cl.personalInformation.fullName}
        </h1>
        <div className="flex flex-wrap gap-y-1 gap-x-4 text-[10px] font-medium text-slate-500">
          <span className="flex items-center gap-1">✉ {cl.personalInformation.email}</span>
          <span className="flex items-center gap-1">📞 {cl.personalInformation.phoneNumber}</span>
          <span className="flex items-center gap-1">📍 {cl.personalInformation.address}</span>
        </div>
      </header>

      <div className="space-y-6">
        {/* Recipient & Date Information */}
        <section className="text-[11px] text-slate-600 space-y-1">
          <div className="font-bold text-slate-800 mb-3">{cl.letterMeta.date}</div>
          <div className="font-bold text-slate-900">{cl.recipientInformation.managerName}</div>
          <div>{cl.recipientInformation.companyName}</div>
          <div>{cl.recipientInformation.companyAddress}</div>
        </section>

        {/* Subject Line */}
        <section className="py-2 border-y border-slate-100">
          <div className="text-[11px] font-black uppercase tracking-widest text-blue-700">
            RE: {cl.letterMeta.subjectLine}
          </div>
          {cl.letterMeta.referenceNumber && (
            <div className="text-[9px] text-slate-400 font-bold uppercase mt-0.5">
              Ref: {cl.letterMeta.referenceNumber}
            </div>
          )}
        </section>

        {/* Letter Body Section */}
        <section className="space-y-4 text-[11px] leading-relaxed text-slate-700 text-justify">
          <p className="font-bold text-slate-900 uppercase tracking-tight">
            {cl.letterContent.salutation}
          </p>
          
          <p className="font-medium">{cl.letterContent.intro}</p>

          <div className="space-y-3">
            {cl.letterContent.bodyParagraphs.map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>

          <p>{cl.letterContent.conclusion}</p>
        </section>

        {/* Sign Off Section */}
        <section className="pt-8">
          <p className="text-[11px] text-slate-700">{cl.signOff.complimentaryClose}</p>
          <div className="mt-6">
             <p className="text-xs font-black text-slate-900 uppercase border-t-2 border-slate-800 pt-2 inline-block min-w-[120px]">
               {cl.signOff.signatureName}
             </p>
          </div>
        </section>
      </div>

    </div>
  );
}