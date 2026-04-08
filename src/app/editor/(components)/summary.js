"use client";
import { useMemo } from "react";
import { 
  Briefcase, 
  CheckCircle2, 
  Clock,
  Target
} from "lucide-react";
import { useSelector } from "react-redux";

export default function SummaryTab({ formDataMap }) {
  // Get jobs from Redux
  const trackerListing = useSelector((state) => state.jobsStore?.trackerListing || []);
  const currentResumeId = formDataMap?._id;

  // Filter: Which jobs are actually using THIS specific resume?
  const connectedJobs = useMemo(() => {
    return trackerListing.filter(job => job.resumeId === currentResumeId);
  }, [trackerListing, currentResumeId]);

  return (
    <div className="space-y-2 animate-in fade-in duration-500 pb-10">
    <h4 className="text-[16px] font-black text-slate-900">Linked Applications</h4>
      {/* SECTION 1: CONNECTED JOBS LIST */}
      <div className="space-y-3">
        {connectedJobs.length > 0 ? (
          connectedJobs.map((job) => (
            <div 
              key={job._id} 
              className="group p-4 rounded-2xl border border-slate-200 bg-white shadow-sm hover:border-cyan-200 transition-all"
            >
              <div className="flex justify-between items-start gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="p-1 bg-slate-100 rounded text-slate-500">
                      <Briefcase size={10} />
                    </span>
                    <h5 className="text-xs font-bold text-slate-900 truncate">
                      {job.position}
                    </h5>
                    <div className="flex items-center gap-2">
                      <div className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase flex items-center gap-1 ${
                      job.stage === 'applied' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'  }`}>
                      {job.stage === 'applied' ? <CheckCircle2 size={10} /> : <Clock size={10} />}
                      {job.stage}
                      </div>
                    </div>
                  </div>
                  <p className="text-[10px] font-medium text-slate-500 ml-6">
                    {job.companyName} • {job.jobLocation || "Remote"}
                  </p>
                </div>
                  <div className="flex items-center gap-1 text-cyan-600">
                  <Target size={12} /><span className="text-xs font-black text-slate-900">85%</span>
                  </div>
              </div>

            </div>
          ))
        ) : (
          /* Empty State */
          <div className="py-12 text-center border-2 border-dashed border-slate-100 rounded-3xl bg-slate-50/50">
             <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center mx-auto mb-3 text-slate-200">
                <Briefcase size={24} />
             </div>
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">No Active Connections</p>
             <p className="text-[9px] text-slate-400 mt-2 max-w-[180px] mx-auto leading-relaxed">
               This resume isn't linked to any jobs yet. Connect it to a job in your <span className="text-slate-600 font-bold">Tracker</span> to see match data here.
             </p>
          </div>
        )}
      </div>


    </div>
  );
}