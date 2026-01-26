'use client';

import React, { useState, useEffect } from 'react';
import { templates } from '@resumetemplates/templatelist';
import { useDispatch, useSelector } from 'react-redux';
import { updateResumePhase } from '@lib/redux/features/resumes/resumeeditor/slice';

const ITEMS_PER_PAGE = 8;

export default function TemplateSelectionPage() {
  const dispatch = useDispatch();

  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');

  const resume = useSelector(  (state) => state.resumeEditor.formDataMap);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const filteredTemplates = templates.filter((t) =>
    t.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.max(1,Math.ceil(filteredTemplates.length / ITEMS_PER_PAGE));

  const validCurrentPage = Math.min(currentPage, totalPages);
  const startIdx = (validCurrentPage - 1) * ITEMS_PER_PAGE;
  const currentTemplates = filteredTemplates.slice(
    startIdx,
    startIdx + ITEMS_PER_PAGE
  );

  const handleTemplateSelect = (id) => {
    dispatch(updateResumePhase({ phaseKey: 'templateId', data: id }));

  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    localStorage.setItem('templatePage', page);
  };

  return (
    <main className="min-h-screen">
      {/* Search */}
      <div className="sticky top-0 z-10 mb-6 flex justify-center">
        <input
          type="text"
          placeholder="Search templates..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="form-input w-full max-w-xl"
        />
      </div>

      {/* Template Grid */}
      <div className="grid grid-cols-2 gap-4">
        {currentTemplates.map(({ id, name, Component }) => (
          <div
            key={id}
            onClick={() => handleTemplateSelect(id)}
            className={`cursor-pointer rounded-xl p-3 transition ${
              resume?.templateId === id
                ? 'border-2 border-red-500 shadow-md'
                : 'border'
            }`}
          >
            {/* Preview */}
            <div className="flex h-[220px] justify-center overflow-hidden rounded-lg ">
              <div className="pointer-events-none origin-top">
                <Component resume={resume} />
              </div>
            </div>

            <p className="mt-2 text-center text-sm font-medium">{name}</p>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-8 flex items-center justify-center gap-4">
          {validCurrentPage > 1 && (
            <button
              onClick={() => handlePageChange(validCurrentPage - 1)}
              className="btn-secondary"
            >
              Prev
            </button>
          )}

          <span className="text-sm font-medium">
            Page {validCurrentPage} of {totalPages}
          </span>

          {validCurrentPage < totalPages && (
            <button
              onClick={() => handlePageChange(validCurrentPage + 1)}
              className="btn-secondary"
            >
              Next
            </button>
          )}
        </div>
      )}
    </main>
  );
}
