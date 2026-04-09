import { deleteResume,  copyResume,  makePrimaryResume,  createResume,markAIPrimaryResume,markProfileResume} from "@lib/redux/features/resumes/resumecrud/thunks";

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

