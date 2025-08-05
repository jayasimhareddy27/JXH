"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Toast from "../(components)/toast";
import CreateResume from "../(components)/createresume";
import SearchBar from "../(components)/searchbar";
import ResumeCardView from "../(components)/resumecardview";
import Pagination from "../(components)/pagination";

export default function ResumesPage() {
  const router = useRouter();
  const [resumes, setResumes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState({ message: "", type: "info" });
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [primaryResumeId, setPrimaryResumeId] = useState("");

  const resumesPerPage = 3;
  const filteredResumes = resumes.filter((resume) =>
    resume.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const totalPages = Math.ceil(filteredResumes.length / resumesPerPage);

  const handleCreateResume = useCallback(
    (name) => {
      setIsLoading(true);
      setTimeout(() => {
        const newResume = {
          _id: String(resumes.length + 1),
          name: name.trim(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        setResumes((prev) => [...prev, newResume]);
        setToast({
          message: `Resume "${name}" created successfully`,
          type: "success",
        });
        setIsLoading(false);
        router.push(`/dashboard/profile/edit/${newResume._id}`);
      }, 1000);
    },
    [resumes, router]
  );

  const handleMakePrimary = async (resumeId) => {
    if (resumeId === primaryResumeId) return; // already primary
    const token = localStorage.getItem("token");
    setIsLoading(true);
    try {
      const res = await fetch("/api/userreferences", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ primaryResumeId: resumeId }),
      });

      const data = await res.json();

      if (data.success) {
        setPrimaryResumeId(resumeId);
        setToast({ message: "Primary resume updated", type: "success" });
      } else {
        setToast({ message: "Failed to update primary resume", type: "error" });
      }
    } catch {
      setToast({ message: "Error updating primary resume", type: "error" });
    }
    setIsLoading(false);
  };

  const handleDelete = async (resumeId) => {
    if (!confirm("Are you sure you want to delete this resume?")) return;
    const token = localStorage.getItem("token");

    setIsLoading(true);
    try {
      const res = await fetch(`/api/resume/${resumeId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ resumeId }),
      });

      const data = await res.json();

      if (data.success) {
        setResumes((prev) => prev.filter((r) => r._id !== resumeId));
        if (primaryResumeId === resumeId) {
          setPrimaryResumeId(null);
        }
        setToast({ message: "Resume deleted successfully", type: "success" });
      } else {
        setToast({ message: "Failed to delete resume", type: "error" });
      }
    } catch {
      setToast({ message: "Error deleting resume", type: "error" });
    }
    setIsLoading(false);
  };

  // New handleCopy function
  const handleCopy = async (resumeId, resumeName) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("You must be logged in to copy a resume.");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/resume/copy", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          resumeId,
          newName: `Copy of ${resumeName}`,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setResumes((prev) => [...prev, data.newResume]);
        setToast({ message: `Copied "${resumeName}" successfully`, type: "success" });
      } else {
        alert(data.error || "Failed to copy resume.");
      }
    } catch (error) {
      alert("Error copying resume.");
      console.error(error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    const fetchResumebyuser = async (token) => {
      try {
        const res = await fetch("/api/resume", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        if (!res.ok) {
          throw new Error("Failed to fetch resumes");
        }

        const { primaryResumeId, resumes } = await res.json();
        setResumes(resumes);
        setPrimaryResumeId(primaryResumeId);
      } catch (error) {
        console.error("Error fetching resumes:", error);
      }
    };

    const token = localStorage.getItem("token");
    if (!token) window.location.href = "/login";
    else fetchResumebyuser(token);
  }, []);

  return (
    <main className="min-h-screen p-6 bg-[color:var(--color-background-primary)]">
      <Toast
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ message: "", type: "info" })}
      />
      <div className="max-w-7xl mx-auto">
        <h1 className="text-center mb-8 text-[2.25rem] font-bold text-[color:var(--color-text-primary)]">
          Manage Your Resumes
        </h1>

        <div className="grid md:grid-cols-12 items-center">
          <div className="md:col-span-5">
            <CreateResume
              isLoading={isLoading}
              handleCreateResume={handleCreateResume}
              setToast={setToast}
            />
          </div>

          <div className="md:col-span-7">
            <SearchBar setSearchQuery={setSearchQuery} setCurrentPage={setCurrentPage} />
          </div>
        </div>

        <div className="flex flex-col gap-6">
          {filteredResumes.length > 0 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              setCurrentPage={setCurrentPage}
            />
          )}

          <div className="p-6">
            <ResumeCardView
              handleMakePrimary={handleMakePrimary}
              handleDelete={handleDelete}
              handleCopy={handleCopy}
              resumes={filteredResumes}
              isLoading={isLoading}
              currentPage={currentPage}
              resumesPerPage={resumesPerPage}
              setPrimaryResumeId={setPrimaryResumeId}
              primaryResumeId={primaryResumeId}
            />
          </div>

          {filteredResumes.length > 0 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              setCurrentPage={setCurrentPage}
            />
          )}
        </div>
      </div>
    </main>
  );
}
