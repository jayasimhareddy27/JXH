"use client";

import { useParams } from "next/navigation";
import { templates } from "@resumetemplates/templatelist"; 
import { fetchDocumentById } from "@lib/redux/features/editor/thunks";
import { selectContainer } from "@lib/redux/features/editor/slice";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import Loading from "./loading";
import { Printer } from "lucide-react";
import DesignEditor from "../../(shared)/designeditor";
import { fetchJobs } from "@lib/redux/features/job/thunks";

const type="resume";
export default function ResumeEditorPage() {
    const params = useParams();
    const resumeId = params?.id;
    const dispatch = useDispatch();
    
    const resumeData = useSelector((state) => state.editor.formDataMap);
    const { token } = useSelector((state) => state.auth);
    
    const activeTemplateObj = templates.find(t => t.id === resumeData?.templateId) || templates[0];
    const SelectedTemplate = activeTemplateObj.page;
    const [isMounted, setIsMounted] = useState(false);
    
    useEffect(() => {
        if (!token || !resumeId) return;
        dispatch(fetchJobs("tracker")); // Ensure we have the latest job data for AI generation context
        dispatch(fetchDocumentById({id: resumeId, type}));
    }, [token, resumeId, dispatch]);

    const handleDeselect = (e) => {
        if (e.target === e.currentTarget) {
            dispatch(selectContainer(null));
        }
    };

    const handleDownload = () => {
        dispatch(selectContainer(null));
        setTimeout(() => window.print(), 50);
    };
    
    if (!resumeData || Object.keys(resumeData).length === 0) {
        return <Loading />;
    }

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return <div className="flex h-screen items-center justify-center">Loading Editor...</div>;
    }
    return (
        <div className="flex h-screen overflow-hidden bg-[var(--color-background-primary)] text-[var(--color-text-primary)] print:bg-white print:block">
     

            {/* Live Preview Area */}
            <div className="flex-1 flex flex-col h-full overflow-hidden bg-[var(--color-background-tertiary)] print:bg-white print:block">
                
                {/* NEW TOP ACTION BAR - STICKY AND OUT OF THE WAY */}
                <header className="w-full py-3 px-8 bg-[var(--color-background-secondary)] border-b border-[var(--color-border-primary)] flex justify-between items-center print:hidden shadow-sm">
                    <span className="text-sm font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider">
                        Live Preview
                    </span>
                    <button 
                        onClick={handleDownload} 
                        className="btn-primary flex items-center gap-2 text-sm py-2"
                    >
                        <Printer size={18} />
                        Download PDF
                    </button>
                </header>

                {/* SCROLLABLE RESUME AREA */}
                <div     className="flex-1 overflow-y-auto p-8 flex justify-center custom-scrollbar print:p-0"    onClick={handleDeselect} >
                    <div id="resume-print-target" className="shadow-2xl h-fit rounded-lg border border-[var(--color-border-primary)] bg-white print:shadow-none print:border-none print:m-0">
                        <SelectedTemplate />
                    </div>
                </div>
            </div>

                   
            {/* Sidebar Section */}
            <div className="print:hidden w-1/3 h-full overflow-y-auto border-r border-[var(--color-border-primary)] bg-[var(--color-background-secondary)] shadow-xl z-10 custom-scrollbar">
                {<DesignEditor type={type} selectedContainer={resumeData?.designConfig?.selectedContainer} activeTemplateObj={activeTemplateObj} templates={templates}/>}
            </div>
        </div>
    );
}