"use client";

import { useParams } from "next/navigation";
import { templates } from "@coverlettertemplates/templatelist"; 
import { fetchDocumentById } from "@lib/redux/features/editor/thunks";
import { selectContainer } from "@lib/redux/features/editor/slice";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import Loading from "./loading";
import { Printer, Eye, ChevronDown } from "lucide-react";
import DesignEditor from "../../(shared)/designeditor";
import Link from "next/link";

const type = "coverletter";

export default function CoverletterEditorPage() {
    const params = useParams();
    const coverletterId = params?.id;
    const dispatch = useDispatch();
    
    const coverletterData = useSelector((state) => state.editor.formDataMap);
    const { token } = useSelector((state) => state.auth);
    const selectedContainer = useSelector((state) => state.editor.formDataMap?.designConfig?.selectedContainer);
    
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

    if (!isMounted || !coverletterData || Object.keys(coverletterData).length === 0) {
        return <Loading />;
    }

    return (
        <div className="flex flex-col lg:flex-row h-screen overflow-hidden bg-[var(--color-background-primary)] text-[var(--color-text-primary)] print:bg-white print:block">
            
            {/* LIVE PREVIEW AREA */}
            <div className={`flex flex-col bg-[var(--color-background-tertiary)] transition-all duration-500 ease-in-out
                ${selectedContainer ? 'h-[25vh] lg:h-full lg:flex-1' : 'h-[55vh] lg:h-full lg:flex-1'}
            `}>
                
                <header className="w-full py-3 px-4 lg:px-8 bg-[var(--color-background-secondary)] border-b border-[var(--color-border-primary)] flex justify-between items-center  shadow-sm z-20">
                    <div className="flex items-center gap-2">
                        <Eye size={16} className="text-[var(--color-text-secondary)]" />
                        <span className="text-[10px] lg:text-sm font-bold text-[var(--color-text-secondary)] uppercase tracking-wider">
                            {selectedContainer ? "Editing Content" : "Live Preview"}
                        </span>
                    </div>
                    
                    <Link 
                        href={`/view/cl/${coverletterId}`} 
                        className="btn-primary py-1.5 px-3 text-[11px] lg:text-sm lg:py-2 lg:px-4 flex items-center gap-2"
                    >
                        <Printer size={16} />
                        <span className="hidden xs:inline">Download</span>
                    </Link>
                </header>

                {/* SCROLLABLE AREA */}
                <div 
                    className="flex-1 overflow-y-auto custom-scrollbar bg-slate-100"
                    onClick={(e) => e.target === e.currentTarget && handleDeselect()}
                >
                    <div className="flex flex-col items-center px-42 py-2 md:p-6 lg:p-12 w-full min-h-full">
                        <div 
                            className={`shadow-2xl rounded-lg border border-[var(--color-border-primary)] bg-white
                                       origin-top transition-all duration-500
                                       ${selectedContainer 
                                            ? 'scale-[0.45] sm:scale-[0.55]' 
                                            : 'scale-[0.45] sm:scale-[0.8]'
                                       } 
                                       lg:scale-100 print:shadow-none print:m-0 print:scale-100`}
                        >
                            {/* Inner Container: Prevents bleeding off screen on smallest devices */}
                            <div className="w-[800px] max-w-[85vw] lg:max-w-none" >
                                <SelectedTemplate />
                            </div>
                        </div>

                        {/* Large spacer for scroll track */}
                        <div className="h-[500px] lg:h-20 w-full shrink-0" />
                    </div>
                </div>
            </div>

            {/* DESIGN EDITOR SIDEBAR */}
            <aside className={` w-full lg:w-1/3 overflow-hidden border-t lg:border-t-0 lg:border-l border-[var(--color-border-primary)] bg-[var(--color-background-secondary)] shadow-[0_-10px_40px_rgba(0,0,0,0.1)] z-30 transition-all duration-500 ease-in-out
                ${selectedContainer ? 'h-[75vh] lg:h-full' : 'h-[45vh] lg:h-full'}
            `}>
                <div className="h-full flex flex-col">
                    
                    {/* Compact Status Bar */}
                    <div className="flex items-center justify-between px-4 py-3 bg-[var(--color-background-secondary)]/90 backdrop-blur-md border-b border-[var(--color-border-primary)] lg:hidden sticky top-0 z-30">
                        <div className="flex flex-col gap-1.5 flex-1">
                            <div className="flex items-center gap-2">
                                <div className="w-1 h-1 rounded-full bg-blue-500 animate-pulse" />
                                <span className="text-[7px] font-bold uppercase tracking-widest text-[var(--color-text-secondary)]">
                                    {selectedContainer ? (
                                        <span>Editing <span className="text-[var(--color-text-primary)] font-black uppercase">{selectedContainer.replace(/_/g, ' ')}</span></span>
                                    ) : (
                                        "Select Element"
                                    )}
                                </span>
                            </div>
                        </div>

                        {selectedContainer && (
                            <button 
                                onClick={handleDeselect}
                                className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-tight text-white bg-blue-600 px-3 py-1.5 rounded-xl shadow-lg active:scale-95 transition-all"
                            >
                                Done
                                <ChevronDown size={10} strokeWidth={3} />
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