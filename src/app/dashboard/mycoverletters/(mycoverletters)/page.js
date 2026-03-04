"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { fetchCoverletters } from "@lib/redux/features/coverletter/coverlettercrud/thunks";

import Pagination from "@public/components/pagination/pagination"; 
import SearchBar from "@public/components/searchbar/searchbar";   
import CoverLetterCardView from "../(components)/clcardview"; 
import CreateCoverLetter from "../(components)/createcoverletter"; 

import { 
  CopyCLModal, 
  handleDeleteCLFactory, 
  handleCopyCLFactory, 
  handleCopySubmitCLFactory,
  handleCreateCLFactory 
} from "../(components)/index";

export default function MyCoverLettersPage() {
  const router = useRouter();
  const dispatch = useDispatch();

  const { allCoverletters, favCoverletterTemplateId, loading } = useSelector((state) => state.coverlettercrud);

  // State for Filtering and Sorting
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("newest");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  
  const [copyModal, setCopyModal] = useState({ open: false, id: null, name: "" });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) router.push("/login");
    else dispatch(fetchCoverletters());
  }, [dispatch, router]);

  // Handlers
  const handleDelete = handleDeleteCLFactory(dispatch);
  const handleCreateCoverLetter = handleCreateCLFactory(dispatch, router); 
  const handleCopy = handleCopyCLFactory((id, name) => setCopyModal({ open: true, id, name }));
  const handleCopySubmit = handleCopySubmitCLFactory(dispatch, () => setCopyModal({ open: false, id: null, name: "" }));

  // --- FILTERING & SORTING LOGIC ---
  const filteredAndSortedLetters = allCoverletters
    .filter((cl) => {
      // 1. Search Filter
      const matchesSearch = (cl.name || "").toLowerCase().includes(searchQuery.toLowerCase());
      
      // 2. Date Range Filter
      let matchesDate = true;
      if (startDate) {
        matchesDate = matchesDate && new Date(cl.createdAt) >= new Date(startDate + "T00:00:00");
      }
      if (endDate) {
        const inclusiveEnd = new Date(endDate + "T23:59:59");
        matchesDate = matchesDate && new Date(cl.createdAt) <= inclusiveEnd;
      }
      
      return matchesSearch && matchesDate;
    })
    .sort((a, b) => {
      // 3. Sorting Logic
      if (sortOption === "newest") return new Date(b.createdAt) - new Date(a.createdAt);
      if (sortOption === "oldest") return new Date(a.createdAt) - new Date(b.createdAt);
      if (sortOption === "az") return (a.name || "").localeCompare(b.name || "");
      if (sortOption === "za") return (b.name || "").localeCompare(a.name || "");
      return 0;
    });

  const lettersPerPage = 12;
  const totalPages = Math.ceil(filteredAndSortedLetters.length / lettersPerPage);
  const paginatedLetters = filteredAndSortedLetters.slice((currentPage - 1) * lettersPerPage, currentPage * lettersPerPage);

  return (
    <main className="min-h-screen p-6 bg-[color:var(--color-background-primary)]">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-center mb-8 text-[2.25rem] font-bold text-[color:var(--color-text-primary)]">
          Manage Your Cover Letters
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center mb-8">
          <div className="md:col-span-5 p-6 bg-[color:var(--color-card-bg)] rounded-xl border border-[color:var(--color-border-primary)] shadow-lg h-full flex flex-col justify-center">
            <CreateCoverLetter 
              isLoading={loading === "loading"} 
              handleCreateCL={handleCreateCoverLetter} 
            />
          </div>

          <div className="md:col-span-7 h-full">
            <SearchBar 
              setSearchQuery={setSearchQuery} 
              setCurrentPage={setCurrentPage} 
            />
          </div>
        </div>

        {/* --- SORTING AND DATE FILTERS --- */}
        <div className="flex flex-col gap-4 mb-6">
          <Pagination currentPage={currentPage} totalPages={totalPages} setCurrentPage={setCurrentPage} />

          <div className="flex flex-wrap justify-center gap-4 items-center">
            <select 
              value={sortOption}
              onChange={(e) => {
                setSortOption(e.target.value);
                setCurrentPage(1);
              }}
              className="border rounded px-2 py-1 text-[color:var(--color-text-primary)] bg-[color:var(--color-background-secondary)] focus:ring-2 focus:ring-[color:var(--color-cta-bg)] outline-none"
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
              <option value="az">Name (A–Z)</option>
              <option value="za">Name (Z–A)</option>
            </select>

            <div className="flex gap-2 items-center text-sm text-[color:var(--color-text-primary)]">
              <input 
                type="date" 
                value={startDate} 
                onChange={(e) => { setStartDate(e.target.value); setCurrentPage(1); }}
                className="border rounded px-2 py-1 bg-[color:var(--color-background-secondary)] outline-none"
              />
              <span>to</span>
              <input 
                type="date" 
                value={endDate} 
                onChange={(e) => { setEndDate(e.target.value); setCurrentPage(1); }}
                className="border rounded px-2 py-1 bg-[color:var(--color-background-secondary)] outline-none"
              />
            </div>
          </div>
        </div>

        <div className="bg-[color:var(--color-card-bg)] rounded-xl shadow-lg p-1 border border-[color:var(--color-border-primary)]">
          <CoverLetterCardView 
            letters={paginatedLetters}
            isLoading={loading === "loading"}
            handleDelete={handleDelete}
            handleCopy={handleCopy}
            primaryId={favCoverletterTemplateId}
          />
        </div>
      </div>

      {copyModal.open && (
        <CopyCLModal 
          oldName={copyModal.name}
          onClose={() => setCopyModal({ open: false, id: null, name: "" })}
          onSubmit={(newName) => handleCopySubmit(copyModal.id, newName)}
        />
      )}
    </main>
  );
}