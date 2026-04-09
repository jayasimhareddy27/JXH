import { useState } from "react";
import { X } from 'lucide-react';
import { 
  deleteCoverletter, 
  copyCoverletter, 
} from "@lib/redux/features/coverletter/coverlettercrud/thunks";

import { createCoverletter } from "@lib/redux/features/coverletter/coverlettercrud/thunks";


// ---- Handlers ----
export const handleDeleteCLFactory = (dispatch) => (clId) => {
  if (window.confirm("Are you sure you want to delete this cover letter?")) {
    dispatch(deleteCoverletter(clId));
  }
};

export const handleCopyCLFactory = (openModal) => (clId, clName) => {
  openModal(clId, clName);
};

export const handleCopySubmitCLFactory = (dispatch, closeModal) => async (clId, newName) => {
  if (!clId || !newName) return;
  await dispatch(copyCoverletter({ coverletterId: clId, newName }));
  closeModal();
};


export const handleCreateCLFactory = (dispatch, router) => async (name) => {
  const resultAction = await dispatch(createCoverletter(name));
  
  if (createCoverletter.fulfilled.match(resultAction)) {
    const newCLId = resultAction.payload._id;
    
    // Redirect the user to the editor for the newly created letter
    router.push(`/editor/cl/${newCLId}`);
  }
};

// ---- Copy Modal for Cover Letters ----
export const CopyCLModal = ({ oldName, onClose, onSubmit }) => {
  const [newName, setNewName] = useState(`${oldName} Copy`);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      await onSubmit(newName);
    } catch (err) {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100]">
      <div className="bg-[color:var(--color-card-bg)] p-8 rounded-2xl shadow-2xl w-full max-w-[450px] relative border border-[color:var(--color-border-primary)]">
        <button onClick={onClose} className="absolute top-4 right-4 text-[color:var(--color-text-secondary)] hover:text-red-500">
          <X size={24} />
        </button>
        <h2 className="text-2xl font-black mb-6 text-[color:var(--color-text-primary)]">Copy Cover Letter</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <input
            type="text"
            autoFocus
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-[color:var(--color-border-primary)] bg-[color:var(--color-background-primary)] text-[color:var(--color-text-primary)] outline-none"
            required
          />
          <div className="flex justify-end gap-3">
            <button type="button" onClick={onClose} className="px-6 py-3 bg-gray-200 rounded-xl font-bold">Cancel</button>
            <button type="submit" disabled={isSubmitting} className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold">
              {isSubmitting ? 'Copying...' : 'Copy Letter'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};