"use client";

import { useParams } from "next/navigation";
import { templates } from "@resumetemplates/templatelist"; 
import { fetchDocumentById } from "@lib/redux/features/editor/thunks";
import { selectContainer } from "@lib/redux/features/editor/slice";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import Loading from "./loading";
import { Printer, Eye, ChevronDown } from "lucide-react";
import DesignEditor from "../../(shared)/designeditor";
import Link from "next/link";

const type = "resume";

export default function ResumeEditorPage() {
    const params = useParams();
    const resumeId = params?.id;
    const dispatch = useDispatch();
    
    const resumeData = useSelector((state) => state.editor.formDataMap);
    const { token } = useSelector((state) => state.auth);
    const selectedContainer = useSelector((state) => state.editor.formDataMap?.designConfig?.selectedContainer);
    
    const activeTemplateObj = templates.find(t => t.id === resumeData?.templateId) || templates[0];
    const SelectedTemplate = activeTemplateObj.page;
    const [isMounted, setIsMounted] = useState(false);
    
    useEffect(() => {
        setIsMounted(true);
        if (!token || !resumeId) return;
        dispatch(fetchDocumentById({id: resumeId, type}));
    }, [token, resumeId, dispatch]);

    const handleDeselect = () => {
        dispatch(selectContainer(null));
    };

    
    if (!isMounted || !resumeData || Object.keys(resumeData).length === 0) {
        return <Loading />;
    }

    return (
        <div className="flex flex-col lg:flex-row h-screen overflow-hidden bg-[var(--color-background-primary)] text-[var(--color-text-primary)] print:bg-white ">
            
            <div className={` flex flex-col bg-[var(--color-background-tertiary)] transition-all duration-500 ease-in-out
                ${selectedContainer ? 'h-[30vh] lg:h-full lg:flex-1' : 'h-[60vh] lg:h-full lg:flex-1'}
            `}>
                
                <header className=" w-full py-3 px-4 lg:px-8 bg-[var(--color-background-secondary)] border-b border-[var(--color-border-primary)] flex justify-between items-center  shadow-sm z-20">
                    <div className="flex items-center gap-2">
                        <Eye size={16} className="text-[var(--color-text-secondary)]" />
                        <span className="text-[10px] lg:text-sm font-bold text-[var(--color-text-secondary)] uppercase tracking-wider">
                            {selectedContainer ? "Editing Mode" : "Live Preview"}
                        </span>
                    </div>
                    
                    <Link 
                        href={`/view/cv/${resumeId}`} 
                        className=" btn-primary py-1.5 px-3 text-[11px] lg:text-sm lg:py-2 lg:px-4 flex items-center gap-2"
                    >
                        <Printer size={16} />
                        <span className="hidden xs:inline">Download</span>
                    </Link>
                </header>

                <div className="flex-1 overflow-y-auto custom-scrollbar bg-slate-100/50" onClick={(e) => e.target === e.currentTarget && handleDeselect()}>
                    <div className=" flex flex-col items-center md:p-6  lg:p-12 w-full h-fit" >
                        <SelectedTemplate  />
                    </div>
                </div>
            </div>

            {/* DESIGN EDITOR SIDEBAR */}
            <aside className={` w-full lg:w-1/3 overflow-hidden border-t lg:border-t-0 lg:border-l border-[var(--color-border-primary)] bg-[var(--color-background-secondary)] shadow-[0_-10px_40px_rgba(0,0,0,0.2)] z-30 transition-all duration-500 ease-in-out
                ${selectedContainer ? 'h-[70vh] lg:h-full' : 'h-[40vh] lg:h-full'}
            `}>  
                <div className="h-full flex flex-col">
                    <div className="flex items-center justify-between px-4 py-3 bg-[var(--color-background-secondary)]/90 backdrop-blur-md border-b border-[var(--color-border-primary)] lg:hidden sticky top-0 z-30">
                        <div className="flex flex-col gap-1.5 flex-1">
                            <div className="flex items-center gap-2">
                                <div className="w-1 h-1 rounded-full bg-blue-500 animate-pulse" />
                                <span className="text-[7px] font-bold uppercase tracking-widest text-[var(--color-text-secondary)]">
                                    {selectedContainer ? (
                                        <span>Editing <span className="text-[var(--color-text-primary)] font-black">{selectedContainer.replace(/_/g, ' ')}</span></span>
                                    ) : (
                                        "Select Element"
                                    )}
                                </span>
                            </div>
                        </div>

                        {selectedContainer && (
                            <button 
                                onClick={handleDeselect}
                                className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-tight text-white bg-blue-600 hover:bg-blue-700 px-2 py-1 rounded-xl shadow-lg shadow-blue-500/20 active:scale-95 transition-all"
                            >
                                Done
                                <ChevronDown size={10} strokeWidth={3} />
                            </button>
                        )}
                    </div>

                    <div className="  flex-1 overflow-y-auto custom-scrollbar p-2 lg:p-0">
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