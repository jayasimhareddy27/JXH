import { X } from 'lucide-react'; 
import { useState } from "react";

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