const Pagination = ({ currentPage, totalPages, setCurrentPage }) => {
  return (
    <div className="flex justify-center items-center space-x-2 mt-4">
      <button
        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
        disabled={currentPage === 1}
        className="px-3 py-1 bg-gray-200 rounded-lg disabled:opacity-50 hover:bg-gray-300 transition-colors"
      >
        Previous
      </button>
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
        <button
          key={page}
          onClick={() => setCurrentPage(page)}
          className={`px-3 py-1 rounded-lg ${
            currentPage === page ? "bg-blue-600 text-white" : "bg-gray-200 hover:bg-gray-300"
          } transition-colors`}
        >
          {page}
        </button>
      ))}
      <button
        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
        disabled={currentPage === totalPages}
        className="px-3 py-1 bg-gray-200 rounded-lg disabled:opacity-50 hover:bg-gray-300 transition-colors"
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;