"use client";
import { useRouter } from "next/navigation";
import { Edit, Eye, Download, Star, Trash, Copy } from "lucide-react";

const ResumeCardView = ({
  resumes,
  isLoading,
  currentPage,
  resumesPerPage,
  handleMakePrimary,
  handleDelete,
  handleCopy,
  primaryResumeId,
}) => {
  const router = useRouter();
  const startIndex = (currentPage - 1) * resumesPerPage;
  const paginatedResumes = resumes.slice(startIndex, startIndex + resumesPerPage);

  const formatDate = (dateString) => new Date(dateString).toLocaleDateString();

  return (
    <div
      className="w-full rounded-xl shadow-lg p-3 sm:p-4"
      style={{
        backgroundColor: "var(--color-card-bg)",
        color: "var(--color-text-primary)",
      }}
    >
      <h2
        className="text-lg font-semibold mb-3 px-1"
        style={{ color: "var(--color-text-primary)" }}
      >
        Your Resumes
      </h2>

      {isLoading ? (
        <div className="flex justify-center py-6">
          <div
            className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2"
            style={{
              borderColor: "var(--color-button-primary-bg)",
              borderBottomColor: "transparent",
              borderTopColor: "var(--color-button-primary-bg)",
            }}
          />
        </div>
      ) : resumes.length === 0 ? (
        <p
          className="italic text-center text-sm py-4"
          style={{ color: "var(--color-text-secondary)" }}
        >
          No resumes found. Create one to get started!
        </p>
      ) : (
        <ul
          className="divide-y"
          style={{ borderColor: "var(--color-border-primary)" }}
        >
          {paginatedResumes.map((resume) => {
            const isPrimary = primaryResumeId === resume._id;
            return (
              <li
                key={resume._id}
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3 rounded-lg transition-all duration-200"
                style={{
                  backgroundColor: isPrimary
                    ? "var(--color-card-hover-bg)"
                    : "transparent",
                  borderBottom: "1px solid var(--color-border-primary)",
                }}
              >
                {/* Left Section */}
                <div className="flex items-center gap-3 flex-grow min-w-0">
                  {isPrimary && (
                    <Star
                      size={16}
                      title="Primary Resume"
                      style={{ color: "#FBBF24" }} // Yellow 500 (you can define a CSS var if you want)
                    />
                  )}
                  <div className="min-w-0">
                    <p
                      className="text-sm font-medium truncate flex items-center gap-2"
                      title={resume.name}
                      style={{ color: "var(--color-text-primary)" }}
                    >
                      {resume.name}
                      {isPrimary && (
                        <span
                          className="text-xs px-1.5 py-0.5 rounded-md border"
                          style={{
                            backgroundColor: "var(--color-card-tag-bg)",
                            color: "var(--color-card-tag-text)",
                            borderColor: "var(--color-border-secondary)",
                          }}
                        >
                          Primary
                        </span>
                      )}
                    </p>
                    <p
                      className="text-xs"
                      style={{ color: "var(--color-text-secondary)" }}
                    >
                      Last updated: {formatDate(resume.updatedAt)}
                    </p>
                  </div>
                </div>

                {/* Right Section */}
                <div className="flex items-center gap-1 self-end sm:self-center flex-shrink-0">
                  <IconButton
                    title="Edit"
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(`/dashboard/profile/edit/${resume._id}`);
                    }}
                    icon={<Edit size={14} />}
                  />
                  <IconButton
                    title="Preview"
                    onClick={(e) => {
                      e.stopPropagation();
                      window.open(`/dashboard/profile/preview/${resume._id}`, "_blank");
                    }}
                    icon={<Eye size={14} />}
                  />
                  <IconButton
                    title="Download"
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(`/api/resume/download/${resume._id}`);
                    }}
                    icon={<Download size={14} />}
                  />
                  <IconButton
                    title="Copy"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCopy(resume._id, resume.name);
                    }}
                    icon={<Copy size={14} />}
                  />
                  <IconButton
                    title="Make Primary"
                    disabled={isPrimary}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMakePrimary(resume._id);
                    }}
                    icon={<Star size={14} />}
                  />
                  <IconButton
                    title="Delete"
                    disabled={isPrimary}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(resume._id);
                    }}
                    icon={<Trash size={14} />}
                    danger
                  />
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

const IconButton = ({ title, onClick, icon, danger, disabled }) => (
  <button
    type="button"
    title={title}
    onClick={!disabled ? onClick : undefined}
    disabled={disabled}
    aria-disabled={disabled}
    className={`p-1.5 rounded-md border flex items-center justify-center transition-all
      ${
        disabled
          ? danger
            ? "text-red-300 border-red-100 bg-red-50 cursor-not-allowed opacity-50"
            : "text-gray-400 border-gray-200 bg-gray-100 cursor-not-allowed opacity-50"
          : danger
          ? "text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 cursor-pointer"
          : "text-gray-600 border-gray-200 hover:bg-gray-50 cursor-pointer"
      }
    `}
  >
    {icon}
  </button>
);

export default ResumeCardView;
