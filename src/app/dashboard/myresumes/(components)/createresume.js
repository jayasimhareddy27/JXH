import { useState } from "react";

const CreateResume = ({ isLoading, handleCreateResume, setToast }) => {
  const [resumeName, setResumeName] = useState("");
  const [error, setError] = useState("");

  const onSubmit = (e) => {
    e.preventDefault();
    if (!resumeName.trim()) {
      setError("Resume name is required");
      setToast({ message: "Please enter a resume name", type: "error" });
      return;
    }
    if (!window.confirm("Create a new resume with this name?")) return;
    handleCreateResume(resumeName);
    setResumeName("");
    setError("");
  };

  return (
    <div className="shadow-modal rounded-xl p-6 m-2">
      <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Column 1 */}
        <div className="col-span-1">
          <label
            htmlFor="resumeName"
            style={{ 
              display: "block",
              marginBottom: "0.5rem",
              fontWeight: "500",
              color: "var(--color-text-primary)"
            }}
          >
            Resume Name
          </label>
          <input
            type="text"
            id="resumeName"
            value={resumeName}
            onChange={(e) => {
              setResumeName(e.target.value);
              setError("");
            }}
            style={{
              width: "100%",
              padding: "0.75rem 1rem",
              borderRadius: "0.5rem",
              border: `1px solid ${error ? "var(--color-danger)" : "var(--color-border-primary)"}`,
              outline: "none",
              fontSize: "0.95rem",
              backgroundColor: "var(--color-background-secondary)",
              color: "var(--color-text-primary)",
              boxShadow: error ? "0 0 0 2px var(--color-danger)" : "none",
              transition: "border-color 0.25s ease, box-shadow 0.25s ease",
            }}
            placeholder="e.g., Software Engineer Resume"
            disabled={isLoading}
          />
          {error && (
            <p style={{ color: "var(--color-danger)", fontSize: "0.875rem", marginTop: "0.5rem" }}>
              {error}
            </p>
          )}
        </div>

        {/* Column 2 */}
        <div className="col-span-1" style={{ display: "flex", alignItems: "flex-end" }}>
          <button
            type="submit"
            disabled={isLoading}
            style={{
              width: "100%",
              padding: "0.75rem 1rem",
              backgroundColor: "var(--color-button-primary-bg)",
              color: "var(--color-text-on-primary)",
              borderRadius: "0.5rem",
              fontWeight: "600",
              cursor: isLoading ? "not-allowed" : "pointer",
              transition: "background-color 0.3s ease",
              opacity: isLoading ? 0.5 : 1,
              border: "none",
            }}
            onMouseEnter={(e) => {
              if (!isLoading) e.currentTarget.style.backgroundColor = "var(--color-button-primary-hover-bg)";
            }}
            onMouseLeave={(e) => {
              if (!isLoading) e.currentTarget.style.backgroundColor = "var(--color-button-primary-bg)";
            }}
          >
            {isLoading ? "Creating..." : "Create Resume"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateResume;
