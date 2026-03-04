"use client";
import { useEffect } from "react";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { useParams, useRouter } from "next/navigation";
import { fetchJobById, updateJob } from "@lib/redux/features/job/thunks";
import { 
  Building2, MapPin, DollarSign, Globe, 
  FileText, ArrowLeft, Calendar, 
  Briefcase, GraduationCap, Info,
  Zap, Heart, Code2, Laptop
} from "lucide-react";

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

  if (loading) return (
    <div className="p-20 text-center animate-pulse text-[var(--color-text-secondary)] font-medium bg-[var(--color-background-primary)] min-h-screen">
      Analyzing Job Data...
    </div>
  );
  
  if (!currentJob) return (
    <div className="p-20 text-center text-[var(--color-text-secondary)] bg-[var(--color-background-primary)] min-h-screen">
      Job not found.
    </div>
  );

  return (
    <main className="min-h-screen p-4 md:p-8 bg-[var(--color-background-primary)]">
      <div className="max-w-6xl mx-auto">

        {/* Header Section */}
        <div className="bg-[var(--color-background-secondary)] rounded-[2rem] p-6 md:p-10 border border-[var(--color-border-secondary)] shadow-sm mb-6">
          <div className="flex flex-col md:flex-row justify-between items-start gap-6">
            <div className="space-y-4 w-full">
              <div className="flex flex-wrap gap-2">
                {currentJob.jobType && (
                  <span className="px-3 py-1 bg-[var(--color-button-secondary-bg)] text-[var(--color-button-primary-bg)] rounded-full text-[10px] font-black uppercase tracking-wider">
                    {currentJob.jobType}
                  </span>
                )}
                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${getStatusColor(currentJob.status)}`}>
                  {currentJob.status}
                </span>
                {currentJob.rawDescription?.toLowerCase().includes('hybrid') && (
                  <span className="px-3 py-1 bg-[var(--color-background-tertiary)] text-[var(--color-text-secondary)] rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
                    <Laptop size={12} /> Hybrid
                  </span>
                )}
              </div>
              
              <h1 className="text-3xl md:text-5xl font-black text-[var(--color-text-primary)] tracking-tight">
                {currentJob.position}
              </h1>

              <div className="flex flex-wrap items-center gap-y-3 gap-x-6 text-[var(--color-text-secondary)]">
                <div className="flex items-center gap-2 font-bold">
                  <Building2 size={20} className="text-[var(--color-button-primary-bg)]" />
                  {currentJob.companyName}
                </div>
                <div className="flex items-center gap-2 font-medium">
                  <MapPin size={20} className="text-[var(--color-text-placeholder)]" />
                  {currentJob.jobLocation}
                </div>
                {currentJob.salary && (
                  <div className="flex items-center gap-2 font-medium">
                    <DollarSign size={20} className="text-[var(--color-button-primary-bg)]" />
                    <span className="text-[var(--color-text-primary)] font-bold">{currentJob.salary}</span>
                  </div>
                )}
              </div>
            </div>
            
            {/* Action Buttons Group */}
            <div className="flex flex-col gap-3 w-full md:w-auto">
              {currentJob.jobUrl && (
                <a 
                  href={currentJob.jobUrl} 
                  target="_blank" 
                  className="px-8 py-4 bg-[var(--color-button-primary-bg)] hover:bg-[var(--color-button-primary-hover-bg)] text-[var(--color-text-on-primary)] text-center font-bold rounded-2xl shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2"
                >
                  <Globe size={18} /> Apply Now
                </a>
              )}
              
              <div className="flex flex-col gap-2">
                <button 
                  onClick={() => router.push(`/dashboard/resumes/new?jobId=${currentJob._id}`)}
                  className="px-6 py-3 bg-[var(--color-text-primary)] text-[var(--color-text-inverse)] hover:opacity-90 text-sm font-bold rounded-xl transition-all flex items-center justify-center gap-2"
                >
                  <Zap size={16} className="text-yellow-400" /> Tailor Resume
                </button>
                
                <button 
                  onClick={() => router.push(`/dashboard/cover-letters/new?jobId=${currentJob._id}`)}
                  className="px-6 py-3 bg-[var(--color-background-secondary)] border-2 border-[var(--color-text-primary)] text-[var(--color-text-primary)] hover:bg-[var(--color-background-tertiary)] text-sm font-bold rounded-xl transition-all flex items-center justify-center gap-2"
                >
                  <FileText size={16} /> Tailor Cover Letter
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          <div className="lg:col-span-8 space-y-6">
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
                icon={<Calendar size={18}/>} 
                title="Posted" 
                value={currentJob.postedDate ? new Date(currentJob.postedDate).toLocaleDateString() : "Recent"} 
              />
            </div>

            {currentJob.businessModel && (
              <section className="bg-[var(--color-button-primary-bg)] rounded-[2rem] p-8 text-[var(--color-text-on-primary)] shadow-xl">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Code2 size={22} /> Business Intelligence
                </h2>
                <p className="opacity-90 leading-relaxed text-lg font-medium">
                  {currentJob.businessModel}
                </p>
              </section>
            )}

            <section className="bg-[var(--color-background-secondary)] rounded-[2rem] p-8 border border-[var(--color-border-secondary)] shadow-sm">
              <h2 className="text-2xl font-black mb-6 text-[var(--color-text-primary)] flex items-center gap-3">
                <FileText className="text-[var(--color-button-primary-bg)]" /> Detailed Breakdown
              </h2>
              <div className="space-y-5">
                {currentJob.aiDescription?.split('\n').filter(l => l.trim()).map((line, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="mt-1.5 w-5 h-5 rounded-full bg-[var(--color-background-tertiary)] flex items-center justify-center shrink-0">
                      <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-button-primary-bg)]" />
                    </div>
                    <p className="text-[var(--color-text-secondary)] leading-relaxed font-medium">
                      {line.replace(/^- /, '')}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <div className="lg:col-span-4 space-y-6">
            <div className="bg-[var(--color-background-secondary)] rounded-[2rem] p-6 border border-[var(--color-border-secondary)] shadow-sm">
              <h3 className="font-black text-[var(--color-text-primary)] mb-6 flex items-center gap-2 uppercase tracking-tighter text-sm">
                <Briefcase size={18} className="text-[var(--color-button-primary-bg)]" /> Pipeline Status
              </h3>
              <div className="space-y-4">
                <select 
                  value={currentJob.status}
                  onChange={(e) => dispatch(updateJob({ 
                    jobId: currentJob._id, 
                    updates: { status: e.target.value } 
                  }))}
                  className="w-full p-4 bg-[var(--color-background-primary)] border-2 border-transparent focus:border-[var(--color-button-primary-bg)] rounded-2xl font-bold text-[var(--color-text-primary)] outline-none transition-all appearance-none cursor-pointer"
                >
                  <option value="saved">Saved</option>
                  <option value="applied">Applied</option>
                  <option value="interviewing">Interviewing</option>
                  <option value="offer">Offer</option>
                  <option value="rejected">Rejected</option>
                </select>
                
                <div className="p-4 bg-[var(--color-background-tertiary)] rounded-2xl border border-[var(--color-border-secondary)]">
                   <p className="text-[10px] font-black text-[var(--color-text-placeholder)] uppercase mb-1">Created On</p>
                   <p className="text-sm font-bold text-[var(--color-text-primary)]">
                     {new Date(currentJob.createdAt).toLocaleDateString(undefined, { dateStyle: 'long' })}
                   </p>
                </div>
              </div>
            </div>

            {currentJob.perks?.length > 0 && (
              <div className="bg-[var(--color-background-secondary)] rounded-[2rem] p-6 border border-[var(--color-border-secondary)] shadow-sm">
                <h3 className="font-black text-[var(--color-text-primary)] mb-4 flex items-center gap-2 uppercase tracking-tighter text-sm">
                  <Heart size={18} className="text-[var(--color-danger)]" /> Benefits
                </h3>
                <div className="flex flex-wrap gap-2">
                  {currentJob.perks.map((perk, i) => (
                    <span key={i} className="px-3 py-1.5 bg-[var(--color-background-tertiary)] text-[var(--color-text-secondary)] text-[11px] font-bold rounded-lg border border-[var(--color-border-secondary)]">
                      {perk}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {currentJob.companyInsights && (
              <div className="bg-[var(--color-background-tertiary)] rounded-[2rem] p-6 border border-[var(--color-border-secondary)]">
                <h3 className="font-black text-[var(--color-text-primary)] mb-2 flex items-center gap-2 text-sm">
                  <Info size={18} /> Company Culture
                </h3>
                <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed font-medium">
                  {currentJob.companyInsights}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

function StatItem({ icon, title, value }) {
  return (
    <div className="bg-[var(--color-background-secondary)] p-4 rounded-2xl border border-[var(--color-border-secondary)] shadow-sm">
      <div className="text-[var(--color-button-primary-bg)] mb-2">{icon}</div>
      <p className="text-[10px] font-black text-[var(--color-text-placeholder)] uppercase tracking-widest">{title}</p>
      <p className="text-sm font-black text-[var(--color-text-primary)] truncate" title={value}>{value}</p>
    </div>
  );
}

function getStatusColor(status) {
  switch (status) {
    case 'interviewing': return "bg-amber-100 text-amber-700";
    case 'offer': return "bg-emerald-100 text-emerald-700";
    case 'rejected': return "bg-rose-100 text-rose-700";
    case 'applied': return "bg-blue-100 text-blue-700";
    default: return "bg-[var(--color-background-tertiary)] text-[var(--color-text-secondary)]";
  }
}