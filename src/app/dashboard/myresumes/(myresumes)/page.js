"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { fetchResumes, returnuseReference } from "@lib/redux/features/resumes/resumecrud/thunks"; // Added returnuseReference

import CreateResume from "../(components)/createresume";
import SearchBar from "../(components)/searchbar";
import ResumeCardView from "../(components)/resumecardview";
import Pagination from "../(components)/pagination";
import AIConnectionCard from "../(components)/aiconnectioncard";

import { 
  CopyResumeModal, 
  handleConnectAIFactory, 
  handleDeleteFactory, 
  handleCopyFactory, 
  handleCopySubmitFactory, 
  handleMakePrimaryFactory, 
  handleCreateResumeFactory, 
  prepareResumes,
  handleMarkProfileFactory
} from "../(components)/index";

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

  // SYNC ON RELOAD: Runs every time you refresh the page
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
    } else {
      dispatch(fetchResumes()); // Fetch the list of resumes
      dispatch(returnuseReference(token)); // Fetch pinned/AI references from DB
    }
  }, [dispatch, router]);

  // Handlers
  const handleCreateResume = handleCreateResumeFactory(dispatch, router);
  const handleDelete = handleDeleteFactory(dispatch);
  const handleConnectAI = handleConnectAIFactory(dispatch); // Connect logic
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
    <main className="min-h-screen p-6 bg-[color:var(--color-background-primary)]">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-center mb-8 text-[2.25rem] font-bold text-[color:var(--color-text-primary)]">Manage Your Resumes</h1>

        <div className="grid grid-cols-1 md:grid-cols-12 items-center mb-6 gap-6">
          <div className="md:col-span-4 card w-full h-full flex flex-col justify-center p-6 bg-[color:var(--color-card-bg)] rounded-xl border border-[color:var(--color-border-primary)] shadow-lg">
            <CreateResume isLoading={loading === "loading"} handleCreateResume={handleCopySubmit}/>
          </div>
          <div className="md:col-span-8 ">
            <AIConnectionCard />
          </div>
        </div>

        <div className="items-center mb-4 gap-4">
          <SearchBar 
            setCurrentPage={setCurrentPage}
            setSearchQuery={(q) => {
              setSearchQuery(q);
              setCurrentPage(1);
            }}
          />
        </div>

        <div className="flex flex-col gap-4 mb-6">
          <Pagination currentPage={currentPage} totalPages={totalPages} setCurrentPage={setCurrentPage}/>

          <div className="flex flex-wrap justify-center gap-4 items-center">
            <select 
              value={sortOption}
              onChange={(e) => {
                setSortOption(e.target.value);
                setCurrentPage(1);
              }}
              className="border rounded px-2 py-1 text-[color:var(--color-text-primary)] bg-[color:var(--color-background-secondary)]"
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
              <option value="az">Name (A–Z)</option>
              <option value="za">Name (Z–A)</option>
            </select>

            <div className="flex gap-2 items-center text-sm">
              <input 
                type="date" 
                value={startDate} 
                onChange={(e) => setStartDate(e.target.value)}
                className="border rounded px-2 py-1 bg-[color:var(--color-background-secondary)]"
              />
              <span>to</span>
              <input 
                type="date" 
                value={endDate} 
                onChange={(e) => setEndDate(e.target.value)}
                className="border rounded px-2 py-1 bg-[color:var(--color-background-secondary)]"
              />
            </div>
          </div>
        </div>

        <div className="p-6">
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
        </div>
      </div>

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