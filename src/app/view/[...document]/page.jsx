"use client";

import React, { useRef, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { useReactToPrint } from "react-to-print";
import { templates as cvtemplates } from "@resumetemplates/templatelist";
import { templates as cltemplates } from "@coverlettertemplates/templatelist";
import { fetchDocumentById } from "@lib/redux/features/editor/thunks";
import Loading from "./loading";
import { Download, FileText } from "lucide-react";

export default function ViewPdfPage() {
  const params = useParams();
  
  // Destructure params from [...document]
  // Expected URL: /view/cv/123 -> document: ["cv", "123"]
  const [docTypeSlug, docId] = params?.document || [];
  
  const dispatch = useDispatch();
  const contentRef = useRef(null);
  const [isMounted, setIsMounted] = useState(false);

  // Redux Data
  const formData = useSelector((state) => state.editor.formDataMap);
  const { token } = useSelector((state) => state.auth);

  // Determine if it's a resume or cover letter for the API
  const type = docTypeSlug === "cv" ? "resume" : "coverletter";

  useEffect(() => {
    setIsMounted(true);
    if (!token || !docId) return;
    
    dispatch(fetchDocumentById({ id: docId, type }));
  }, [token, docId, dispatch, type]);

  // Template Setup
  const templates= type== "resume"?cvtemplates:cltemplates
  const activeTemplateObj = templates.find((t) => t.id === formData?.templateId) || templates[0];
  const SelectedTemplate = activeTemplateObj.page;

  // Print Logic
  const handlePrint = useReactToPrint({
    contentRef,
    documentTitle: `${formData?.personalInformation?.fullName || "Document"}_JobxChaser`,
  });

  if (!isMounted || !formData || Object.keys(formData).length === 0) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen bg-[#121212] flex flex-col items-center pb-20">
      
      {/* ACTION HEADER */}
      <nav className="sticky top-0 w-full z-50 bg-[#1e1e1e]/90 backdrop-blur-xl border-b border-white/5 px-6 py-4 flex justify-between items-center shadow-2xl">
        <button
          onClick={() => handlePrint()}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-5 py-2 rounded-full font-bold transition-all active:scale-95 shadow-lg shadow-blue-600/30 text-sm"
        >
          <Download size={16} />
          <span>Download PDF</span>
        </button>
      </nav>

      {/* DOCUMENT PREVIEW */}
      <main className="mt-8 mb-12">
        <div className="bg-[#1e1e1e] p-1 lg:p-4 rounded-xl border border-white/5 shadow-2xl">
          <div 
            ref={contentRef}
            className="resume-print-target shadow-2xl"
          >
            {/* Pass isPreview to template to hide any editor-specific UI */}
            <SelectedTemplate isPreview={true} />
          </div>
        </div>
      </main>
    </div>
  );
}