import { useState } from "react";

export default function SearchBar({ setSearchQuery, setCurrentPage }) {
  const [query, setQuery] = useState("");

  const handleChange = (event) => {
    const value = event.target.value.trimStart();
    setQuery(value);
    setSearchQuery(value);
    setCurrentPage(1);
  };

  return (
    <div className="w-full rounded-2xl shadow-modal p-5 bg-[color:var(--color-background-secondary)]">
      <h2 className="text-2xl font-semibold text-[color:var(--color-text-primary)] mb-6 text-center">
        🔎 Search your resume with name
      </h2>

      <input
        type="text"
        placeholder="Search resumes by name..."
        value={query}
        onChange={handleChange}
        className="w-full p-2 rounded-lg border border-[color:var(--color-border-primary)] outline-none text-base text-[color:var(--color-text-primary)] bg-[color:var(--color-background-secondary)] shadow-sm transition-colors duration-200 focus:border-[color:var(--color-form-focus-ring)] focus:ring-2 focus:ring-[color:var(--color-form-focus-ring)]"
        aria-label="Search resumes by name"
      />
    </div>
  );
}
