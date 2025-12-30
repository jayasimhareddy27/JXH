const Pagination = ({ currentPage, totalPages, setCurrentPage }) => {
  return (
    <div className="flex justify-center items-center gap-2 mt-4">
      <button
        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
        disabled={currentPage === 1}
        className="px-3 py-1 rounded-md transition-colors disabled:opacity-50
                   bg-[color:var(--color-background-tertiary)]
                   hover:bg-[color:var(--color-background-primary)]
                   text-[color:var(--color-text-primary)]
                   focus:outline-none focus:ring-2 focus:ring-[color:var(--color-form-focus-ring)]"
      >
        Previous
      </button>

      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
        <button
          key={page}
          onClick={() => setCurrentPage(page)}
          className={`px-3 py-1 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-[color:var(--color-form-focus-ring)] ${
            currentPage === page
              ? "bg-[color:var(--color-button-primary-bg)] text-[color:var(--color-text-on-primary)] font-semibold shadow-md hover:bg-[color:var(--color-button-primary-hover-bg)]"
              : "bg-[color:var(--color-background-tertiary)] text-[color:var(--color-text-primary)] hover:bg-[color:var(--color-background-primary)]"
          }`}
        >
          {page}
        </button>
      ))}

      <button
        onClick={() =>
          setCurrentPage((prev) => Math.min(prev + 1, totalPages))
        }
        disabled={currentPage === totalPages}
        className="px-3 py-1 rounded-md transition-colors disabled:opacity-50
                   bg-[color:var(--color-background-tertiary)]
                   hover:bg-[color:var(--color-background-primary)]
                   text-[color:var(--color-text-primary)]
                   focus:outline-none focus:ring-2 focus:ring-[color:var(--color-form-focus-ring)]"
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
