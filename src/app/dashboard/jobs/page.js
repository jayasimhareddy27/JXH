"use client";
import { useEffect } from "react";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { fetchJobs, createJob } from "@lib/redux/features/job/thunks";
import { Briefcase, MapPin, DollarSign, Plus, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function JobBoard() {
  const dispatch = useDispatch();
  
  // Updated to use the new split state structure: marketListing
  const { marketjobs, loading } = useSelector(
    (state) => ({
      marketjobs: state.jobsStore.marketListing, 
      loading: state.jobsStore.loading,
    }),
    shallowEqual
  );

  useEffect(() => {
    // Explicitly fetching the "market" mode for the public board
    dispatch(fetchJobs("market"));
  }, [dispatch]);

  const handleAddToTracker = (job) => {
    // Cloning market data into user's personal tracking model
    const personalJob = {
      companyName: job.companyName,
      position: job.position,
      jobDescription: job.jobDescription,
      jobLocation: job.jobLocation || "Not Specified",
      salary: job.salary || "Competitive",
      status: 'applied', // Initial state for user tracker
    };

    // This will trigger the success toast we set up in the thunk
    dispatch(createJob(personalJob));
  };

  return (
    <div className="p-8 max-w-6xl mx-auto min-h-screen bg-[color:var(--color-background-primary)]">
      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Explore Opportunities</h1>
          <p className="text-gray-500 mt-2 text-lg">Direct listings from JxH partner companies.</p>
        </div>
        <div className="text-sm font-medium text-blue-600 bg-blue-50 px-4 py-2 rounded-full">
          {marketjobs?.length || 0} Openings Found
        </div>
      </div>

      {loading === true ? (
        <div className="grid gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-32 w-full bg-gray-100 animate-pulse rounded-2xl border" />
          ))}
        </div>
      ) : marketjobs?.length === 0 ? (
        <div className="border-2 border-dashed rounded-3xl p-20 text-center bg-white shadow-sm">
          <Briefcase className="mx-auto text-gray-300 mb-4" size={48} />
          <p className="text-xl font-semibold text-gray-600">Market listings are coming soon.</p>
          <p className="text-sm text-gray-400 mt-1">Check back later for curated company-posted opportunities.</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {marketjobs.map((job) => (
            <div key={job._id} className="group bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:border-blue-200 transition-all flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                    {job.position}
                  </h2>
                  {job.isHot && (
                    <span className="bg-orange-100 text-orange-700 text-[10px] font-black px-2 py-0.5 rounded uppercase">Hot</span>
                  )}
                </div>
                <p className="text-lg font-medium text-gray-700 mb-4">{job.companyName}</p>
                
                <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                  <span className="flex items-center gap-1"><MapPin size={16} className="text-gray-400"/> {job.jobLocation || "Remote"}</span>
                  <span className="flex items-center gap-1"><DollarSign size={16} className="text-gray-400"/> {job.salary || 'Competitive'}</span>
                </div>
              </div>

              <div className="flex gap-3 w-full md:w-auto">
                <button 
                  onClick={() => handleAddToTracker(job)}
                  title="Add to my personal tracker"
                  className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-gray-50 hover:bg-blue-50 text-gray-700 hover:text-blue-700 px-5 py-3 rounded-xl font-bold transition-all border border-transparent hover:border-blue-100"
                >
                  <Plus size={18} /> <span className="md:hidden lg:inline">Track</span>
                </button>
                <Link 
                  href={`/dashboard/jobs/${job._id}`}
                  className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl font-bold shadow-lg shadow-blue-100 transition-all hover:-translate-y-0.5 active:translate-y-0"
                >
                  View Details <ArrowRight size={18} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}