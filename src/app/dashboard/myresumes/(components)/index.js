import { formatPrompts,promptMap } from "@public/staticfiles/prompts/userdetailextraction";
import { deleteResume,  copyResume,  makePrimaryResume,  createResume,markAIPrimaryResume,markProfileResume} from "@lib/redux/features/resumes/resumecrud/thunks";
import { useState } from "react";
import { X } from 'lucide-react'; 

// Add this to your index.js

export const handleConnectAIFactory = (dispatch) => (resumeId) => {
  // Use the thunk you already made! It handles the API and State update.
  dispatch(markAIPrimaryResume(resumeId)); 
};

export const handleMarkProfileFactory = (dispatch) => (resumeId) => {
  dispatch(markProfileResume(resumeId));
};

export const handleMakePrimaryFactory =(dispatch, primaryResumeId) => (resumeId) => {
  dispatch(makePrimaryResume(resumeId));
};


// This is a pure utility function for formatting strings. It stays.
export function formatLabel(key) {
  if (!key) return "";
  return key
    .replace(/_/g, " ")
    .replace(/([A-Z])/g, " $1")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/^\w/, (c) => c.toUpperCase());
}

// This function handles the AI API call, which is a side effect
// separate from our Redux state management. It stays.

export async function fetchPhaseDatainJson(id,key,resumeRawText, AiAgent, isArrayPhase = false) {
  const { provider, model, ApiKey } = AiAgent;
  
  const promptTemplate = promptMap[id];
  if (!promptTemplate) {
    throw new Error(`No prompt template found for key ${key}`);
  }
  const prompt = `${promptTemplate}\n\n${resumeRawText}`;

  const response = await fetch("/api/user_extract", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt, provider, model, ApiKey }),
  });
  
  if (!response.ok) {
    throw new Error("Failed to fetch phase data");
  }

  const data = await response.json();
  return isArrayPhase ? (Array.isArray(data) ? data : [data]) : data;
}

// utils/extractTextFromFile.js

export const extractTextFromFile = async (file) => {
  if (!file) throw new Error("No file provided");

  // Lazy-load libraries to keep bundle smaller
  if (file.type === "application/pdf") {
    const { default: pdfToText } = await import("react-pdftotext");
    return await pdfToText(file);
  }

  if (
    file.type ===
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) {
    const mammoth = await import("mammoth/mammoth.browser");
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    return result.value;
  }

  throw new Error("Unsupported file type. Please upload a PDF or DOCX.");
};


// ---- Handlers ----
export const handleDeleteFactory = (dispatch) => (resumeId) => {
  if (window.confirm("Are you sure?")) dispatch(deleteResume(resumeId));
};

export const handleCopyFactory = (openCopyModal) => (resumeId, resumeName) => {
  openCopyModal(resumeId, resumeName);
};

export const handleCopySubmitFactory =
  (dispatch, closeModal, resetCopyState) => async (resumeId, newName) => {
    if (!resumeId || !newName) return;
    await dispatch(copyResume({ resumeId, newName }));
    resetCopyState();
    closeModal();
  };


export const handleCreateResumeFactory = (dispatch, router) => async (name) => {
  const resultAction = await dispatch(createResume(name));
  
  if (createResume.fulfilled.match(resultAction)) {
    const newResumeId = resultAction.payload._id;
    
    router.push(`/dashboard/myresumes/${newResumeId}`);
  }
};

// ---- Data Prep (filter/sort/paginate) ----
export const prepareResumes = ({
  allResumes,
  primaryResumeId,
  searchQuery,
  sortOption,
  currentPage,
  resumesPerPage,
  startDate,
  endDate,
}) => {
  const primaryResume = allResumes.find((r) => r._id === primaryResumeId);
  let otherResumes = allResumes.filter((r) => r._id !== primaryResumeId);

  // Search
  otherResumes = otherResumes.filter((r) =>
    (r.name || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Date range
  if (startDate) {
    const start = new Date(startDate + "T00:00:00");
    otherResumes = otherResumes.filter((r) => new Date(r.createdAt) >= start);
  }
  if (endDate) {
    const inclusiveEnd = new Date(endDate + "T00:00:00"); // start of the end day
    inclusiveEnd.setDate(inclusiveEnd.getDate() + 1);      // next day midnight
    inclusiveEnd.setHours(0, 0, 0, 0);

    otherResumes = otherResumes.filter(
      (r) => new Date(r.createdAt) < inclusiveEnd
    );
  }

  // Sort
  otherResumes = otherResumes.sort((a, b) => {
    if (sortOption === "newest") return new Date(b.createdAt) - new Date(a.createdAt);
    if (sortOption === "oldest") return new Date(a.createdAt) - new Date(b.createdAt);
    if (sortOption === "az") return (a.name || "").localeCompare(b.name || "");
    if (sortOption === "za") return (b.name || "").localeCompare(a.name || "");
    return 0;
  });

  const hasPrimary = Boolean(primaryResume);
  const othersPageSize = hasPrimary ? Math.max(resumesPerPage - 1, 1) : resumesPerPage;
  const totalPages = othersPageSize > 0 ? Math.ceil(otherResumes.length / othersPageSize) : 1;
  const startIndex = (currentPage - 1) * othersPageSize;
  const paginatedOthers = otherResumes.slice(startIndex, startIndex + othersPageSize);

  return {
    primaryResume,
    otherResumes,
    displayResumes: [...(primaryResume ? [primaryResume] : []), ...paginatedOthers],
    totalPages,
  };
};

// ---- Copy Modal ----
export const CopyResumeModal = ({ oldName, onClose, onSubmit }) => {
  const [newName, setNewName] = useState(`${oldName} Copy`);
  const [isSubmitting, setIsSubmitting] = useState(false); // Track the click

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return; // Prevent extra clicks

    setIsSubmitting(true);
    try {
      await onSubmit(newName);
    } catch (err) {
      setIsSubmitting(false); // Only re-enable if it fails
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100]">
      {/* Container uses your theme variables */}
      <div className="bg-[color:var(--color-card-bg)] p-8 rounded-2xl shadow-2xl w-full max-w-[450px] relative border border-[color:var(--color-border-primary)]">
        
        {/* The Close "X" Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-[color:var(--color-text-secondary)] hover:text-[color:var(--color-danger)] transition-colors"
          disabled={isSubmitting}
        >
          <X size={24} />
        </button>

        <h2 className="text-2xl font-black mb-6 text-[color:var(--color-text-primary)]">
          Copy Resume
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-[color:var(--color-text-secondary)]">
              New Resume Name
            </label>
            <input
              type="text"
              autoFocus
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-[color:var(--color-border-primary)] bg-[color:var(--color-background-primary)] text-[color:var(--color-text-primary)] focus:ring-2 focus:ring-[color:var(--color-cta-bg)] outline-none transition-all"
              placeholder="Enter new resume name"
              required
              disabled={isSubmitting}
            />
          </div>

          <div className="flex justify-end gap-3 mt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-6 py-3 bg-[color:var(--color-background-tertiary)] text-[color:var(--color-text-primary)] rounded-xl font-bold hover:opacity-80 transition-opacity disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-3 bg-[color:var(--color-cta-bg)] text-white rounded-xl font-bold hover:opacity-90 transition-all shadow-md active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Copying...' : 'Copy Resume'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};