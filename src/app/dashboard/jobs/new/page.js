"use client";
import { useState } from "react";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { useRouter } from "next/navigation";
import { createJob, fetchAIdata_job } from "@lib/redux/features/job/thunks";
import { jobExtractionPrompts } from "@public/staticfiles/prompts/jobdescriptionextractor/jobdetailextraction";
import { sanitizeJobData } from "./(helpers)/index"; 
import { 
  ArrowLeft, Save, Loader2, ShieldAlert, Zap, 
  FileText, ClipboardList, X, Plus, MapPin, DollarSign, Calendar, LinkIcon, Info
} from "lucide-react";
import Link from "next/link";
import { displayToast } from "@lib/redux/features/toast/thunks";

export default function CreateJobPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  
  const { loading, aiAgent } = useSelector((state) => ({
    loading: state.jobsStore.loading,
    aiAgent: state.aiAgent 
  }), shallowEqual);

  const [isExtracting, setIsExtracting] = useState(false);
  const [newTag, setNewTag] = useState("");

  const [jobData, setJobData] = useState({
    companyName: "", position: "", rawDescription: "", aiDescription: "", 
    seniorityLevel: "", jobType: "Not Mentioned", salary: "", jobUrl: "", 
    jobLocation: "Aurora, IL", postedDate: new Date().toISOString().split('T')[0], 
    companyInsights: "", businessModel: "" 
  });

  const [eligibilityTags, setEligibilityTags] = useState([]);
  const [perks, setPerks] = useState([]);

  const commonHurdles = [
    "No Sponsorship", "US Citizen Only", "Background Check", "Drug Test",
    "Security Clearance", "On-site Only", "Contract Role", "Master's Degree"
  ];

  const togglePresetTag = (tag) => {
    setEligibilityTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
  };

  const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  const handleAIExtract = async () => {
    if (!jobData.rawDescription) return alert("Please paste the job description first!");
    setIsExtracting(true);
    
    try {
      let tempPayload = { ...jobData };
      let tempTags = [...eligibilityTags];
      let tempPerks = [...perks];

      for (const phase of jobExtractionPrompts) {
        if (!phase) continue;
        if (phase.id > 1) await sleep(1500);

        const result = await dispatch(fetchAIdata_job({
          phase, jobDescription: jobData.rawDescription,
          aiAgentConfig: { provider: aiAgent.provider, model: aiAgent.agent, ApiKey: aiAgent.apiKey }
        })).unwrap();

        const data = result?.data;
        if (!data) continue;

        if (phase.id === 1) tempPayload = { ...tempPayload, ...data, salary: data.salaryRange || data.salary };
        if (phase.id === 2) tempPayload.aiDescription = data.aiDescription;
        if (phase.id === 3) {
            const aiTags = Array.isArray(data) ? data.map(i => i.tag || i) : [];
            tempTags = Array.from(new Set([...tempTags, ...aiTags]));
        }
        if (phase.id === 4) {
          tempPayload.companyInsights = data.companyInsights;
          tempPayload.businessModel = data.businessModel;
          tempPerks = data.perks || [];
        }
      }

      const cleanData = sanitizeJobData(tempPayload);
      setJobData(cleanData);
      setEligibilityTags(tempTags);
      setPerks(tempPerks);

    } catch (err) {
      console.error("AI Loop failed:", err);
    } finally { setIsExtracting(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await dispatch(createJob({ ...jobData, requirements: eligibilityTags, perks })).unwrap();
    await dispatch(displayToast({ message: `New Job Saved!`, type: 'success' }));
    router.push("/dashboard/jobs/tracker");
  };

  return (
    <div className="max-w-[1400px] mx-auto p-4 md:p-10 min-h-screen transition-colors duration-300 relative" 
         style={{ backgroundColor: 'var(--color-background-primary)', color: 'var(--color-text-primary)' }}>
      
      {/* 1. Global Submission Overlay (Handles Lag during DB Save) */}
      {loading && (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-slate-900/20 backdrop-blur-sm transition-opacity">
          <div className="bg-[var(--color-background-secondary)] p-8 rounded-3xl shadow-modal flex flex-col items-center gap-4">
            <Loader2 className="animate-spin text-[var(--color-button-primary-bg)]" size={40} />
            <p className="font-bold text-sm uppercase tracking-widest text-[var(--color-text-primary)]">Saving to Tracker...</p>
          </div>
        </div>
      )}

      {/* Header Section */}
      <div className="flex justify-between items-center mb-8 p-6 shadow-modal bg-[var(--color-background-secondary)]">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/jobs/tracker" className="p-3 hover:bg-[var(--color-background-tertiary)] rounded-full transition-all text-[var(--color-text-secondary)]">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-xl font-black uppercase tracking-tight custom-label">Job Intelligence Intake</h1>
        </div>
        <div className="flex gap-3">
          <button type="button" onClick={handleAIExtract} disabled={isExtracting || !jobData.rawDescription}
            className="btn-primary flex items-center gap-2 text-sm disabled:opacity-50"
          >
            {isExtracting ? <Loader2 className="animate-spin" size={16} /> : <Zap size={16} />}
            {isExtracting ? "Analyzing..." : "Run AI Intelligence"}
          </button>
          <button form="job-form" type="submit" disabled={loading} className="btn-primary bg-[var(--color-cta-bg)] hover:bg-[var(--color-cta-hover-bg)] flex items-center gap-2 text-sm">
            <Save size={16} /> Finalize Entry
          </button>
        </div>
      </div>

      <form id="job-form" onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column */}
        <div className="lg:col-span-8 space-y-6">
          <div className="card p-6 border border-[var(--color-border-primary)] shadow-sm">
            <span className="text-[10px] font-black text-[var(--color-text-secondary)] uppercase tracking-widest block mb-4 flex items-center gap-2">
              <FileText size={14}/> Raw Job Description
            </span>
            <textarea required className="w-full h-72 outline-none resize-none text-sm leading-relaxed bg-transparent custom-scrollbar"
              value={jobData.rawDescription ?? ""} onChange={e => setJobData({...jobData, rawDescription: e.target.value})} placeholder="Paste original text here..." />
          </div>

          {/* 2. AI Duties Loading Effect */}
          <div className={`card p-6 border-l-4 border-[var(--color-button-primary-bg)] shadow-sm transition-all duration-500 ${isExtracting ? "opacity-60 ring-2 ring-indigo-400 ring-offset-4 animate-pulse" : "opacity-100"}`}>
            <span className="text-[10px] font-black text-[var(--color-button-primary-bg)] uppercase tracking-widest block mb-4 flex items-center gap-2">
              <ClipboardList size={14}/> {isExtracting ? "AI is rewriting duties..." : "Extracted Duties"}
            </span>
            <textarea className="w-full h-[600px] outline-none resize-none text-sm text-[var(--color-text-secondary)] leading-relaxed italic bg-transparent custom-scrollbar"
              value={jobData.aiDescription ?? ""} onChange={e => setJobData({...jobData, aiDescription: e.target.value})} placeholder="AI duties will appear here..." />
          </div>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-4 space-y-6">
          {/* Inputs with Pulse when Extracting */}
          <div className={`card p-6 space-y-5 transition-all ${isExtracting ? "animate-pulse" : ""}`}>
            <input required placeholder="Company Name" className="form-input font-bold text-lg" value={jobData.companyName ?? ""} onChange={e => setJobData({...jobData, companyName: e.target.value})} />
            <input required placeholder="Position Title" className="form-input font-bold text-lg" value={jobData.position ?? ""} onChange={e => setJobData({...jobData, position: e.target.value})} />
            
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="space-y-1">
                <label className="text-[9px] font-black text-[var(--color-text-secondary)] uppercase">Seniority</label>
                <select className="form-input font-bold text-xs appearance-none" value={jobData.seniorityLevel ?? ""} onChange={e => setJobData({...jobData, seniorityLevel: e.target.value})}>
                  <option value="">Select...</option>
                  {['Intern', 'Entry Level', 'Junior', 'Mid-Level', 'Senior', 'Staff/Principal', 'Lead/Manager'].map(l => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-black text-[var(--color-text-secondary)] uppercase">Job Type</label>
                <select className="form-input font-bold text-xs appearance-none" value={jobData.jobType ?? "Not Mentioned"} onChange={e => setJobData({...jobData, jobType: e.target.value})}>
                  {['Full-time', 'Part-time', 'Contract', 'Internship', 'Not Mentioned'].map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* Red Flags Section */}
          <div className="p-6 rounded-[2rem] border border-[var(--color-danger)] bg-[var(--color-background-secondary)] space-y-5" style={{ borderStyle: 'dashed' }}>
            <span className="text-[10px] font-black text-[var(--color-danger)] uppercase tracking-widest block flex items-center gap-2">
              <ShieldAlert size={16}/> Red Flag Hurdles
            </span>
            <div className="grid grid-cols-2 gap-2 pb-2">
                {commonHurdles.map(tag => (
                  <button key={tag} type="button" onClick={() => togglePresetTag(tag)}
                    className={`text-[9px] font-bold p-2 rounded-lg border transition-all ${
                      eligibilityTags.includes(tag) 
                        ? 'bg-[var(--color-danger)] border-[var(--color-danger)] text-white shadow-md' 
                        : 'bg-transparent border-[var(--color-border-primary)] text-[var(--color-text-secondary)]'
                    }`}
                  > {tag} </button>
                ))}
            </div>
            <div className="flex flex-wrap gap-2">
              {eligibilityTags.map(tag => (
                <span key={tag} className="card-tag flex items-center gap-1">
                  {tag} <X size={12} className="cursor-pointer opacity-60 hover:opacity-100" onClick={() => setEligibilityTags(eligibilityTags.filter(t => t !== tag))} />
                </span>
              ))}
            </div>
          </div>

          <div className={`card p-6 space-y-4 transition-all ${isExtracting ? "animate-pulse" : ""}`}>
            <span className="text-[10px] font-black text-[var(--color-text-secondary)] uppercase tracking-widest block flex items-center gap-2">
              <Info size={16} className="text-[var(--color-button-primary-bg)]"/> About the Company
            </span>
            <textarea className="form-input text-xs font-semibold h-24 italic resize-none"
              placeholder="What this company actually does..." value={jobData.businessModel ?? ""} onChange={e => setJobData({...jobData, businessModel: e.target.value})} />
          </div>

          <div className={`card p-6 space-y-3 transition-all ${isExtracting ? "animate-pulse" : ""}`}>
             {/* Icon Rows */}
             <div className="flex items-center gap-3 text-[var(--color-text-secondary)] text-xs px-2"> 
                <MapPin size={16} /> 
                <input placeholder="Location" className="bg-transparent outline-none w-full font-medium" value={jobData.jobLocation ?? ""} onChange={e => setJobData({...jobData, jobLocation: e.target.value})} /> 
             </div>
             <div className="flex items-center gap-3 text-[var(--color-text-secondary)] text-xs px-2"> 
                <DollarSign size={16} /> 
                <input placeholder="Salary" className="bg-transparent outline-none w-full font-medium" value={jobData.salary ?? ""} onChange={e => setJobData({...jobData, salary: e.target.value})} /> 
             </div>
             <div className="flex items-center gap-3 text-[var(--color-text-secondary)] text-xs px-2"> 
                <Calendar size={16} /> 
                <input type="date" className="bg-transparent outline-none w-full font-medium" value={jobData.postedDate ?? ""} onChange={e => setJobData({...jobData, postedDate: e.target.value})} /> 
             </div>
             <div className="flex items-center gap-3 text-[var(--color-text-secondary)] text-xs px-2"> 
                <LinkIcon size={16} /> 
                <input placeholder="Job URL" className="bg-transparent outline-none w-full font-medium" value={jobData.jobUrl ?? ""} onChange={e => setJobData({...jobData, jobUrl: e.target.value})} /> 
             </div>
          </div>
        </div>
      </form>
    </div>
  );
}