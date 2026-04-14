"use client";

import { useParams } from "next/navigation";
import { templates } from "@coverlettertemplates/templatelist"; 
import { fetchDocumentById } from "@lib/redux/features/editor/thunks";
import { selectContainer } from "@lib/redux/features/editor/slice";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import Loading from "./loading";
import { Printer, Eye, ChevronDown, Sparkles } from "lucide-react";
import DesignEditor from "../../(shared)/designeditor";

const type = "coverletter";

export default function CoverletterEditorPage() {
    const params = useParams();
    const coverletterId = params?.id;
    const dispatch = useDispatch();
    
    const coverletterData = useSelector((state) => state.editor.formDataMap);
    const { token } = useSelector((state) => state.auth);
    const selectedContainer = useSelector((state) => state.editor.selectedContainer);
    
    const activeTemplateObj = templates.find(t => t.id === coverletterData?.templateId) || templates[0];
    const SelectedTemplate = activeTemplateObj.page;
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
        if (!token || !coverletterId) return;
        dispatch(fetchDocumentById({id: coverletterId, type}));
    }, [token, coverletterId, dispatch]);

    const handleDeselect = () => {
        dispatch(selectContainer(null));
    };

    const handleDownload = () => {
        dispatch(selectContainer(null));
        setTimeout(() => window.print(), 50);
    };
    
    if (!isMounted || !coverletterData || Object.keys(coverletterData).length === 0) {
        return <Loading />;
    }

    return (
        /* Layout switches from Column (mobile) to Row (desktop) */
        <div className="flex flex-col lg:flex-row h-screen overflow-hidden bg-[var(--color-background-primary)] text-[var(--color-text-primary)] print:bg-white print:block">
            
            {/* LIVE PREVIEW AREA */}
            {/* Shrinks to 15% height on mobile when an element is selected to focus on editing */}
            <div className={`flex flex-col overflow-hidden bg-[var(--color-background-tertiary)] transition-all duration-500 ease-in-out
                ${selectedContainer ? 'h-[15vh] lg:h-full lg:flex-1' : 'h-[60vh] lg:h-full lg:flex-1'}
            `}>
                
                <header className="w-full py-3 px-4 lg:px-8 bg-[var(--color-background-secondary)] border-b border-[var(--color-border-primary)] flex justify-between items-center print:hidden shadow-sm z-20">
                    <div className="flex items-center gap-2">
                        <Eye size={16} className="text-[var(--color-text-secondary)]" />
                        <span className="text-[10px] lg:text-sm font-bold text-[var(--color-text-secondary)] uppercase tracking-wider">
                            {selectedContainer ? "Editing Content" : "Live Preview"}
                        </span>
                    </div>
                    
                    <button 
                        onClick={handleDownload} 
                        className="btn-primary py-1.5 px-3 text-[11px] lg:text-sm lg:py-2 lg:px-4 flex items-center gap-2"
                    >
                        <Printer size={16} />
                        <span className="hidden xs:inline">Download</span>
                    </button>
                </header>

                <div className="flex-1 overflow-hidden p-4 lg:p-8 flex justify-center items-start custom-scrollbar" onClick={handleDeselect} >
                    <div className="relative h-fit w-fit flex flex-col items-center">
                        <div 
                            id="resume-print-target" 
                            className={`shadow-2xl h-fit rounded-lg border border-[var(--color-border-primary)] bg-white
                                       origin-top transition-all duration-500
                                       /* Scale aggressively for small phones; Blur/Fade when editing to stay focused */
                                       ${selectedContainer ? 'scale-[0.2] opacity-40 blur-[1px]' : 'scale-[0.4] sm:scale-[0.7] opacity-100 blur-0'} 
                                       lg:scale-100 lg:opacity-100 lg:blur-0 print:shadow-none print:m-0 print:scale-100`}
                        >
                            <SelectedTemplate />
                        </div>
                    </div>
                </div>
            </div>

            {/* DESIGN EDITOR SIDEBAR */}
            {/* Takes 85% of mobile screen when editing. Slides up smoothly. */}
            <aside className={`print:hidden w-full lg:w-1/3 overflow-hidden border-t lg:border-t-0 lg:border-l border-[var(--color-border-primary)] bg-[var(--color-background-secondary)] shadow-[0_-10px_40px_rgba(0,0,0,0.2)] z-30 transition-all duration-500 ease-in-out
                ${selectedContainer ? 'h-[85vh] lg:h-full' : 'h-[40vh] lg:h-full'}
            `}>
                <div className="h-full flex flex-col">
                    
                    {/* Mobile Handle & Status */}
                    <div className="flex items-center justify-between px-4 py-3 bg-[var(--color-background-tertiary)] border-b border-[var(--color-border-primary)] lg:hidden">
                        <div className="flex items-center gap-2">
                            <Sparkles size={14} className="text-blue-500" />
                            <span className="text-[10px] font-black uppercase tracking-tighter opacity-70">
                                {selectedContainer || "Select text to edit"}
                            </span>
                        </div>
                        {selectedContainer && (
                            <button 
                                onClick={handleDeselect}
                                className="flex items-center gap-1 text-[10px] font-bold text-blue-500 bg-blue-500/10 px-2 py-1 rounded-full"
                            >
                                Done <ChevronDown size={12} />
                            </button>
                        )}
                    </div>

                    {/* Scrollable Editor Content */}
                    <div className="flex-1 overflow-y-auto custom-scrollbar p-2 lg:p-0">
                        <DesignEditor 
                            type={type} 
                            selectedContainer={selectedContainer} 
                            activeTemplateObj={activeTemplateObj} 
                            templates={templates}
                        />
                    </div>
                </div>
            </aside>
        </div>
    );
}