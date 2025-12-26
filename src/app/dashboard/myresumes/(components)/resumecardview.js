"use client";
import { useRouter } from "next/navigation";
import { Edit, Eye, Download, Star, Trash, Copy } from "lucide-react";
import Loading from "./loading";

const ResumeCardView = ({  resumes,  isLoading,  currentPage,  resumesPerPage,  handleMakePrimary,  handleDelete,  handleCopy,  primaryResumeId,}) => {
  const router = useRouter();
  const startIndex = (currentPage - 1) * resumesPerPage;
  const paginatedResumes = resumes.slice(startIndex, startIndex + resumesPerPage);

  const formatDate = (dateString) => new Date(dateString).toLocaleDateString();
  
  const getActionButtons = (resume, isPrimary) => [
    {
      title: "Edit",
      icon: <Edit size={14} />,
      disabled: false,
      onClick: (e) => {
        e.stopPropagation();
        router.push(`/dashboard/myresumes/${resume._id}`);
      },
    },
    {
      title: "Preview",
      icon: <Eye size={14} />,
      disabled: false,
      onClick: (e) => {
        e.stopPropagation();
        window.open(`/dashboard//myresumes/${resume._id}`, "_blank");
      },
    },
    {
      title: "Download",
      icon: <Download size={14} />,
      disabled: false,
      onClick: (e) => {
        e.stopPropagation();
        window.location.href = `/api/resume/download/${resume._id}`;
      },
    },
    {
      title: "Copy",
      icon: <Copy size={14} />,
      disabled: false,
      onClick: (e) => {
        e.stopPropagation();
        handleCopy(resume._id, resume.name);
      },
    },
    {
      title: "Make Primary",
      icon: <Star size={14} />,
      disabled: isPrimary,
      onClick: (e) => {
        e.stopPropagation();
        handleMakePrimary(resume._id);
      },
    },
    {
      title: "Delete",
      disabled: isPrimary,
      danger: true,
      icon: <Trash size={14} />,
      onClick: (e) => {
        e.stopPropagation();
        handleDelete(resume._id);
      },
    },
  ];
  

  return (
    <div className="w-full rounded-xl shadow-lg p-3 sm:p-4  bg-[color:var(--color-card-bg)]  text-[color:var(--color-text-primary)]">
      <h2 className="text-lg font-semibold mb-3 px-1  text-[color:var(--color-text-primary)]">
        Your Resumes
      </h2>

      {isLoading ? (  <Loading />) : resumes.length === 0 ? (
        <p  className="italic text-center text-sm py-4 text-[color:var(--color-text-secondary)]">
          No resumes found. Create one to get started!
        </p>
      ) : (
        <ul  className="divide-y border-b border-[color:var(--color-border-primary)]">
          {paginatedResumes.map((resume) => {
            const isPrimary = primaryResumeId === resume._id;
            return (
              <li
                key={resume._id}
                className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3 rounded-lg transition-all duration-200
                  ${  isPrimary  ? "bg-[color:var(--color-card-hover-bg)]"  : "bg-transparent"}
                  border-b border-[color:var(--color-border-primary)]`}
              >
                {/* Left Section */}
                <div className="flex items-center gap-3 flex-grow min-w-0">
                  {isPrimary && (
                    <Star  size={16}  title="Primary Resume"  className="text-[color:var(--color-cta-bg)]"/>
                  )}
                  <div className="min-w-0">
                    <p  className="text-sm font-medium truncate flex items-center gap-2    text-[color:var(--color-text-primary)]"  title={resume.name}>
                      {resume.name}
                      {isPrimary && (
                        <span  className="  text-xs px-1.5 py-0.5 rounded-md border  bg-[color:var(--color-card-tag-bg)]  
                          text-[color:var(--color-card-tag-text)]  border-[color:var(--color-border-secondary)]">
                          Primary
                        </span>
                      )}
                    </p>
                    <p  className="text-xs text-[color:var(--color-text-secondary)]">
                      Last updated: {formatDate(resume.updatedAt)}
                    </p>
                  </div>
                </div>

                {/* Right Section */}
                <div className="flex items-center gap-1 self-end sm:self-center flex-shrink-0">
                  {getActionButtons(resume, isPrimary).map(
                    ({ title, icon, onClick, disabled, danger }, idx) => (
                      <IconButton key={`${resume._id}-action-${idx}`} title={title}  icon={icon}  onClick={onClick}  disabled={disabled}  danger={danger}/>
                    )
                  )}
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
  <button type="button" title={title} onClick={!disabled ? onClick : undefined} disabled={disabled} aria-disabled={disabled}
    className={`p-1.5 rounded-md border flex items-center justify-center transition-all
      ${
        disabled
          ? danger
            ? "text-[color:var(--color-danger)] border-[color:var(--color-danger-hover)] bg-[color:var(--color-danger-hover)] cursor-not-allowed opacity-50"
            : "text-[color:var(--color-border-secondary)] border-[color:var(--color-border-secondary)] bg-[color:var(--color-background-tertiary)] cursor-not-allowed opacity-50"
          : danger
          ? "text-[color:var(--color-danger)] border-[color:var(--color-danger-hover)] hover:bg-[color:var(--color-danger-hover)] hover:text-[color:var(--color-danger)] cursor-pointer"
          : "text-[color:var(--color-text-secondary)] border-[color:var(--color-border-primary)] hover:bg-[color:var(--color-background-tertiary)] cursor-pointer"
      }
    `}
  >
    {icon}
  </button>
);

export default ResumeCardView;
