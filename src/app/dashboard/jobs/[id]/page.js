"use client";
import { useEffect } from "react";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { useParams, useRouter } from "next/navigation";
import { fetchJobById, updateJobStatus } from "@lib/redux/features/job/thunks";
import { 
  Building2, MapPin, DollarSign, Globe, 
  FileText, ArrowLeft, Calendar, Save, 
  Briefcase, GraduationCap, ShieldCheck, Info,
  Zap, Heart, Code2, Users, Laptop, Target
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

  if (loading) return <div className="p-20 text-center animate-pulse text-gray-500 font-medium">Analyzing Job Data...</div>;
  if (!currentJob) return <div className="p-20 text-center text-gray-500">Job not found.</div>;

  // Helper to extract keywords like Python, Qlik, etc. for the "Smart Action" box
  const technicalSkills = currentJob.aiDescription?.match(/(Python|Qlik|Tableau|SAS|SQL|Excel|R|LLM|AI)/gi) || [];
  const uniqueSkills = [...new Set(technicalSkills)].slice(0, 3);

  return (
    <main className="min-h-screen p-4 md:p-8">
      <div className="max-w-6xl mx-auto">

        {/* Header Section */}
        <div className="bg-white rounded-[2rem] p-6 md:p-10 border border-gray-100 shadow-sm mb-6">
          <div className="flex flex-col md:flex-row justify-between items-start gap-6">
            <div className="space-y-4 w-full">
              <div className="flex flex-wrap gap-2">
                {currentJob.jobType && (
                  <span className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-[10px] font-black uppercase tracking-wider">
                    {currentJob.jobType}
                  </span>
                )}
                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${getStatusColor(currentJob.status)}`}>
                  {currentJob.status}
                </span>
                {currentJob.rawDescription?.toLowerCase().includes('hybrid') && (
                  <span className="px-3 py-1 bg-orange-50 text-orange-700 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
                    <Laptop size={12} /> Hybrid
                  </span>
                )}
              </div>
              
              <h1 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tight">
                {currentJob.position}
              </h1>

              <div className="flex flex-wrap items-center gap-y-3 gap-x-6 text-gray-600">
                <div className="flex items-center gap-2 font-bold">
                  <Building2 size={20} className="text-indigo-500" />
                  {currentJob.companyName}
                </div>
                <div className="flex items-center gap-2 font-medium">
                  <MapPin size={20} className="text-gray-400" />
                  {currentJob.jobLocation}
                </div>
                {currentJob.salary && (
                  <div className="flex items-center gap-2 font-medium">
                    <DollarSign size={20} className="text-green-500" />
                    <span className="text-gray-900 font-bold">{currentJob.salary}</span>
                  </div>
                )}
              </div>
            </div>
            
            {currentJob.jobUrl && (
              <a href={currentJob.jobUrl} target="_blank" className="w-full md:w-auto px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white text-center font-bold rounded-2xl shadow-lg transition-all active:scale-95">
                Apply Now
              </a>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column: Details (8 Cols) */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Quick Stats Grid - Fully Dynamic */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatItem 
                icon={<Zap size={18}/>} 
                title="Experience" 
                value={currentJob.requirements?.find(r => r.includes('Year')) || currentJob.seniorityLevel || "Not Specified"} 
              />
              <StatItem 
                icon={<GraduationCap size={18}/>} 
                title="Education" 
                value={currentJob.rawDescription?.match(/Bachelor|Master|PhD|GED/i)?.[0] || "See Desc."} 
              />
              <StatItem 
                icon={<Target size={18}/>} 
                title="Level" 
                value={currentJob.seniorityLevel || "Standard"} 
              />
              <StatItem 
                icon={<Calendar size={18}/>} 
                title="Posted" 
                value={currentJob.postedDate ? new Date(currentJob.postedDate).toLocaleDateString() : "Recent"} 
              />
            </div>

            {/* AI Insights / Business Context */}
            {currentJob.businessModel && (
              <section className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-[2rem] p-8 text-white shadow-xl">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Code2 size={22} className="text-indigo-200" /> Business Intelligence
                </h2>
                <p className="text-indigo-50 leading-relaxed text-lg font-medium">
                  {currentJob.businessModel}
                </p>
              </section>
            )}

            {/* Responsibilities */}
            <section className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm">
              <h2 className="text-2xl font-black mb-6 text-gray-900 flex items-center gap-3">
                <FileText className="text-indigo-600" /> Detailed Breakdown
              </h2>
              <div className="space-y-5">
                {currentJob.aiDescription?.split('\n').filter(l => l.trim()).map((line, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="mt-1.5 w-5 h-5 rounded-full bg-indigo-50 flex items-center justify-center shrink-0">
                      <div className="w-1.5 h-1.5 rounded-full bg-indigo-600" />
                    </div>
                    <p className="text-gray-700 leading-relaxed font-medium">
                      {line.replace(/^- /, '')}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Right Column: Sidebar (4 Cols) */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Status Management */}
            <div className="bg-white rounded-[2rem] p-6 border border-gray-100 shadow-sm">
              <h3 className="font-black text-gray-900 mb-6 flex items-center gap-2 uppercase tracking-tighter text-sm">
                <Briefcase size={18} className="text-indigo-500" /> Pipeline Status
              </h3>
              <div className="space-y-4">
                <select 
                  value={currentJob.status}
                  onChange={(e) => dispatch(updateJobStatus({ 
                    jobId: currentJob._id, 
                    status: e.target.value, 
                    companyName: currentJob.companyName 
                  }))}
                  className="w-full p-4 bg-gray-50 border-2 border-transparent focus:border-indigo-500 rounded-2xl font-bold text-gray-700 outline-none transition-all appearance-none cursor-pointer"
                >
                  <option value="saved">Saved</option>
                  <option value="applied">Applied</option>
                  <option value="interviewing">Interviewing</option>
                  <option value="offer">Offer</option>
                  <option value="rejected">Rejected</option>
                </select>
                
                <div className="p-4 bg-indigo-50 rounded-2xl border border-indigo-100">
                   <p className="text-[10px] font-black text-indigo-400 uppercase mb-1">Created On</p>
                   <p className="text-sm font-bold text-indigo-700">
                     {new Date(currentJob.createdAt).toLocaleDateString(undefined, { dateStyle: 'long' })}
                   </p>
                </div>
              </div>
            </div>

            {/* Perks Section - Dynamic from Array */}
            {currentJob.perks?.length > 0 && (
              <div className="bg-white rounded-[2rem] p-6 border border-gray-100 shadow-sm">
                <h3 className="font-black text-gray-900 mb-4 flex items-center gap-2 uppercase tracking-tighter text-sm">
                  <Heart size={18} className="text-rose-500" /> Benefits
                </h3>
                <div className="flex flex-wrap gap-2">
                  {currentJob.perks.map((perk, i) => (
                    <span key={i} className="px-3 py-1.5 bg-gray-50 text-gray-600 text-[11px] font-bold rounded-lg border border-gray-100">
                      {perk}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Culture Insight */}
            {currentJob.companyInsights && (
              <div className="bg-amber-50 rounded-[2rem] p-6 border border-amber-100">
                <h3 className="font-black text-amber-900 mb-2 flex items-center gap-2 text-sm">
                  <Info size={18} /> Company Culture
                </h3>
                <p className="text-sm text-amber-800 leading-relaxed font-medium">
                  {currentJob.companyInsights}
                </p>
              </div>
            )}

            {/* Smart Action - Dynamically suggesting based on skills found in text */}
            <div className="bg-black rounded-[2rem] p-8 text-white">
              <h3 className="text-xl font-bold mb-2 italic">Tailor Your Pitch</h3>
              <p className="text-gray-400 text-sm mb-6 leading-relaxed">
                This role emphasizes {uniqueSkills.length > 0 ? <b>{uniqueSkills.join(', ')}</b> : 'specific technical skills'}. 
                Want to highlight these in your resume?
              </p>
              <button className="w-full py-4 bg-white text-black font-black rounded-xl hover:bg-indigo-50 transition-all active:scale-95">
                Tailor Resume
              </button>
            </div>

          </div>
        </div>
      </div>
    </main>
  );
}

function StatItem({ icon, title, value }) {
  return (
    <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
      <div className="text-indigo-500 mb-2">{icon}</div>
      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{title}</p>
      <p className="text-sm font-black text-gray-800 truncate" title={value}>{value}</p>
    </div>
  );
}

function getStatusColor(status) {
  switch (status) {
    case 'interviewing': return "bg-amber-100 text-amber-700";
    case 'offer': return "bg-emerald-100 text-emerald-700";
    case 'rejected': return "bg-rose-100 text-rose-700";
    case 'applied': return "bg-blue-100 text-blue-700";
    default: return "bg-gray-100 text-gray-700";
  }
}