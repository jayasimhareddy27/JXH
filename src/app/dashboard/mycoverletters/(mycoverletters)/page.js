"use client";

import { useState, useEffect, useMemo } from "react";
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

  const [isMounted, setIsMounted] = useState(false);

  const { allCoverletters, favCoverletterTemplateId, loading } = useSelector((state) => state.coverlettercrud);

  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("newest");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [copyModal, setCopyModal] = useState({ open: false, id: null, name: "" });

  useEffect(() => {
    setIsMounted(true);
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
    } else {
      dispatch(fetchCoverletters());
    }
  }, [dispatch, router]);

  const handleDelete = handleDeleteCLFactory(dispatch);
  const handleCreateCoverLetter = handleCreateCLFactory(dispatch, router);
  const handleCopy = handleCopyCLFactory((id, name) => setCopyModal({ open: true, id, name }));
  const handleCopySubmit = handleCopySubmitCLFactory(dispatch, () => setCopyModal({ open: false, id: null, name: "" }));

  const filteredAndSortedLetters = useMemo(() => {
    if (!allCoverletters) return [];

    return allCoverletters
      .filter((cl) => {
        const matchesSearch = (cl.name || "").toLowerCase().includes(searchQuery.toLowerCase());
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
        if (sortOption === "newest") return new Date(b.createdAt) - new Date(a.createdAt);
        if (sortOption === "oldest") return new Date(a.createdAt) - new Date(b.createdAt);
        if (sortOption === "az") return (a.name || "").localeCompare(b.name || "");
        if (sortOption === "za") return (b.name || "").localeCompare(a.name || "");
        return 0;
      });
  }, [allCoverletters, searchQuery, startDate, endDate, sortOption]);

  const lettersPerPage = 12;
  const totalPages = Math.ceil(filteredAndSortedLetters.length / lettersPerPage);
  const paginatedLetters = filteredAndSortedLetters.slice((currentPage - 1) * lettersPerPage, currentPage * lettersPerPage);

  if (!isMounted) {
    return <div className="min-h-screen bg-[var(--color-background-primary)]" />;
  }

  return (
    <main className="min-h-screen p-4 md:p-8 bg-[var(--color-background-primary)] transition-colors duration-300">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* PAGE HEADER */}
        <h1 className="text-center text-2xl md:text-3xl font-black tracking-tight text-[var(--color-text-primary)]">
          Manage Your Cover Letters
        </h1>

        {/* TOP SECTION: Create & Search Bar Container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
          <div className="lg:col-span-4 p-5 bg-[var(--color-card-bg)] rounded-xl border border-[var(--color-border-primary)] shadow-sm flex flex-col justify-center">
            <CreateCoverLetter
              isLoading={loading === "loading"}
              handleCreateCL={handleCreateCoverLetter}
            />
          </div>

          <div className="lg:col-span-8 bg-[var(--color-background-secondary)] p-5 rounded-xl border border-[var(--color-border-primary)] flex flex-col justify-center">
            <SearchBar
              setSearchQuery={setSearchQuery}
              setCurrentPage={setCurrentPage}
            />
          </div>
        </div>

        {/* CONTROLS SECTION: Pagination & Small Filters */}
        <div className="flex flex-col gap-4 bg-[var(--color-background-secondary)] p-4 rounded-xl border border-[var(--color-border-primary)] shadow-sm">
          
          <div className="flex justify-center md:justify-start overflow-x-auto">
            <Pagination currentPage={currentPage} totalPages={totalPages} setCurrentPage={setCurrentPage} />
          </div>

          <div className="flex flex-wrap justify-center md:justify-end gap-3 items-center">
            {/* Sort Selector */}
            <select
              value={sortOption}
              onChange={(e) => {
                setSortOption(e.target.value);
                setCurrentPage(1);
              }}
              className="custom-input text-xs min-w-[110px] h-9"
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
              <option value="az">A–Z</option>
              <option value="za">Z–A</option>
            </select>

            {/* Date Pickers */}
            <div className="flex gap-2 items-center text-[10px] md:text-xs font-bold text-[var(--color-text-secondary)]">
              <input
                type="date"
                value={startDate}
                onChange={(e) => { setStartDate(e.target.value); setCurrentPage(1); }}
                className="custom-input p-1 h-9"
              />
              <span className="opacity-40">to</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => { setEndDate(e.target.value); setCurrentPage(1); }}
                className="custom-input p-1 h-9"
              />
            </div>
          </div>
        </div>

        {/* LIST SECTION */}
        <div className="bg-[var(--color-card-bg)] rounded-xl shadow-sm border border-[var(--color-border-primary)] overflow-hidden">
          <CoverLetterCardView
            letters={paginatedLetters}
            isLoading={loading === "loading"}
            handleDelete={handleDelete}
            handleCopy={handleCopy}
            primaryId={favCoverletterTemplateId}
          />
        </div>
      </div>

      {/* MODAL SECTION */}
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