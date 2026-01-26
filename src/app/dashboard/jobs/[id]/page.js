"use client";
import { useEffect, useState } from "react";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { useParams, useRouter } from "next/navigation";
import { fetchJobById, updateJobStatus } from "@lib/redux/features/job/thunks";
import { 
  Building2, MapPin, DollarSign, Link as LinkIcon, 
  FileText, ArrowLeft, Calendar, Save, Globe 
} from "lucide-react";
import Link from "next/link";

export default function JobDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const dispatch = useDispatch();

  const { currentJob, loading, token } = useSelector(
    (state) => ({
      currentJob: state.jobsStore.currentJob,
      loading: state.jobsStore.loading,
      token: state.auth.token
    }),
    shallowEqual
  );

  useEffect(() => {
    if (token && id) {
      dispatch(fetchJobById(id));
    }
  }, [id, token, dispatch]);

  if (loading) return <div className="p-20 text-center animate-pulse">Loading job report...</div>;
  if (!currentJob) return <div className="p-20 text-center">Job not found.</div>;

  return (
    <main className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        {/* Navigation & Actions */}
        <div className="flex justify-between items-center mb-6">
          <button 
            onClick={() => router.back()} 
            className="flex items-center gap-2 text-gray-500 hover:text-blue-600 transition-colors"
          >
            <ArrowLeft size={20} /> Back
          </button>
          <div className="flex gap-3">
            {currentJob.jobUrl && (
              <a 
                href={currentJob.jobUrl} 
                target="_blank" 
                className="btn-secondary flex items-center gap-2"
              >
                <Globe size={18} /> Visit Posting
              </a>
            )}
          </div>
        </div>

        {/* Job Header Card */}
        <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm mb-8">
          <div className="flex flex-col md:flex-row justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold text-gray-900">{currentJob.position}</h1>
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${getStatusColor(currentJob.status)}`}>
                  {currentJob.status}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-gray-600">
                <span className="flex items-center gap-2"><Building2 size={18} /> {currentJob.companyName}</span>
                <span className="flex items-center gap-2"><MapPin size={18} /> {currentJob.jobLocation}</span>
                <span className="flex items-center gap-2"><DollarSign size={18} /> {currentJob.salary || 'Competitive'}</span>
              </div>
            </div>
            <div className="text-right flex flex-col justify-end">
              <p className="text-xs text-gray-400 font-medium flex items-center gap-1 justify-end">
                <Calendar size={12} /> Listed on {new Date(currentJob.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content: Description */}
          <div className="lg:col-span-2 space-y-8">
            <section className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <FileText size={22} className="text-blue-600" /> Job Description
              </h2>
              <div className="prose prose-blue max-w-none text-gray-700 whitespace-pre-wrap leading-relaxed">
                {currentJob.jobDescription}
              </div>
            </section>

            {currentJob.notes && (
              <section className="bg-blue-50 rounded-3xl p-8 border border-blue-100">
                <h2 className="text-xl font-bold mb-4 text-blue-900">Personal Notes</h2>
                <p className="text-blue-800">{currentJob.notes}</p>
              </section>
            )}
          </div>

          {/* Sidebar: Tracking & Documents */}
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
              <h3 className="font-bold text-gray-900 mb-4">Application Management</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase ml-1">Current Status</label>
                  <select 
                    value={currentJob.status}
                    onChange={(e) => dispatch(updateJobStatus({ 
                      jobId: currentJob._id, 
                      status: e.target.value, 
                      companyName: currentJob.companyName 
                    }))}
                    className="w-full mt-1 p-3 bg-gray-50 border rounded-xl font-medium outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="applied">Applied</option>
                    <option value="pending">Pending</option>
                    <option value="interviewing">Interviewing</option>
                    <option value="offer">Offer</option>
                    <option value="declined">Declined</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>

                <div className="pt-4 border-t">
                  <label className="text-xs font-bold text-gray-400 uppercase ml-1">Associated Resume</label>
                  <div className="mt-2 flex items-center justify-between p-3 bg-blue-50 rounded-xl text-blue-700">
                    <span className="text-sm font-bold truncate">
                      {currentJob.resumeId?.name || "No Resume Linked"}
                    </span>
                    <Link href={`/dashboard/myresumes`} className="text-blue-600 hover:text-blue-800">
                      <Save size={16} />
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-3xl p-6 text-white shadow-lg shadow-blue-100">
              <h3 className="font-bold mb-2">JxH Insights</h3>
              <p className="text-blue-100 text-sm mb-4">
                This job matches your primary skills. Would you like to generate a tailored cover letter?
              </p>
              <button className="w-full py-3 bg-white text-blue-600 font-bold rounded-xl hover:bg-blue-50 transition-all">
                Tailor Documents
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

// Status style helper
function getStatusColor(status) {
  switch (status) {
    case 'interviewing': return "bg-yellow-100 text-yellow-700";
    case 'offer': return "bg-green-100 text-green-700";
    case 'rejected': return "bg-red-100 text-red-700";
    case 'declined': return "bg-gray-100 text-gray-700";
    default: return "bg-blue-100 text-blue-700";
  }
}