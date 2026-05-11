"use client";
import { useEffect, useState, useCallback, useRef } from "react";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { useParams, useRouter } from "next/navigation";
import { fetchJobById, updateJob } from "@lib/redux/features/job/thunks";
import { fetchFollowUps } from "@lib/redux/features/followup/thunks";
import { fetchResumes } from "@lib/redux/features/resumes/resumecrud/thunks";
import { fetchCoverletters } from "@lib/redux/features/coverletter/coverlettercrud/thunks";

// Component Imports
import JobHeader from "./(components)/jobheader";
import ActionSidebar from "./(components)/actionsidebar";
import StatGrid from "./(components)/statgrid";
import RoleBreakdown from "./(components)/rolebreakdown";
import FollowUpTimeline from "./(components)/followuptimeline";
import JobStatusPicker from "./(components)/jobstatuspicker";
import Loading from "./loading";
import IntelligenceHub from "./(components)/intelligencehub.js"; // NEW
import InterviewPrep from "./(components)/interviewprep.js";   // NEW

export default function JobDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const [isMounted, setIsMounted] = useState(false);
  const [updatingKey, setUpdatingKey] = useState(null);

  const { currentJob, loading, token } = useSelector(
    (state) => ({ 
      currentJob: state.jobsStore.currentJob, 
      loading: state.jobsStore.loading, 
      token: state.auth.token 
    }), 
    shallowEqual
  );

  useEffect(() => {
    setIsMounted(true);
    if (token && id) {
      dispatch(fetchJobById(id));
      dispatch(fetchFollowUps(id));
      dispatch(fetchResumes());
      dispatch(fetchCoverletters());
    }
  }, [id, token, dispatch]);

  if (loading || !isMounted || !currentJob) return <Loading />;

return (
    <main className="min-h-screen p-4 md:p-8 bg-[var(--color-background-primary)]">
      <div className="max-w-6xl mx-auto">
        
        {/* CLEAN HEADER */}
        <div className="grid grid-cols-12 bg-[var(--color-background-secondary)] rounded-[2.5rem] p-6 md:p-10 border border-[var(--color-border-secondary)] mb-8 lg:flex-row justify-between items-center gap-6">
            <div className="col-span-12 lg:col-span-8">
              <JobHeader job={currentJob} />
            </div>
            <div className="col-span-12 lg:col-span-4">
            <JobStatusPicker job={currentJob} />
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* LEFT: CONTENT */}
          <div className="lg:col-span-8 space-y-8">
            <StatGrid job={currentJob} />


            <RoleBreakdown description={currentJob.rawDescription} />
          </div>

          {/* RIGHT: COMPACT SIDEBAR WORKSPACE */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* ASSET HUB - NOW SMALLER & ON RIGHT */}
            <ActionSidebar job={currentJob} />

            {/* TIMELINE */}
            <FollowUpTimeline 
              jobId={id} 
              companyName={currentJob.companyName} 
              position={currentJob.position} 
            />
                        {/* NEW: SKILLS & BUSINESS CONTEXT */}
            <IntelligenceHub job={currentJob} />

            {/* NEW: INTERVIEW CHEAT SHEET */}
            {currentJob.marketIntel?.interviewQuestions?.length > 0 && (
              <InterviewPrep questions={currentJob.marketIntel.interviewQuestions} />
            )}
          </div>
        </div>
      </div>
    </main>
  );
}