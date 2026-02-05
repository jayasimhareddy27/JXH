"use client";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { displayToast } from '@lib/redux/features/toast/thunks';

const CreateCoverLetter = ({ isLoading, handleCreateCL }) => {
  const [clName, setClName] = useState("");
  const dispatch = useDispatch();

  const onSubmit = async (e) => {
    e.preventDefault();

    if (!clName.trim()) {
      dispatch(displayToast({ message: "Cover letter name is required", type: "error" }));
      return;
    }

    const confirmed = window.confirm("Create a new cover letter with this name?");
    if (!confirmed) return;

    try {
      // Calls the factory handler passed from the parent page
      await handleCreateCL(clName);
      
      dispatch(displayToast({ 
        message: `Cover letter "${clName}" created successfully!`, 
        type: "success" 
      }));
      setClName("");
    } catch (err) {
      dispatch(displayToast({ 
        message: err.message || "Failed to create cover letter", 
        type: "error" 
      }));
    }
  };

  return (
    <div className="">
      <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Cover Letter Name Field */}
        <div className="col-span-1">
          <label
            htmlFor="clName"
            className="block mb-2 font-medium text-[color:var(--color-text-primary)]"
          >
            Cover Letter Name
          </label>

          <input
            type="text"
            id="clName"
            value={clName}
            onChange={(e) => setClName(e.target.value)}
            placeholder="e.g., Google - Application Analyst Role"
            disabled={isLoading}
            className="w-full p-3 rounded-lg outline-none text-sm text-[color:var(--color-text-primary)] bg-[color:var(--color-background-secondary)] transition duration-200 border border-[color:var(--color-border-primary)]"
          />
        </div>

        {/* Submit Button */}
        <div className="col-span-1 flex items-end">
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full btn-primary ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            {isLoading ? "Creating..." : "Create Cover Letter"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateCoverLetter;