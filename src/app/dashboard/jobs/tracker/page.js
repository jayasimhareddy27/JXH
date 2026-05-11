"use client";

import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchJobs } from "@lib/redux/features/job/thunks";
import { fetchFollowUps } from "@lib/redux/features/followup/thunks";

import SearchBar from "@public/components/searchbar/searchbar";
import Pagination from "@public/components/pagination/pagination";
import FilterBar from "./(components)/filterbar";
import JobCard from "./(components)/jobcard";
import JobInspector from "./(components)/jobinspector";
import FollowUpList from "./(components)/followuplist.js"; 
import { FLOW_STAGES } from "./(components)/constants.js";
import Link from "next/link";
import { Bell, FileText, Globe2, Loader2 } from "lucide-react";
import { fetchCoverletters } from "@lib/redux/features/coverletter/coverlettercrud/thunks";
import { fetchResumes } from "@lib/redux/features/resumes/resumecrud/thunks";

const PAGE_SIZE = 15;

export default function JobTrackerPage() {
  const dispatch = useDispatch();
  
  // HYDRATION FIX: Prevents Server/Client mismatch for dynamic Redux data
  const [hasHydrated, setHasHydrated] = useState(false);

  const { trackerListing = [], loading } = useSelector((state) => state.jobsStore);
  const { followUps = [] } = useSelector((state) => state.followupstore || { followUps: [] });

  const [activeStage, setActiveStage] = useState("all");
  const [selectedJobId, setSelectedJobId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [inspectorView, setInspectorView] = useState("followups");

  useEffect(() => {
    setHasHydrated(true); // Component has safely mounted on client
    dispatch(fetchJobs("tracker"));
    dispatch(fetchFollowUps());
    dispatch(fetchCoverletters());
    dispatch(fetchResumes());
  }, [dispatch]);

  // Link selected job to Inspector
  useEffect(() => {
    if (selectedJobId) {
      dispatch(fetchFollowUps(selectedJobId));
      setInspectorView("details");
    }
  }, [selectedJobId, dispatch]);

  const handleGlobalFollowups = () => {
    setSelectedJobId(null);
    dispatch(fetchFollowUps());
    setInspectorView("followups");
  };

  const upcomingFollowUps = useMemo(() => {
    const list = Array.isArray(followUps) ? followUps : [];
    return list
      .filter(f => f.status === 'pending')
      .sort((a, b) => new Date(a.followUpDateTime) - new Date(b.followUpDateTime));
  }, [followUps]);

  const filteredJobs = useMemo(() => {
    return trackerListing
      .filter((job) => activeStage === "all" || job.stage === activeStage)
      .filter((job) => {
        const searchText = `${job.position || ""} ${job.companyName || ""}`.toLowerCase();
        return searchText.includes(searchQuery.toLowerCase());
      });
  }, [trackerListing, activeStage, searchQuery]);

  const totalPages = Math.ceil(filteredJobs.length / PAGE_SIZE);
  const paginatedJobs = useMemo(() => {
    const startIndex = (currentPage - 1) * PAGE_SIZE;
    return filteredJobs.slice(startIndex, startIndex + PAGE_SIZE);
  }, [filteredJobs, currentPage]);

  const activeJob = useMemo(() => {
    return trackerListing.find((job) => job._id === selectedJobId);
  }, [trackerListing, selectedJobId]);

  const stageIndex = FLOW_STAGES.findIndex((stage) => stage.key === activeStage);

  const handleStageChange = (stage) => {
    setActiveStage(stage);
    setCurrentPage(1);
    setSelectedJobId(null);
    setInspectorView("followups");
    dispatch(fetchFollowUps());
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8 bg-[var(--color-background-primary)] min-h-screen transition-colors duration-300">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-[var(--color-text-primary)] uppercase tracking-tighter italic">Application Tracker</h1>
          <p className="text-sm text-[var(--color-text-secondary)] mt-1 font-medium">Manage pipeline and follow-ups.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={handleGlobalFollowups}
            className="px-4 py-2 bg-[var(--color-background-secondary)] border border-[var(--color-border-primary)] text-[var(--color-text-primary)] rounded-xl text-xs font-black flex items-center gap-2 hover:bg-[var(--color-background-tertiary)] transition-all"
          >
            <Globe2 size={14} /> Show all Tasks
          </button>
          <Link href="/dashboard/stats" className="px-4 py-2 bg-[var(--color-background-secondary)] border border-[var(--color-border-primary)] text-[var(--color-text-primary)] rounded-xl text-sm font-semibold hover:bg-[var(--color-background-tertiary)] transition-all">
            Analytics
          </Link>
          <Link href="/dashboard/jobs/edit" className="px-4 py-2 bg-[var(--color-button-primary-bg)] text-white rounded-xl text-sm font-semibold hover:opacity-90 transition shadow-sm">
            + Add New Job
          </Link>
        </div>
      </header>

      {/* Filter Stepper */}
      <FilterBar activeStage={activeStage} stageIndex={stageIndex} onStageChange={handleStageChange} />

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Job List */}
        <section className="lg:col-span-7 xl:col-span-8 space-y-4">
          <div className="space-y-4">
            <SearchBar setSearchQuery={setSearchQuery} setCurrentPage={setCurrentPage} />
            <p className="text-[10px] font-black uppercase tracking-widest text-[var(--color-text-secondary)] px-1">
              {hasHydrated ? filteredJobs.length : "0"} Applications Found
            </p>
          </div>

          {!hasHydrated || loading ? (
            <div className="py-20 text-center flex flex-col items-center gap-4 text-[var(--color-text-secondary)]">
              <Loader2 className="animate-spin text-blue-500" size={32} />
              <p className="italic font-medium">Syncing applications...</p>
            </div>
          ) : (
            <div className="space-y-3">
              {paginatedJobs.map((job) => (
                <JobCard 
                  key={job._id} 
                  job={job} 
                  isSelected={selectedJobId === job._id} 
                  showStageTag={activeStage === "all"} 
                  onClick={() => setSelectedJobId(job._id)} 
                />
              ))}
              
              {paginatedJobs.length === 0 && (
                <div className="py-20 text-center border-2 border-dashed border-[var(--color-border-secondary)] rounded-3xl text-[var(--color-text-secondary)] bg-[var(--color-background-secondary)]/30">
                  No applications found in this stage.
                </div>
              )}

              {totalPages > 1 && (
                <div className="pt-4">
                  <Pagination currentPage={currentPage} totalPages={totalPages} setCurrentPage={setCurrentPage} />
                </div>
              )}
            </div>
          )}
        </section>

        {/* Right Column: Dynamic Inspector / Follow-ups */}
        <aside className="lg:col-span-5 xl:col-span-4 sticky top-6">
          <div className="bg-[var(--color-card-bg)] rounded-3xl border border-[var(--color-border-primary)] shadow-xl overflow-hidden min-h-[600px] flex flex-col transition-all">
            
            {/* TOGGLE HEADER */}
            <div className="p-2 border-b border-[var(--color-border-primary)] flex bg-[var(--color-background-secondary)] gap-1">
              <button 
                onClick={() => setInspectorView("details")}
                disabled={!selectedJobId}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-xs font-black uppercase rounded-2xl transition-all ${
                  inspectorView === "details" 
                    ? "bg-[var(--color-button-primary-bg)] text-white shadow-md" 
                    : "text-[var(--color-text-secondary)] hover:bg-[var(--color-background-tertiary)]"
                } ${!selectedJobId ? "opacity-30 cursor-not-allowed" : ""}`}
              >
                <FileText size={14} /> Details
              </button>
              <button 
                onClick={() => setInspectorView("followups")}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-xs font-bold uppercase rounded-2xl transition-all ${
                  inspectorView === "followups" 
                    ? "bg-[var(--color-button-primary-bg)] text-white shadow-md" 
                    : "text-[var(--color-text-secondary)] hover:bg-[var(--color-background-tertiary)]"
                }`}
              >
                <Bell size={14} /> Tasks ({hasHydrated ? upcomingFollowUps.length : "0"})
              </button>
            </div>

            {/* DYNAMIC CONTENT AREA */}
            <div className="flex-1 overflow-y-auto custom-scrollbar bg-[var(--color-background-primary)]/10">
              {hasHydrated && inspectorView === "details" && selectedJobId ? (
                <JobInspector activeJob={activeJob} />
              ) : (
                <div className="p-4">
                   <div className="flex justify-between items-center mb-4 px-2">
                    <h3 className="text-[10px] font-black uppercase tracking-widest text-[var(--color-text-placeholder)]">
                      {selectedJobId ? `Focus: ${activeJob?.companyName}` : "Global Pipeline"}
                    </h3>
                    {selectedJobId && (
                      <button onClick={handleGlobalFollowups} className="text-[10px] font-bold text-blue-500 underline">
                        Clear Selection
                      </button>
                    )}
                  </div>
                  {hasHydrated ? (
                    <FollowUpList followUps={upcomingFollowUps} isJobSpecific={!!selectedJobId} />
                  ) : null}
                </div>
              )}
            </div>
          </div>
        </aside>

      </div>
    </main>
  );
}