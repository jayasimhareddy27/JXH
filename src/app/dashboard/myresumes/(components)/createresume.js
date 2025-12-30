"use client";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { displayToast } from '@lib/redux/features/toast/thunks';


const CreateResume = ({ isLoading, handleCreateResume }) => {
  const [resumeName, setResumeName] = useState("");
  const dispatch = useDispatch();

  const { myProfileRef } = useSelector((state) => state.resumecrud);

  const onSubmit = async (e) => {
    e.preventDefault();

    if (!resumeName.trim()) {
      dispatch(displayToast({ message: "Resume name is required", type: "error" }));
      return;
    }

    // Optional: custom confirmation dialog logic here or skip it for UX reasons
    const confirmed = window.confirm("Create a new resume with this name?");
    if (!confirmed) return;

    try {
      await handleCreateResume(myProfileRef,resumeName);
      dispatch(displayToast({ message: `Resume "${resumeName}" created successfully!`, type: "success" }));
      setResumeName("");
    } catch (err) {
      dispatch(displayToast({ message: err.message || "Failed to create resume", type: "error" }));
    }
  };

  return (
    <div className="">
      <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Resume Name Field */}
        <div className="col-span-1">
          <label
            htmlFor="resumeName"
            className="block mb-2 font-medium text-[color:var(--color-text-primary)]"
          >
            Resume Name
          </label>

          <input
            type="text"
            id="resumeName"
            value={resumeName}
            onChange={(e) => setResumeName(e.target.value)}
            placeholder="e.g., Software Engineer Resume"
            disabled={isLoading}
            className={`w-full p-3 rounded-lg outline-none text-sm text-[color:var(--color-text-primary)] bg-[color:var(--color-background-secondary)] transition duration-200 border border-[color:var(--color-border-primary)]`}
          />
        </div>

        {/* Submit Button */}
        <div className="col-span-1 flex items-end">
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full btn-primary ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            {isLoading ? "Creating..." : "Create Resume"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateResume;
