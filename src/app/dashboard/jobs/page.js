"use client";
import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { fetchJobs, createJob } from "@lib/redux/features/job/thunks";
import { Briefcase, MapPin, DollarSign, Plus, ArrowRight, Star, Search, X, Award } from "lucide-react";
import Link from "next/link";

export default function JobBoard() {
  const dispatch = useDispatch();
  
  // UI State
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [mounted, setMounted] = useState(false);

  const { marketjobs, loading } = useSelector(
    (state) => ({
      marketjobs: state.jobsStore.marketListing, 
      loading: state.jobsStore.loading,
    }),
    shallowEqual
  );

  useEffect(() => {
    setMounted(true);
    dispatch(fetchJobs("market"));
  }, [dispatch]);

  // Real-time Filter Logic
  const filteredJobs = useMemo(() => {
    if (!marketjobs) return [];
    
    return marketjobs.filter(job => {
      const searchStr = searchTerm.toLowerCase();
      const matchesSearch = 
        job.position?.toLowerCase().includes(searchStr) || 
        job.companyName?.toLowerCase().includes(searchStr) ||
        job.skills?.some(s => s.toLowerCase().includes(searchStr));
      
      const matchesType = activeFilter === "All" || job.jobType === activeFilter;

      return matchesSearch && matchesType;
    });
  }, [marketjobs, searchTerm, activeFilter]);

  const handleAddToTracker = (job) => {
    const personalJob = {
      ...job,
      _id: undefined, // Create new record
      status: 'applied', 
      applicationDate: new Date().toISOString().split('T')[0],
    };
    dispatch(createJob(personalJob));
  };

  if (!mounted) return null; // Prevents initial flash and hydration errors

  return (
    <div className="p-8 max-w-6xl mx-auto min-h-screen bg-[var(--color-background-primary)]">
      
      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-4xl font-black text-gray-900 tracking-tight uppercase">Job Board</h1>
        <p className="text-gray-500 mt-2 text-lg italic">Track jobs directly from our partner network.</p>
      </div>

      {/* SEARCH & FILTERS */}
      <div className="mb-10 space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input 
              type="text"
              placeholder="Search roles, companies, or tech..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-2xl outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all font-medium text-sm"
            />
            {searchTerm && (
              <button onClick={() => setSearchTerm("")} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                <X size={16} />
              </button>
            )}
          </div>

          {/* Quick Filters */}
          <div className="flex items-center gap-2 p-1 bg-gray-100 rounded-2xl overflow-x-auto no-scrollbar">
            {["All", "Full-time", "Contract", "Internship"].map((type) => (
              <button
                key={type}
                onClick={() => setActiveFilter(type)}
                className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-tighter transition-all whitespace-nowrap ${
                  activeFilter === type 
                  ? "bg-white text-blue-600 shadow-sm" 
                  : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Counter - suppressHydrationWarning added for safety */}
        <p className="px-2 text-[10px] font-black uppercase text-gray-400 tracking-widest" suppressHydrationWarning>
          {filteredJobs.length} Results found
        </p>
      </div>

      {/* LISTINGS */}
      {loading === true ? (
        <div className="grid gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-40 w-full bg-gray-100 animate-pulse rounded-[2.5rem] border" />
          ))}
        </div>
      ) : filteredJobs.length === 0 ? (
        <div className="py-20 text-center border-2 border-dashed border-gray-200 rounded-[2.5rem] bg-white">
          <Briefcase className="mx-auto text-gray-200 mb-4" size={48} />
          <p className="text-gray-500 font-bold uppercase text-xs">Nothing matches your search</p>
          <button onClick={() => {setSearchTerm(""); setActiveFilter("All");}} className="mt-4 text-blue-600 font-black uppercase text-[10px] hover:underline">Reset Filters</button>
        </div>
      ) : (
        <div className="grid gap-6">
          {filteredJobs.map((job) => {
            const isFeatured = job.marketIntel?.isFeatured;
            return (
              <div 
                key={job._id} 
                className={`group relative bg-white p-6 md:p-8 rounded-[2.5rem] border transition-all flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 ${
                  isFeatured 
                  ? "border-amber-400 shadow-xl shadow-amber-50 bg-gradient-to-br from-white to-amber-50/30" 
                  : "border-gray-100 shadow-sm hover:shadow-md"
                }`}
              >
                {isFeatured && (
                  <div className="absolute -top-3 left-8 bg-amber-500 text-white text-[9px] font-black px-3 py-1 rounded-full flex items-center gap-1 uppercase tracking-tighter">
                    <Award size={10} /> Featured
                  </div>
                )}

                <div className="flex-1 space-y-4">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h2 className="text-2xl font-black text-gray-900 group-hover:text-blue-600 transition-colors tracking-tight">
                        {job.position}
                      </h2>
                      <div className="flex gap-0.5">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star key={s} size={10} className={s <= (job.marketIntel?.difficultyRating || 3) ? "fill-amber-400 text-amber-400" : "text-gray-200"} />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm font-black text-gray-400 uppercase tracking-widest">{job.companyName}</p>
                  </div>

                  {/* Skills Section */}
                  <div className="flex flex-wrap gap-2">
                    {job.skills?.slice(0, 4).map((skill) => (
                      <span key={skill} className="px-2 py-1 bg-gray-50 text-gray-500 border border-gray-100 rounded-md text-[9px] font-bold uppercase">
                        {skill}
                      </span>
                    ))}
                    {job.skills?.length > 4 && <span className="text-[9px] font-bold text-gray-300">+{job.skills.length - 4} More</span>}
                  </div>

                  {/* Logistics Section */}
                  <div className="flex flex-wrap gap-6 text-[10px] font-black text-gray-400 uppercase tracking-tight">
                    <span className="flex items-center gap-1.5"><MapPin size={14} className="text-blue-500"/> {job.jobLocation || "Remote"}</span>
                    <span className="flex items-center gap-1.5"><DollarSign size={14} className="text-emerald-500"/> {job.salary || 'Competitive'}</span>
                    <span className="flex items-center gap-1.5"><Briefcase size={14} className="text-purple-500"/> {job.jobType || 'Full-time'}</span>
                  </div>
                </div>

                <div className="flex gap-3 w-full lg:w-auto">
                  <button 
                    onClick={() => handleAddToTracker(job)}
                    className="flex-1 lg:flex-none flex items-center justify-center gap-2 bg-gray-50 hover:bg-emerald-50 text-gray-600 hover:text-emerald-700 px-6 py-4 rounded-2xl font-black text-[10px] transition-all uppercase tracking-tighter border border-transparent hover:border-emerald-100"
                  >
                    <Plus size={18} /> Track
                  </button>
                  <Link 
                    href={`/dashboard/jobs/${job._id}`}
                    className="flex-1 lg:flex-none flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-4 rounded-2xl font-black text-[10px] shadow-xl shadow-blue-100 transition-all uppercase tracking-tighter"
                  >
                    Details <ArrowRight size={18} />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}