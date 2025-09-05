import { resumepromptMap } from "@components/prompts/resume";
import { deleteResume,  copyResume,  makePrimaryResume,  createResume,} from "@lib/redux/features/resumeslice";
import { useState } from "react";

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
  
  const promptTemplate = resumepromptMap[id];
  
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

export const handleMakePrimaryFactory =
  (dispatch, primaryResumeId) => (resumeId) => {
    if (resumeId !== primaryResumeId) dispatch(makePrimaryResume(resumeId));
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

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-2xl shadow-lg w-[400px]">
        <h2 className="text-xl font-semibold mb-4">Copy Resume</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit(newName);
          }}
          className="flex flex-col gap-4"
        >
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            className="border rounded px-3 py-2"
            placeholder="Enter new resume name"
            required
          />
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg"
            >
              Copy
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};



