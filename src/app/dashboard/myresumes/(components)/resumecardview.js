"use client";
import { useRouter } from "next/navigation";
import { Edit, Eye, Download, Star, Trash, Copy, Bot, User } from "lucide-react"; 
import Loading from "./loading";

const ResumeCardView = ({ 
  resumes, 
  isLoading, 
  currentPage, 
  resumesPerPage, 
  handleMakePrimary, 
  handleDelete, 
  handleCopy, 
  handleConnectAI, 
  handleMarkProfile, // ✅ Added handler
  primaryResumeId, 
  aiResumeRef, 
  myProfileRef 
}) => {
  const router = useRouter();

  // PINNING LOGIC: Sort resumes so marked ones are always on top
  const sortedResumes = [...resumes].sort((a, b) => {
    const isAPinned = a._id === primaryResumeId || a._id === aiResumeRef || a._id === myProfileRef;
    const isBPinned = b._id === primaryResumeId || b._id === aiResumeRef || b._id === myProfileRef;
    if (isAPinned && !isBPinned) return -1;
    if (!isAPinned && isBPinned) return 1;
    return 0;
  });

  const startIndex = (currentPage - 1) * resumesPerPage;
  const paginatedResumes = sortedResumes.slice(startIndex, startIndex + resumesPerPage);

  const formatDate = (dateString) => new Date(dateString).toLocaleDateString();

  const getActionButtons = (resume, isPrimary, isAI, isProfile) => [
    {
      title: "Edit",
      icon: <Edit size={14} />,
      onClick: (e) => {
        e.stopPropagation();
        router.push(`/dashboard/myresumes/${resume._id}`);
      },
    },
    {
      title: "Preview",
      icon: <Eye size={14} />,
      onClick: (e) => {
        e.stopPropagation();
        window.open(`/dashboard/myresumes/${resume._id}`, "_blank");
      },
    },
    {
      title: "Download",
      icon: <Download size={14} />,
      onClick: (e) => {
        e.stopPropagation();
        window.location.href = `/api/resume/download/${resume._id}`;
      },
    },
    {
      title: "Copy",
      icon: <Copy size={14} />,
      onClick: (e) => {
        e.stopPropagation();
        handleCopy(resume._id, resume.name);
      },
    },
    // PROFILE CONNECTION: Hidden if already the profile
    ...(!isProfile ? [{
      title: "Set as Profile",
      icon: <User size={14} />,
      isProfileAction: true,
      onClick: (e) => {
        e.stopPropagation();
        handleMarkProfile(resume._id);
      },
    }] : []),
    // AI CONNECTION: Hidden if already connected
    ...(!isAI ? [{
      title: "Connect AI",
      icon: <Bot size={14} />,
      isAIAction: true,
      onClick: (e) => {
        e.stopPropagation();
        handleConnectAI(resume._id);
      },
    }] : []),
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
    <div className="w-full rounded-xl shadow-lg p-3 sm:p-4 bg-[color:var(--color-card-bg)] text-[color:var(--color-text-primary)]">
      <h2 className="text-lg font-semibold mb-3 px-1">Your Resumes</h2>

      {isLoading ? (<Loading />) : sortedResumes.length === 0 ? (
        <p className="italic text-center text-sm py-4 text-[color:var(--color-text-secondary)]">
          No resumes found. Create one to get started!
        </p>
      ) : (
        <ul className="divide-y border-b border-[color:var(--color-border-primary)]">
          {paginatedResumes.map((resume) => {
            const isPrimary = primaryResumeId === resume._id;
            const isAI = aiResumeRef === resume._id;
            const isProfile = myProfileRef === resume._id;
            
            return (
              <li
                key={resume._id}
                className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3 rounded-lg transition-all duration-200
                  ${(isPrimary || isAI || isProfile) ? "bg-[color:var(--color-card-hover-bg)]/40 border-l-4 border-[color:var(--color-cta-bg)]" : "bg-transparent"}
                  border-b border-[color:var(--color-border-primary)]`}
              >
                <div className="flex items-center gap-3 flex-grow min-w-0">
                  <div className="flex flex-col items-center justify-center w-6 gap-1">
                    {isProfile && <User size={14} className="text-purple-500" title="Profile Source" />}
                    {isPrimary && <Star size={14} className="text-[color:var(--color-cta-bg)]" title="Primary Resume" />}
                    {isAI && <Bot size={14} className="text-blue-500" title="AI Source" />}
                  </div>
                  
                  <div className="min-w-0">
                    <div className="text-sm font-bold truncate flex items-center gap-2">
                      {resume.name}
                      <div className="flex flex-wrap gap-1">
                        {isProfile && (
                          <span className="text-[9px] px-1.5 py-0.5 rounded-md border bg-purple-100 text-purple-700 border-purple-200 uppercase font-black">
                            Profile
                          </span>
                        )}
                        {isPrimary && (
                          <span className="text-[9px] px-1.5 py-0.5 rounded-md border bg-[color:var(--color-card-tag-bg)] text-[color:var(--color-card-tag-text)] border-[color:var(--color-border-secondary)] uppercase font-black">
                            Primary
                          </span>
                        )}
                        {isAI && (
                          <span className="text-[9px] px-1.5 py-0.5 rounded-md border bg-blue-100 text-blue-700 border-blue-200 uppercase font-black">
                            AI Source
                          </span>
                        )}
                      </div>
                    </div>
                    <p className="text-xs text-[color:var(--color-text-secondary)]">
                      Last updated: {formatDate(resume.updatedAt)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1 self-end sm:self-center flex-shrink-0">
                  {getActionButtons(resume, isPrimary, isAI, isProfile).map(
                    ({ title, icon, onClick, disabled, danger, isAIAction, isProfileAction }, idx) => (
                      <IconButton 
                        key={`${resume._id}-action-${idx}`} 
                        title={title} 
                        icon={icon} 
                        onClick={onClick} 
                        disabled={disabled} 
                        danger={danger}
                        isAIAction={isAIAction}
                        isProfileAction={isProfileAction}
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

const IconButton = ({ title, onClick, icon, danger, disabled, isAIAction, isProfileAction }) => (
  <button 
    type="button" 
    title={title} 
    onClick={!disabled ? onClick : undefined} 
    disabled={disabled} 
    className={`p-1.5 rounded-md border flex items-center justify-center transition-all
      ${disabled 
        ? "opacity-40 cursor-not-allowed bg-[color:var(--color-background-tertiary)]" 
        : danger 
          ? "text-red-500 border-red-200 hover:bg-red-50" 
          : isAIAction
            ? "text-blue-600 border-blue-200 hover:bg-blue-50"
          : isProfileAction
            ? "text-purple-600 border-purple-200 hover:bg-purple-50"
            : "text-[color:var(--color-text-secondary)] border-[color:var(--color-border-primary)] hover:bg-[color:var(--color-background-tertiary)]"
      }
    `}
  >
    {icon}
  </button>
);

export default ResumeCardView;