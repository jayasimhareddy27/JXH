import { useState } from "react";

const SearchBar = ({ setSearchQuery, setCurrentPage }) => {
  const [query, setQuery] = useState("");

  const handleChange = (e) => {
    setQuery(e.target.value);
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset to first page on search
  };

  return (
    <div
      style={{
        width: "100%",
        borderRadius: "1rem",
        boxShadow: "0 4px 10px rgba(0, 91, 187, 0.1), 0 2px 5px rgba(30, 144, 255, 0.08)",
        padding: "0.75rem",
        backgroundColor: "var(--color-background-secondary)",
      }}
    >
      <h2
        style={{
          fontSize: "1.5rem",
          fontWeight: "600",
          color: "var(--color-text-primary)",
          marginBottom: "1.5rem",
          textAlign: "center",
        }}
      >
        🔎 Search your resume with name
      </h2>

      <input
        type="text"
        placeholder="Search resumes by name..."
        value={query}
        onChange={handleChange}
        style={{
          width: "100%",
          padding: "0.5rem 0.75rem",
          borderRadius: "0.5rem",
          border: `1px solid var(--color-border-primary)`,
          outline: "none",
          fontSize: "1rem",
          color: "var(--color-text-primary)",
          backgroundColor: "var(--color-background-secondary)",
          boxShadow: "0 1px 2px rgba(0, 0, 0, 0.04)",
          transition: "border-color 0.25s ease",
        }}
        onFocus={(e) => {
          e.currentTarget.style.borderColor = "var(--color-form-focus-ring)";
          e.currentTarget.style.boxShadow = "0 0 0 2px var(--color-form-focus-ring)";
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = "var(--color-border-primary)";
          e.currentTarget.style.boxShadow = "none";
        }}
      />
    </div>
  );
};

export default SearchBar;
