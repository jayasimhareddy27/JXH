'use client';

import React, { useState, useEffect } from 'react';
import { templates } from '@coverlettertemplates/templatelist';
import { useDispatch, useSelector } from 'react-redux';
import { returnuseReference } from '@lib/redux/features/resumes/resumecrud/thunks';
import { markPrimaryCoverletterTemplate } from '@lib/redux/features/coverletter/coverlettercrud/thunks';

// Hydration fix import
import ClientOnly from '@public/components/shared/clientonly.js';

const ITEMS_PER_PAGE = 10;

export default function TemplateSelectionPage() {
  const dispatch = useDispatch();

  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');

  const favCoverletterTemplateId = useSelector((state) => state.coverlettercrud.favCoverletterTemplateId);

  useEffect(() => {
    if (!favCoverletterTemplateId) {
      const token = localStorage.getItem('token');
      if (token) dispatch(returnuseReference(token));
    }

    const storedTemplate = localStorage.getItem('favcoverletterTemplate');
    if (storedTemplate && storedTemplate !== favCoverletterTemplateId) {
      dispatch(markPrimaryCoverletterTemplate(storedTemplate));
    }

    const storedPage = localStorage.getItem('templatePage');
    if (storedPage) setCurrentPage(Number(storedPage));
  }, [dispatch, favCoverletterTemplateId]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const filteredTemplates = templates.filter((t) =>
    t.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.max(1, Math.ceil(filteredTemplates.length / ITEMS_PER_PAGE));

  const validCurrentPage = Math.min(currentPage, totalPages);
  const startIdx = (validCurrentPage - 1) * ITEMS_PER_PAGE;
  const currentTemplates = filteredTemplates.slice(startIdx, startIdx + ITEMS_PER_PAGE);

  const handleTemplateSelect = (id) => {
    localStorage.setItem('favcoverletterTemplate', id);
    dispatch(markPrimaryCoverletterTemplate(id));
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    localStorage.setItem('templatePage', page);
  };

  return (
    <main className="min-h-screen p-6">
      <h2 className="mb-6 text-center text-4xl font-semibold">
        Choose Your cover letter Template
      </h2>

      {/* Search - SSR Safe */}
      <div className="sticky top-0 z-10 mb-6 flex justify-center">
        <input
          type="text"
          placeholder="Search templates..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="form-input w-full max-w-xl"
        />
      </div>

      {/* Grid wrapped in ClientOnly to solve hydration mismatch */}
      <ClientOnly fallback={<div className="h-64 flex items-center justify-center">Loading Templates...</div>}>
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-3 lg:grid-cols-6">
          {currentTemplates.map(({ id, name, Component }) => (
            <div
              key={id}
              onClick={() => handleTemplateSelect(id)}
              className={`cursor-pointer rounded-xl p-3 transition ${
                favCoverletterTemplateId === id
                  ? 'border-2 border-red-500 shadow-md'
                  : 'border'
              }`}
            >
              <div className="flex h-[220px] justify-center overflow-hidden rounded-lg">
                <div className="pointer-events-none origin-top">
                  <Component />
                </div>
              </div>

              <p className="mt-2 text-center text-sm font-medium">{name}</p>
            </div>
          ))}
        </div>
      </ClientOnly>

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