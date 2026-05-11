"use client";
import { useEffect, useState } from "react";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { useRouter, useSearchParams } from "next/navigation";
import { createJob, updateJob, fetchJobById } from "@lib/redux/features/job/thunks";
import { displayToast } from "@lib/redux/features/toast/thunks";

// UI Components
import JobFormHeader from "./(components)/jobformheader";
import { useJobExtraction } from "./(components)/usejobextraction";
import RedFlagSection from "./(components)/redflagsection";
import IconInput from "./(components)/iconinput";
import MarketIntelSection from "./(components)/marketintelsection";
import { 
  FileText, ClipboardList, Info, MapPin, DollarSign, 
  LinkIcon, Calendar, Briefcase, Sparkles, UserCheck 
} from "lucide-react";

export default function EditJobPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();
  const jobId = searchParams.get("id");

  const { loading, currentJob } = useSelector(state => ({
    loading: state.jobsStore.loading,
    currentJob: state.jobsStore.currentJob
  }), shallowEqual);

  const [eligibilityTags, setEligibilityTags] = useState([]);
  
  // INITIAL STATE: Matches Mongoose Schema 1:1
  const [jobData, setJobData] = useState({
    companyName: "",
    position: "",
    rawDescription: "",
    aiDescription: "",
    seniorityLevel: "",
    jobType: "Full-time",
    salary: "",
    jobUrl: "",
    jobLocation: "Aurora, IL",
    postedDate: new Date().toISOString().split('T')[0],
    applicationDate: new Date().toISOString().split('T')[0],
    businessModel: "",
    companyInsights: "",
    skills: [],
    marketIntel: {
      difficultyRating: 3,
      isFeatured: false,
      interviewQuestions: []
    }
  });

  useEffect(() => {
    if (jobId) dispatch(fetchJobById(jobId));
  }, [jobId, dispatch]);

  useEffect(() => {
    if (jobId && currentJob && currentJob._id === jobId) {
      setJobData({
        ...currentJob,
        marketIntel: currentJob.marketIntel || { difficultyRating: 3, isFeatured: false, interviewQuestions: [] }
      });
      setEligibilityTags(currentJob.requirements || []);
    }
  }, [currentJob, jobId]);

  const { runExtraction, isExtracting } = useJobExtraction(
    jobData, setJobData, setEligibilityTags
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...jobData, requirements: eligibilityTags };
      if (jobId) {
        await dispatch(updateJob({ jobId, updates: payload })).unwrap();
      } else {
        await dispatch(createJob(payload)).unwrap();
      }
      router.push("/dashboard/jobs/tracker");
    } catch (err) {
      console.error("Save failed:", err);
    }
  };

  return (
    <div className="max-w-[1400px] mx-auto p-4 md:p-10 min-h-screen bg-[var(--color-background-primary)]">
      <JobFormHeader isExtracting={isExtracting} onExtract={runExtraction} loading={loading} isEditMode={!!jobId} />

      <form id="job-form" onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: THE HEAVY TEXT */}
        <div className="lg:col-span-8 space-y-6">
          <div className="card p-6 border border-[var(--color-border-primary)]">
             <div className="flex items-center gap-2 mb-4 text-[10px] font-black uppercase text-[var(--color-text-secondary)]">
               <FileText size={14}/> Raw Job Description
             </div>
             <textarea 
               required 
               className="w-full h-72 outline-none resize-none text-sm bg-transparent custom-scrollbar"
               value={jobData.rawDescription} 
               onChange={e => setJobData({...jobData, rawDescription: e.target.value})} 
             />
          </div>

          <div className={`card p-6 border-l-4 border-indigo-500 shadow-sm ${isExtracting ? "animate-pulse opacity-60" : ""}`}>
             <div className="flex items-center gap-2 mb-4 text-[10px] font-black uppercase text-indigo-500">
               <ClipboardList size={14}/> {isExtracting ? "AI Processing..." : "Extracted Duties"}
             </div>
             <textarea 
               className="w-full h-[500px] outline-none resize-none text-sm italic bg-transparent custom-scrollbar"
               value={jobData.aiDescription} 
               onChange={e => setJobData({...jobData, aiDescription: e.target.value})} 
             />
          </div>
        </div>

        {/* RIGHT COLUMN: THE INTELLIGENCE METADATA */}
        <div className="lg:col-span-4 space-y-6">
                    <div className="card p-6 space-y-3">
             <div className="grid grid-cols-2 gap-2 mb-2">
                <div className="flex flex-col gap-1">
                  <label className="text-[8px] font-black uppercase opacity-50 px-2">Posted</label>
                  <IconInput type="date" icon={<Calendar size={14}/>} value={jobData.postedDate} onChange={val => setJobData({...jobData, postedDate: val})} />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[8px] font-black uppercase opacity-50 px-2">Applied</label>
                  <IconInput type="date" icon={<Briefcase size={14}/>} value={jobData.applicationDate} onChange={val => setJobData({...jobData, applicationDate: val})} />
                </div>
             </div>
             <IconInput icon={<MapPin size={16}/>} value={jobData.jobLocation} onChange={val => setJobData({...jobData, jobLocation: val})} />
             <IconInput icon={<DollarSign size={16}/>} value={jobData.salary} onChange={val => setJobData({...jobData, salary: val})} />
             <IconInput icon={<LinkIcon size={16}/>} value={jobData.jobUrl} onChange={val => setJobData({...jobData, jobUrl: val})} />
          </div>
          {/* Main Identity Card */}
          <div className={`card p-6 space-y-5 ${isExtracting ? "animate-pulse" : ""}`}>
            <input required placeholder="Company Name" className="form-input font-bold text-lg" value={jobData.companyName} onChange={e => setJobData({...jobData, companyName: e.target.value})} />
            <input required placeholder="Position Title" className="form-input font-bold text-lg" value={jobData.position} onChange={e => setJobData({...jobData, position: e.target.value})} />
            
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[8px] font-black uppercase px-1 opacity-60">Seniority</label>
                <select className="form-input text-xs font-bold" value={jobData.seniorityLevel} onChange={e => setJobData({...jobData, seniorityLevel: e.target.value})}>
                  <option value="">Select Level</option>
                  <option value="Intern">Intern</option>
                  <option value="Entry Level">Entry Level</option>
                  <option value="Junior">Junior</option>
                  <option value="Mid-Level">Mid-Level</option>
                  <option value="Senior">Senior</option>
                  <option value="Staff/Principal">Staff/Principal</option>
                  <option value="Lead/Manager">Lead/Manager</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[8px] font-black uppercase px-1 opacity-60">Job Type</label>
                <select className="form-input text-xs font-bold" value={jobData.jobType} onChange={e => setJobData({...jobData, jobType: e.target.value})}>
                  <option value="Full-time">Full-time</option>
                  <option value="Contract">Contract</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Internship">Internship</option>
                </select>
              </div>
            </div>
          </div>

          {/* Market Cheat Sheet Card */}
          <MarketIntelSection jobData={jobData} setJobData={setJobData} />

          {/* Culture & Insights */}
          <div className="card p-6 space-y-4">
            <div className="flex items-center gap-2 text-[10px] font-black text-[var(--color-text-secondary)] uppercase">
              <Sparkles size={16} className="text-amber-500"/> Company Strategy
            </div>
            <textarea 
              className="form-input text-xs h-24 italic resize-none"
              placeholder="Culture fluff, growth notes, and vibe..." 
              value={jobData.companyInsights} 
              onChange={e => setJobData({...jobData, companyInsights: e.target.value})} 
            />
          </div>

          <RedFlagSection tags={eligibilityTags} setTags={setEligibilityTags} commonHurdles={["No Sponsorship", "US Citizen Only", "Security Clearance"]} />

          {/* Logistics Card */}

        </div>
      </form>
    </div>
  );
}