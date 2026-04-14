"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { fetchResumes, returnuseReference } from "@lib/redux/features/resumes/resumecrud/thunks";

// UI Components
import Pagination from "@public/components/pagination/pagination.js";
import SearchBar from "@public/components/searchbar/searchbar.js";

import CreateResume from "../(components)/createresume";
import ResumeCardView from "../(components)/resumecardview";
import AIConnectionCard from "../(components)/aiconnectioncard";

// Hydration Fix Wrapper
import ClientOnly from "@public/components/shared/clientonly.js";

// Factories and Helpers
import { 
  handleConnectAIFactory,   
  handleDeleteFactory, 
  handleCopyFactory, 
  handleCopySubmitFactory, 
  handleMakePrimaryFactory, 
  prepareResumes,
  handleMarkProfileFactory
} from "../(components)/index";
import { CopyResumeModal } from "../(components)/copyresumemodal";

export default function ResumesPage() {
  const router = useRouter();
  const dispatch = useDispatch();

  // Get live data from Redux store
  const { allResumes, primaryResumeId, aiResumeRef, myProfileRef, loading } = useSelector((state) => state.resumecrud);

  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("newest");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [copyModalOpen, setCopyModalOpen] = useState(false);
  const [copyResumeId, setCopyResumeId] = useState(null);
  const [copyOldName, setCopyOldName] = useState("");

  // SYNC ON RELOAD
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
    } else {
      dispatch(fetchResumes()); 
      dispatch(returnuseReference(token)); 
    }
  }, [dispatch, router]);

  // Handlers
  const handleDelete = handleDeleteFactory(dispatch);
  const handleConnectAI = handleConnectAIFactory(dispatch);
  const handleMakePrimary = handleMakePrimaryFactory(dispatch, primaryResumeId);
  const handleMarkProfile = handleMarkProfileFactory(dispatch);

  const handleCopy = handleCopyFactory((id, name) => {
    setCopyResumeId(id);
    setCopyOldName(name);
    setCopyModalOpen(true);
  });

  const handleCopySubmit = handleCopySubmitFactory(
    dispatch,
    () => setCopyModalOpen(false),
    () => {
      setCopyResumeId(null);
      setCopyOldName("");
    }
  );

  // Prep data for display
  const resumesPerPage = 15;
  const { displayResumes, totalPages } = prepareResumes({
    allResumes,
    primaryResumeId,
    searchQuery,
    sortOption,
    currentPage,
    resumesPerPage,
    startDate,
    endDate
  });

  return (
    <main className="min-h-screen p-4 md:p-8 bg-[var(--color-background-primary)] transition-colors duration-300">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* PAGE HEADER */}
        <h1 className="text-center text-3xl md:text-4xl font-black tracking-tight text-[var(--color-text-primary)]">
          Manage Your Resumes
        </h1>

        {/* TOP SECTION: Create & AI Connection */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-4 h-full">
            <div className="card h-full flex flex-col justify-center p-6 border border-[var(--color-border-primary)] shadow-modal bg-[var(--color-card-bg)]">
              <CreateResume isLoading={loading === "loading"} handleCreateResume={handleCopySubmit}/>
            </div>
          </div>
          <div className="lg:col-span-8">
            <ClientOnly fallback={<div className="h-48 bg-[var(--color-background-tertiary)] animate-pulse rounded-2xl" />}>
              <AIConnectionCard />
            </ClientOnly>
          </div>
        </div>

        {/* CONTROLS SECTION: Search, Sort, Date */}
        <div className="space-y-6 bg-[var(--color-background-secondary)] p-4 md:p-6 rounded-2xl border border-[var(--color-border-primary)] shadow-sm">
          
          <div className="w-full">
            <SearchBar 
              setCurrentPage={setCurrentPage}
              setSearchQuery={(q) => {
                setSearchQuery(q);
                setCurrentPage(1);
              }}
            />
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            {/* PAGINATION (Top Position) */}
            <div className="w-full md:w-auto overflow-x-auto">
              <ClientOnly fallback={<div className="h-10 w-48 bg-[var(--color-background-tertiary)] rounded animate-pulse" />}>
                <Pagination currentPage={currentPage} totalPages={totalPages} setCurrentPage={setCurrentPage}/>
              </ClientOnly>
            </div>

            {/* FILTERS Group */}
            <div className="flex flex-wrap items-center justify-center md:justify-end gap-3 w-full md:w-auto">
              <select 
                value={sortOption}
                onChange={(e) => {
                  setSortOption(e.target.value);
                  setCurrentPage(1);
                }}
                className="custom-input text-sm min-w-[140px]"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="az">Name (A–Z)</option>
                <option value="za">Name (Z–A)</option>
              </select>

              <div className="flex items-center gap-2 text-xs font-semibold text-[var(--color-text-secondary)]">
                <input 
                  type="date" 
                  value={startDate} 
                  onChange={(e) => setStartDate(e.target.value)}
                  className="custom-input p-1"
                />
                <span className="opacity-50">—</span>
                <input 
                  type="date" 
                  value={endDate} 
                  onChange={(e) => setEndDate(e.target.value)}
                  className="custom-input p-1"
                />
              </div>
            </div>
          </div>
        </div>

        {/* MAIN LIST SECTION */}
        <section className="min-h-[400px]">
          <ClientOnly fallback={
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-64 bg-[var(--color-background-tertiary)] rounded-2xl animate-pulse" />
              ))}
            </div>
          }>
            <ResumeCardView 
              handleConnectAI={handleConnectAI} 
              handleMakePrimary={handleMakePrimary}   
              handleMarkProfile={handleMarkProfile}
              handleDelete={handleDelete} 
              handleCopy={handleCopy} 
              resumes={displayResumes} 
              aiResumeRef={aiResumeRef} 
              primaryResumeId={primaryResumeId} 
              myProfileRef={myProfileRef}
              isLoading={loading === "loading"} 
              currentPage={1} 
              resumesPerPage={displayResumes.length} 
            />
          </ClientOnly>
        </section>
      </div>

      {/* MODAL SECTION */}
      {copyModalOpen && (
        <CopyResumeModal 
          oldName={copyOldName} 
          onClose={() => setCopyModalOpen(false)} 
          onSubmit={(newName) => handleCopySubmit(copyResumeId, newName)}
        />
      )}
    </main>
  );
}