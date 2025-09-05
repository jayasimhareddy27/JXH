"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { fetchResumes } from "@lib/redux/features/resumeslice";

import CreateResume from "../(components)/createresume";
import SearchBar from "../(components)/searchbar";
import ResumeCardView from "../(components)/resumecardview";
import Pagination from "../(components)/pagination";

import {  CopyResumeModal,  handleDeleteFactory,  handleCopyFactory,  handleCopySubmitFactory,  handleMakePrimaryFactory,  handleCreateResumeFactory,  prepareResumes,} from "../(components)/index";

export default function ResumesPage() {
  const router = useRouter();
  const dispatch = useDispatch();

  const { allResumes, primaryResumeId, loading } = useSelector(
    (state) => state.resumes
  );

  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("newest");

  // Date range filter
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Copy modal state
  const [copyModalOpen, setCopyModalOpen] = useState(false);
  const [copyResumeId, setCopyResumeId] = useState(null);
  const [copyOldName, setCopyOldName] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
    } else {
      dispatch(fetchResumes());
    }
  }, [dispatch, router]);

  // Factories for handlers
  const handleCreateResume = handleCreateResumeFactory(dispatch, router);
  const handleDelete = handleDeleteFactory(dispatch);

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

  const handleMakePrimary = handleMakePrimaryFactory(dispatch, primaryResumeId);

  // Data prep
  const resumesPerPage = 15;
  const { displayResumes, totalPages } = prepareResumes({allResumes,primaryResumeId,searchQuery,sortOption,currentPage,resumesPerPage,startDate,endDate});

  return (
    <main className="min-h-screen p-6 bg-[color:var(--color-background-primary)]">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-center mb-8 text-[2.25rem] font-bold text-[color:var(--color-text-primary)]">  Manage Your Resumes</h1>

        {/* Create + Search */}
        <div className="grid md:grid-cols-12 items-center mb-6 gap-4">
          <div className="md:col-span-4">
            <CreateResume  isLoading={loading === "loading"}  handleCreateResume={handleCreateResume}/>
          </div>
          <div className="md:col-span-8">
            <SearchBar setCurrentPage={setCurrentPage}
              setSearchQuery={(q) => {
                setSearchQuery(q);
                setCurrentPage(1);
              }}
            />
          </div>
        </div>

        {/* Pagination + filters row */}
        <div className="flex flex-col gap-4 mb-6">
          <Pagination  currentPage={currentPage}  totalPages={totalPages}  setCurrentPage={setCurrentPage}/>

          <div className="flex flex-wrap justify-center gap-4 items-center">
            {/* Sort */}
            <select value={sortOption}
              onChange={(e) => {
                setSortOption(e.target.value);
                setCurrentPage(1);
              }}
              className="border rounded px-2 py-1 text-[color:var(--color-text-primary)] bg-[color:var(--color-background-secondary)]">
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
              <option value="az">Name (A–Z)</option>
              <option value="za">Name (Z–A)</option>
            </select>

            {/* Date range filter */}
            <div className="flex gap-2 items-center">
              <input type="date" value={startDate} max={endDate || undefined}
                onChange={(e) => {  
                  setStartDate(e.target.value);
                  setCurrentPage(1);
                }}
                className="border rounded px-2 py-1 bg-[color:var(--color-background-secondary)] text-[color:var(--color-text-primary)]"
              />
              <span className="text-[color:var(--color-text-secondary)]">to</span>
              <input type="date" value={endDate} min={startDate || undefined}
                onChange={(e) => {
                  setEndDate(e.target.value);
                  setCurrentPage(1);
                }}
                className="border rounded px-2 py-1 bg-[color:var(--color-background-secondary)] text-[color:var(--color-text-primary)]"
              />
            </div>
          </div>
        </div>

        {/* Resume cards */}
        <div className="p-6">
          <ResumeCardView handleMakePrimary={handleMakePrimary} handleDelete={handleDelete} handleCopy={handleCopy}
            resumes={displayResumes} isLoading={loading === "loading"} currentPage={1} resumesPerPage={displayResumes.length} primaryResumeId={primaryResumeId}/>
        </div>
      </div>

      {/* Copy Modal */}
      {copyModalOpen && (
        <CopyResumeModal  oldName={copyOldName}  onClose={() => setCopyModalOpen(false)}  onSubmit={(newName) => handleCopySubmit(copyResumeId, newName)}/>
      )}
    </main>
  );
}
