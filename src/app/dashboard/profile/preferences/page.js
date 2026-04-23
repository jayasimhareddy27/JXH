"use client";
import React, { useState } from 'react';
import { 
  Sparkles, Save, Shield, User, Globe, 
  Link as LinkIcon, Briefcase, Scale, Plus, X, Github, Linkedin, ExternalLink, Layers, Calendar
} from 'lucide-react';
import { INITIAL_STATE, USER_STATUS_PRESETS } from './index';

export default function CareerVaultPage() {
  const [savedProfiles, setSavedProfiles] = useState([
    { ...INITIAL_STATE, _id: "temp-1", label: "Primary Profile" }
  ]);
  const [activeIdx, setActiveIdx] = useState(0);

  const activeProfile = savedProfiles[activeIdx];

  const update = (path, value) => {
    const keys = path.split('.');
    setSavedProfiles(prev => {
      const newProfiles = JSON.parse(JSON.stringify(prev));
      const target = newProfiles[activeIdx];
      
      if (keys.length === 1) target[keys[0]] = value;
      else if (keys.length === 2) target[keys[0]][keys[1]] = value;
      else if (keys.length === 3) target[keys[0]][keys[1]][keys[2]] = value;
      
      return newProfiles;
    });
  };

  const applyPreset = (status) => {
    if (USER_STATUS_PRESETS[status]) {
      setSavedProfiles(prev => {
        const newProfiles = [...prev];
        newProfiles[activeIdx] = { ...USER_STATUS_PRESETS[status], _id: prev[activeIdx]._id };
        return newProfiles;
      });
    }
  };

  return (
    <div className="min-h-screen p-6 md:p-12 transition-colors duration-300" 
         style={{ backgroundColor: 'var(--color-background-primary)', color: 'var(--color-text-primary)' }}>
      <div className="max-w-7xl mx-auto">
        
        {/* PROFILE SWITCHER - Uses your shadow-modal class */}
        <div className="mb-8 flex items-center gap-4 p-4 shadow-modal" 
             style={{ backgroundColor: 'var(--color-background-secondary)', borderColor: 'var(--color-border-primary)' }}>
          <Layers className="text-[var(--color-button-primary-bg)]" size={20} />
          <div className="flex flex-1 gap-2 overflow-x-auto no-scrollbar">
            {savedProfiles.map((p, idx) => (
              <button 
                key={p._id}
                onClick={() => setActiveIdx(idx)}
                className="px-5 py-2 rounded-xl text-xs font-black transition-all"
                style={{ 
                  backgroundColor: activeIdx === idx ? 'var(--color-button-primary-bg)' : 'var(--color-background-tertiary)',
                  color: activeIdx === idx ? 'var(--color-text-inverse)' : 'var(--color-text-secondary)'
                }}
              >
                {p.profile.userStatus} {idx === 0 ? "★" : ""}
              </button>
            ))}
            <button onClick={() => setSavedProfiles([...savedProfiles, { ...INITIAL_STATE, _id: Date.now().toString() }])} 
                    className="px-4 py-2 rounded-xl text-xs font-black border border-dashed border-[var(--color-border-primary)] text-[var(--color-button-primary-bg)] hover:bg-[var(--color-button-secondary-bg)] transition-all">
              + NEW PROFILE
            </button>
          </div>
        </div>

        {/* HEADER */}
        <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[var(--color-border-primary)] pb-8">
          <div className="space-y-1">
            <h1 className="text-5xl font-black tracking-tighter italic">CAREER VAULT</h1>
            <p className="text-[var(--color-text-secondary)] font-black text-[10px] uppercase tracking-widest">Global Persona Management</p>
          </div>
          <button className="px-8 py-3 rounded-xl font-black text-xs uppercase tracking-[0.2em] shadow-lg transition-all active:scale-95 flex items-center gap-3"
                  style={{ backgroundColor: 'var(--color-cta-bg)', color: 'var(--color-cta-text)' }}>
            <Save size={16} /> Sync All Data
          </button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          
          {/* 1. PROFESSIONAL PROFILE */}
          <Section title="Professional Profile" icon={<User size={18}/>}>
            <Select label="User Status" value={activeProfile.profile.userStatus} onChange={v => applyPreset(v)}>
              {['Working Professional', 'International Student', 'Recent Graduate', 'Citizen', 'Other'].map(s => <option key={s} value={s}>{s}</option>)}
            </Select>
            <Select label="Years of Experience" value={activeProfile.profile.yearsOfExperience} onChange={v => update('profile.yearsOfExperience', v)}>
              {[0, 1, 2, 3, 5, 10, 15].map(y => <option key={y} value={y}>{y} Years</option>)}
            </Select>
            <TagInput label="Target Job Titles" tags={activeProfile.profile.targetJobTitles} onUpdate={(tags) => update('profile.targetJobTitles', tags)} placeholder="Add title..." />
            <TagInput label="Preferred Work Locations" tags={activeProfile.profile.preferredWorkLocation} onUpdate={(tags) => update('profile.preferredWorkLocation', tags)} placeholder="Add city..." />
            <div className="grid grid-cols-2 gap-2">
              <Select label="Min Salary" value={activeProfile.profile.expectedSalary.min} onChange={v => update('profile.expectedSalary.min', v)}>
                {[0, 30000, 50000, 80000, 120000, 200000].map(s => <option key={s} value={s}>${s.toLocaleString()}</option>)}
              </Select>
              <Select label="Currency" value={activeProfile.profile.expectedSalary.currency} onChange={v => update('profile.expectedSalary.currency', v)}>
                <option value="JPY">JPY</option><option value="USD">USD</option>
              </Select>
            </div>
          </Section>

          {/* 2. WORK ELIGIBILITY & SECURITY */}
          <Section title="Work Eligibility" icon={<Shield size={18}/>}>
            <Toggle label="Authorized to work?" checked={activeProfile.workEligibility.eligibleToWorkInCountry} onChange={v => update('workEligibility.eligibleToWorkInCountry', v)} />
            <Toggle label="Requires Sponsorship?" checked={activeProfile.workEligibility.requiresSponsorship} onChange={v => update('workEligibility.requiresSponsorship', v)} />
            <Select label="Visa Type" value={activeProfile.workEligibility.visaType} onChange={v => update('workEligibility.visaType', v)}>
              {['None', 'F1-OPT', 'F1-CPT', 'H1-B', 'Green Card', 'N/A'].map(v => <option key={v} value={v}>{v}</option>)}
            </Select>
            <Select label="Current Location Type" value={activeProfile.workEligibility.currentLocationType} onChange={v => update('workEligibility.currentLocationType', v)}>
              {['Local', 'Willing to Relocate', 'Remote Only'].map(o => <option key={o} value={o}>{o}</option>)}
            </Select>
            <Select label="Security Clearance" value={activeProfile.workEligibility.securityClearance} onChange={v => update('workEligibility.securityClearance', v)}>
              {['None', 'Secret', 'Top Secret', 'TS/SCI', 'Other'].map(o => <option key={o} value={o}>{o}</option>)}
            </Select>
          </Section>

          {/* 3. DIVERSITY & INCLUSION (EEO) */}
          <Section title="Diversity & Inclusion" icon={<Sparkles size={18}/>}>
            <Select label="Gender" value={activeProfile.demographics.gender} onChange={v => update('demographics.gender', v)}>
              {['Male', 'Female', 'Non-binary', 'Prefer not to say'].map(o => <option key={o} value={o}>{o}</option>)}
            </Select>
            <Select label="Ethnicity" value={activeProfile.demographics.ethnicity} onChange={v => update('demographics.ethnicity', v)}>
              {['Hispanic or Latino', 'White', 'Black or African American', 'Asian', 'Native Hawaiian or Pacific Islander', 'American Indian or Alaska Native', 'Two or More Races', 'Prefer not to say'].map(o => <option key={o} value={o}>{o}</option>)}
            </Select>
            <Select label="Veteran Status" value={activeProfile.demographics.isVeteran} onChange={v => update('demographics.isVeteran', v)}>
              {['I am not a veteran', 'Protected veteran', 'Prefer not to say'].map(o => <option key={o} value={o}>{o}</option>)}
            </Select>
            <Select label="Disability Status" value={activeProfile.demographics.disabilityStatus} onChange={v => update('demographics.disabilityStatus', v)}>
              {['Yes, I have a disability', 'No, I do not have a disability', 'Prefer not to say'].map(o => <option key={o} value={o}>{o}</option>)}
            </Select>
          </Section>

          {/* 4. LEGAL & COMPLIANCE */}
          <Section title="Legal & Compliance" icon={<Scale size={18}/>}>
            <Toggle label="Has Criminal Record?" checked={activeProfile.legal.hasCriminalRecord} onChange={v => update('legal.hasCriminalRecord', v)} />
            <Toggle label="Subject to Non-Compete?" checked={activeProfile.legal.subjectToNonCompete} onChange={v => update('legal.subjectToNonCompete', v)} />
            <Toggle label="Ever Discharged?" checked={activeProfile.legal.everDischargedFromJob} onChange={v => update('legal.everDischargedFromJob', v)} />
            <Toggle label="Former Employee?" checked={activeProfile.legal.formerEmployee} onChange={v => update('legal.formerEmployee', v)} />
          </Section>

          {/* 5. LOGISTICS & AVAILABILITY */}
          <Section title="Logistics" icon={<Briefcase size={18}/>}>
            <Select label="Notice Period" value={activeProfile.availability.noticePeriod} onChange={v => update('availability.noticePeriod', v)}>
              {['Immediate', '2 weeks', '1 month', '2 months', '3 months'].map(o => <option key={o} value={o}>{o}</option>)}
            </Select>
            <Select label="Willing to Travel" value={activeProfile.availability.willingToTravel} onChange={v => update('availability.willingToTravel', v)}>
              {['0%', '25%', '50%', '75%', '100%'].map(o => <option key={o} value={o}>{o}</option>)}
            </Select>
            <Input label="Earliest Start Date" type="date" value={activeProfile.availability.earliestStartDate?.split('T')[0] || ""} 
                   onChange={v => update('availability.earliestStartDate', v)} icon={<Calendar size={14}/>} />
          </Section>

          {/* 6. LANGUAGES & SKILLS */}
          <Section title="Languages" icon={<Globe size={18}/>}>
            <div className="space-y-3">
              {activeProfile.languages.map((l, i) => (
                <div key={i} className="flex gap-2">
                  <input className="bg-[var(--color-background-tertiary)] p-3 rounded-xl text-xs font-bold flex-1 outline-none" 
                         placeholder="Language" value={l.language} onChange={(e) => {
                    const newL = [...activeProfile.languages];
                    newL[i].language = e.target.value;
                    update('languages', newL);
                  }}/>
                  <Select value={l.proficiency} noLabel onChange={(v) => {
                    const newL = [...activeProfile.languages];
                    newL[i].proficiency = v;
                    update('languages', newL);
                  }}>
                    {['Native', 'Fluent', 'Professional', 'Intermediate', 'Beginner'].map(p => <option key={p} value={p}>{p}</option>)}
                  </Select>
                </div>
              ))}
              <button onClick={() => update('languages', [...activeProfile.languages, { language: "", proficiency: "Professional" }])}
                      className="text-[10px] font-black uppercase text-[var(--color-button-primary-bg)] flex items-center gap-1">
                <Plus size={12}/> Add Language
              </button>
            </div>
          </Section>

          {/* 7. SOCIAL & LINKS */}
          <Section title="Social & Links" icon={<LinkIcon size={18}/>}>
            <div className="space-y-4">
              <Input label="LinkedIn" value={activeProfile.links.linkedin} icon={<Linkedin size={14}/>} onChange={v => update('links.linkedin', v)} />
              <Input label="GitHub" value={activeProfile.links.github} icon={<Github size={14}/>} onChange={v => update('links.github', v)} />
              <Input label="Portfolio" value={activeProfile.links.portfolio} icon={<ExternalLink size={14}/>} onChange={v => update('links.portfolio', v)} />
            </div>
          </Section>

        </div>
      </div>
    </div>
  );
}

/* --- REUSABLE THEME-VAR COMPONENTS --- */

const Section = ({ title, icon, children }) => (
  <div className="p-8 shadow-modal transition-all duration-300"
       style={{ backgroundColor: 'var(--color-card-bg)', borderColor: 'var(--color-border-primary)' }}>
    <div className="flex items-center gap-3 mb-6 font-black italic" style={{ color: 'var(--color-button-primary-bg)' }}>
      <div className="p-2 rounded-xl" style={{ backgroundColor: 'var(--color-background-tertiary)' }}>{icon}</div>
      <h2 className="text-[11px] uppercase tracking-[0.2em]">{title}</h2>
    </div>
    <div className="space-y-5">{children}</div>
  </div>
);

const Select = ({ label, value, children, noLabel, ...props }) => (
  <div className="w-full">
    {!noLabel && <label className="block text-[10px] font-black uppercase opacity-50 mb-1.5 ml-1">{label}</label>}
    <select {...props} value={value ?? ""} onChange={e => props.onChange(e.target.value)} 
            className="w-full p-4 rounded-2xl border-2 border-transparent outline-none font-bold text-sm transition-all appearance-none cursor-pointer"
            style={{ backgroundColor: 'var(--color-background-tertiary)', color: 'var(--color-text-primary)' }}>
      {children}
    </select>
  </div>
);

const Input = ({ label, value, icon, ...props }) => (
    <div className="w-full">
      <label className="block text-[10px] font-black uppercase opacity-50 mb-1.5 ml-1">{label}</label>
      <div className="relative flex items-center">
        {icon && <div className="absolute left-4 opacity-50 text-[var(--color-text-secondary)]">{icon}</div>}
        <input {...props} value={value ?? ""} onChange={e => props.onChange(e.target.value)} 
               className={`w-full p-4 rounded-2xl border-2 border-transparent outline-none font-bold text-sm transition-all ${icon ? 'pl-10' : ''}`}
               style={{ backgroundColor: 'var(--color-background-tertiary)', color: 'var(--color-text-primary)' }} />
      </div>
    </div>
);

const Toggle = ({ label, checked, onChange }) => (
  <div className="flex justify-between items-center p-4 rounded-2xl transition-all"
       style={{ backgroundColor: 'var(--color-background-tertiary)' }}>
    <span className="text-[13px] font-bold opacity-80">{label}</span>
    <input type="checkbox" checked={!!checked} onChange={e => onChange(e.target.checked)} className="w-6 h-6 accent-[var(--color-button-primary-bg)] cursor-pointer" />
  </div>
);

const TagInput = ({ label, tags, onUpdate, placeholder }) => {
  const [val, setVal] = useState("");
  const addTag = (e) => {
    if (e.key === 'Enter' && val.trim()) {
      onUpdate([...tags, val.trim()]);
      setVal("");
    }
  };
  return (
    <div className="space-y-2">
      <label className="block text-[10px] font-black uppercase opacity-50 ml-1">{label}</label>
      <div className="flex flex-wrap gap-2 p-3 rounded-2xl border-2 border-transparent min-h-[50px]"
           style={{ backgroundColor: 'var(--color-background-tertiary)' }}>
        {tags.map((tag, i) => (
          <span key={i} className="flex items-center gap-1 text-[10px] font-bold py-1 px-2 rounded-lg"
                style={{ backgroundColor: 'var(--color-button-primary-bg)', color: 'var(--color-text-inverse)' }}>
            {tag} <X size={10} className="cursor-pointer" onClick={() => onUpdate(tags.filter((_, idx) => idx !== i))} />
          </span>
        ))}
        <input className="bg-transparent outline-none text-xs font-bold flex-1 min-w-[80px]" 
               placeholder={tags.length === 0 ? placeholder : ""} 
               value={val} onChange={(e) => setVal(e.target.value)} onKeyDown={addTag} />
      </div>
    </div>
  );
};