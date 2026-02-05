"use client";
import { useRouter } from "next/navigation";
import { Edit, Eye, Star, Trash, Copy, FileText } from "lucide-react"; 
import Loading from "../(mycoverletters)/loading"; // Ensure path matches your loading component

const CoverLetterCardView = ({ 
  letters, 
  isLoading, 
  handleDelete, 
  handleCopy, 
  primaryId 
}) => {
  const router = useRouter();

  const formatDate = (dateString) => new Date(dateString).toLocaleDateString();

  const getActionButtons = (letter, isPrimary) => [
    {
      title: "Edit Design",
      icon: <Edit size={14} />,
      onClick: (e) => {
        e.stopPropagation();
        router.push(`/editor/cl/${letter._id}`);
      },
    },
    {
      title: "Preview",
      icon: <Eye size={14} />,
      onClick: (e) => {
        e.stopPropagation();
        window.open(`/editor/cl/${letter._id}`, "_blank");
      },
    },
    {
      title: "Copy",
      icon: <Copy size={14} />,
      onClick: (e) => {
        e.stopPropagation();
        handleCopy(letter._id, letter.name);
      },
    },
    {
      title: "Delete",
      disabled: isPrimary,
      danger: true,
      icon: <Trash size={14} />,
      onClick: (e) => {
        e.stopPropagation();
        handleDelete(letter._id);
      },
    },
  ];

  return (
    <div className="w-full rounded-xl p-3 sm:p-4 bg-[color:var(--color-card-bg)] text-[color:var(--color-text-primary)]">
      {isLoading ? (
        <Loading />
      ) : letters.length === 0 ? (
        <p className="italic text-center text-sm py-8 text-[color:var(--color-text-secondary)]">
          No cover letters found.
        </p>
      ) : (
        <ul className="divide-y border-t border-b border-[color:var(--color-border-primary)]">
          {letters.map((letter) => {
            const isPrimary = primaryId === letter._id;
            
            return (
              <li
                key={letter._id}
                className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 transition-all duration-200
                  ${isPrimary ? "bg-[color:var(--color-card-hover-bg)]/40 border-l-4 border-[color:var(--color-cta-bg)]" : "bg-transparent"}
                  hover:bg-[color:var(--color-background-tertiary)]/30`}
              >
                <div className="flex items-center gap-4 flex-grow min-w-0">
                  <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-blue-100 text-blue-600">
                    <FileText size={20} />
                  </div>
                  
                  <div className="min-w-0">
                    <div className="text-sm font-bold truncate flex items-center gap-2">
                      {letter.name}
                      {isPrimary && (
                        <span className="text-[9px] px-1.5 py-0.5 rounded-md border bg-[color:var(--color-card-tag-bg)] text-[color:var(--color-card-tag-text)] border-[color:var(--color-border-secondary)] uppercase font-black">
                          Primary Template
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[color:var(--color-text-secondary)]">
                      Last modified: {formatDate(letter.updatedAt)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1 self-end sm:self-center flex-shrink-0">
                  {getActionButtons(letter, isPrimary).map(
                    ({ title, icon, onClick, disabled, danger }, idx) => (
                      <IconButton 
                        key={`${letter._id}-action-${idx}`} 
                        title={title} 
                        icon={icon} 
                        onClick={onClick} 
                        disabled={disabled} 
                        danger={danger}
                      />
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

// Reusable IconButton (Mirroring your Resume setup)
const IconButton = ({ title, onClick, icon, danger, disabled }) => (
  <button 
    type="button" 
    title={title} 
    onClick={!disabled ? onClick : undefined} 
    disabled={disabled} 
    className={`p-2 rounded-md border flex items-center justify-center transition-all
      ${disabled 
        ? "opacity-30 cursor-not-allowed bg-gray-100" 
        : danger 
          ? "text-red-500 border-red-200 hover:bg-red-50" 
          : "text-[color:var(--color-text-secondary)] border-[color:var(--color-border-primary)] hover:bg-[color:var(--color-background-secondary)]"
      }
    `}
  >
    {icon}
  </button>
);

export default CoverLetterCardView;