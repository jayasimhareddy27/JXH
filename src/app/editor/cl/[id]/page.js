"use client";

import { useParams } from "next/navigation";
import ResumeDesignEditor from "./(components)/editor";
import { templates } from "@resumetemplates/templatelist"; 
import { fetchResumeById } from "@lib/redux/features/resumes/resumeeditor/thunks";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import Loading from "./loading";

export default function ResumeEditorPage() {
    const params = useParams();
    const resumeId = params?.id;
    const dispatch = useDispatch();
    const [isInitialLoading, setIsInitialLoading] = useState(true);

    const [selectedContainer, setselectedContainer] = useState('page');
    
    const resumeData = useSelector((state) => state.resumeEditor.formDataMap);
    const { token } = useSelector((state) => state.auth);
    
    const activeTemplateObj = templates.find(t => t.id === resumeData?.templateId) || templates[0];
    const SelectedTemplate = activeTemplateObj.page;

    useEffect(() => {
        const loadData = async () => {
            if (token && resumeId) {
                try {
                    await dispatch(fetchResumeById(resumeId)).unwrap();
                } catch (error) {
                    console.error("Failed to load resume:", error);
                } finally {
                    setIsInitialLoading(false);
                }
            }
        };
        loadData();
    }, [ token,resumeId,dispatch]);

    if (isInitialLoading || !resumeData || Object.keys(resumeData).length === 0) {
        return <Loading />;
    }

    return (
        <div className="flex h-screen overflow-hidden bg-[var(--color-background-primary)] text-[var(--color-text-primary)]">
            
            {/* Sidebar/Editor Section */}
            <div className="w-100 h-full overflow-y-auto border-r border-[var(--color-border-primary)] bg-[var(--color-background-secondary)] shadow-xl z-10 custom-scrollbar">
                <ResumeDesignEditor resumeId={resumeId} selectedContainer={selectedContainer}/>
            </div>

            {/* Live Preview Area */}
            <div className="flex-1 h-full overflow-y-auto p-8 flex justify-center bg-[var(--color-background-tertiary)] custom-scrollbar">
                <div className="shadow-2xl h-fit bg-white rounded-lg overflow-hidden border border-[var(--color-border-primary)]">
                    <SelectedTemplate selectedContainer={selectedContainer} setSelectedContainer={setselectedContainer}/>
                </div>
            </div>

        </div>
    );
}
