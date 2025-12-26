"use client";

import React from "react";
import { useSelector } from "react-redux";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

const PinnedResumeRow = ({ resume, label, tag, isActive }) => {
  if (!resume) return null;

  return (
    <div
      className={`flex items-center justify-between px-4 py-3 text-sm
      ${isActive ? "bg-blue-50" : ""}
      hover:bg-[color:var(--color-card-bg)] transition`}
    >
      <div className="flex items-center gap-4 min-w-0">
        <div className="w-[90px] shrink-0 text-[10px] uppercase font-bold text-blue-600">
          {label}
          <div className="text-[9px] font-medium text-[color:var(--color-text-secondary)] opacity-70">
            {tag}
          </div>
        </div>

        <span className="truncate font-medium text-[color:var(--color-text-primary)]">
          {resume.name || "My Profile"}
        </span>
      </div>

      <Link
        href={`/dashboard/myresumes/${resume._id}`}
        className="text-blue-600 hover:text-blue-800"
      >
        <ArrowRight size={16} />
      </Link>
    </div>
  );
};

const PinnedResumesList = () => {
  const { allResumes, myProfileRef, primaryResumeId, aiResumeRef } =
    useSelector((state) => state.resumes);

  const findResume = (ref) => {
    const id = typeof ref === "object" ? ref?._id : ref;
    return allResumes?.find((r) => r._id === id);
  };


  const items = [
    {
      resume: findResume(myProfileRef),
      label: "Profile",
      tag: "Main",
    },
    {
      resume: findResume(primaryResumeId),
      label: "Primary",
      tag: "Active",
      isActive: true,
    },
    {
      resume: findResume(aiResumeRef),
      label: "AI",
      tag: "Reference",
    },
  ].filter((i) => i.resume);

  if (!items.length) return null;

  return (
    <div className="w-full border border-[color:var(--color-border-primary)] divide-y">
      {items.map((item) => (
        <PinnedResumeRow key={item.resume._id} {...item} />
      ))}
    </div>
  );
};

export default PinnedResumesList;
