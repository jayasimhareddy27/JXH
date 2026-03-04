import { MapPin, Briefcase, Clock, ChevronRight, DollarSign, TrendingUp, Calendar } from "lucide-react";
import { timeAgo } from "./utils.js";

export default function JobCard({ job, isSelected, onClick, showStageTag }) {
  const atsScore = 80;

  const borderClass = isSelected
    ? "border-[var(--color-button-primary-bg)] shadow-lg bg-[var(--color-card-hover-bg)]"
    : "border-[var(--color-border-secondary)] bg-[var(--color-card-bg)] hover:bg-[var(--color-card-hover-bg)] hover:shadow-md";

  return (
    <div onClick={onClick} className={`p-4 sm:p-6 rounded-2xl border transition-all cursor-pointer ${borderClass}`}>
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        {/* Left Section: Job Info + Metadata */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
            {/* Job Info */}
            <div className="flex-1 min-w-0 truncate">
              <h3 className="font-bold text-lg sm:text-xl text-[var(--color-text-primary)] truncate">{job.position}</h3>
              <p className="text-sm sm:text-base text-[var(--color-text-secondary)] font-medium truncate">{job.companyName}</p>
            </div>

            {/* ATS Score & Stage Tag */}
            <div className="flex flex-row sm:flex-col items-start sm:items-end gap-2 sm:gap-1 flex-shrink-0">
              <div className={`${atsScore > 70 ? "text-green-700" : "text-orange-700"} font-bold text-xl sm:text-2xl`}>
                {atsScore}%
              </div>
              <div className="px-2 py-0.5 rounded text-[10px] sm:text-[10px] font-bold text-[var(--color-text-primary)] text-center whitespace-nowrap">
                Match with profile
              </div>
              {showStageTag && (
                <span className="px-2.5 py-1 rounded-md bg-[var(--color-button-secondary-bg)] text-[var(--color-button-primary-bg)] text-[10px] font-bold uppercase whitespace-nowrap">
                  {job.stage}
                </span>
              )}
            </div>
          </div>

          {/* Metadata Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 mt-3 text-xs sm:text-sm text-[var(--color-text-secondary)]">
            <span className="flex items-center gap-1.5 truncate">
              <MapPin size={13} />
              {job.jobLocation || "Remote"}
            </span>
            <span className="flex items-center gap-1.5 truncate">
              <Briefcase size={13} />
              {job.jobType || "—"}
            </span>
            {job.salary && (
              <span className="flex items-center gap-1.5 truncate">
                <DollarSign size={13} />
                <span className="font-medium text-[var(--color-text-primary)]">{job.salary}</span>
              </span>
            )}
            {job.seniorityLevel && (
              <span className="flex items-center gap-1.5 truncate">
                <TrendingUp size={13} />
                {job.seniorityLevel}
              </span>
            )}
          </div>

          {/* Footer Timestamps */}
          <div className="flex flex-wrap items-center gap-3 mt-3 text-[10px] sm:text-[11px] text-[var(--color-text-secondary)]">
            <span className="flex items-center gap-1">
              <Clock size={11} />
              Posted {timeAgo(job.postedDate)}
            </span>
            {job.applicationDate && (
              <span className="flex items-center gap-1">
                <Calendar size={11} />
                {job.stage} {timeAgo(job.applicationDate)}
              </span>
            )}
          </div>
        </div>

        {/* Chevron */}
        <ChevronRight
          size={20}
          className={`flex-shrink-0 mt-2 sm:mt-1 transition-colors ${
            isSelected ? "text-[var(--color-button-primary-bg)]" : "text-[var(--color-text-secondary)]"
          }`}
        />
      </div>
    </div>
  );
}
