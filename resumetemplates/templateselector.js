'use client';
import React, { useState, useEffect } from 'react';

const templates = [
  { id: 'template01', name: 'Default resume by JXH', image: '/templates/template01/image.png' },
  { id: 'template02', name: 'Classic Grey', image: '/templates/template02/image.png' },
  { id: 'template03', name: 'Creative Orange', image: '/templates/template03/image.png' },
  { id: 'template04', name: 'Professional Green', image: '/templates/template04/image.png' },
  { id: 'template05', name: 'Minimalist White', image: '/templates/template05/image.png' },
  { id: 'template06', name: 'Bold Red', image: '/templates/template06/image.png' },
  { id: 'template07', name: 'Elegant Purple', image: '/templates/template07/image.png' },
];

const ITEMS_PER_PAGE = 3;

export const TemplateSelector = ({ selectedTemplate, onSelect }) => {

  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const storedPage = localStorage.getItem('templatePage');
    if (storedPage) {
      setCurrentPage(Number(storedPage));
    }
  }, []);

  const filteredTemplates = templates.filter((t) =>
    t.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredTemplates.length / ITEMS_PER_PAGE);
  const validCurrentPage = Math.min(currentPage, totalPages > 0 ? totalPages : 1);

  useEffect(() => {
    if (currentPage !== validCurrentPage) {
      setCurrentPage(validCurrentPage);
    }
  }, [currentPage, validCurrentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    localStorage.setItem('templatePage', page);
  };

  const handleTemplateSelect = (templateId) => {
    onSelect(templateId);
    localStorage.setItem('resumeTemplate', templateId);
    console.log(templateId);
    console.log(selectedTemplate);
    
  };

  const startIdx = (validCurrentPage - 1) * ITEMS_PER_PAGE;
  const currentTemplates = filteredTemplates.slice(startIdx, startIdx + ITEMS_PER_PAGE);


  return (
    <div>
      <div className="m-4 flex justify-center">
        <input
          type="text"
          placeholder="Search templates..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
          className="w-full form-input"
        />
      </div>

      {/* Changed lg:grid-cols-4 to lg:grid-cols-3 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {currentTemplates.map((template) => (
          <div
            key={template.id}
            onClick={() => handleTemplateSelect(template.id)}
            className={`card cursor-pointer p-3 transition ${
              selectedTemplate == template.id ? 'border-2 border-red-500 shadow-md' : ''
            }`}
          >
            <img
              src={template.image}
              alt={template.name}
              className="w-full h-40 object-cover rounded"
            />
            <p className={`text-center mt-2 text-sm font-medium }`}>{template.name}</p>
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center items-center mt-4 gap-3">
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
    </div>
  );
};
