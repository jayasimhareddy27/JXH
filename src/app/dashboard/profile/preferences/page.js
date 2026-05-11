"use client";
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Save, Shield, User, Globe, Link as LinkIcon, Layers, Calendar, 
  Linkedin, Github, ExternalLink, Plus, Scale, Sparkles, Briefcase, 
  Edit2, Check, Star, ExternalLink as PortfolioIcon 
} from 'lucide-react';

// Redux Actions
import { 
  setActiveProfile, 
  updateActiveProfile, 
  applyCareerPreset, 
  addProfile, 
  setPrimaryProfile 
} from '@lib/redux/features/jobpreferences/slice';
import { syncVaultToDb, fetchVaultFromDb } from '@lib/redux/features/jobpreferences/thunks';

// UI Components
import { Section, Input, Select, TagInput, Toggle } from './index';

export default function CareerVaultPage() {
  const dispatch = useDispatch();
  const { profiles, activeIdx, status, primaryUserDataRef } = useSelector((state) => state.jobpreferencesstore);
  const activeProfile = profiles[activeIdx];
  const [isEditingLabel, setIsEditingLabel] = useState(false);

  useEffect(() => {
    dispatch(fetchVaultFromDb());
  }, [dispatch]);

  // Global Loading State
  if (status === 'loading' && (!profiles || profiles.length === 0)) {
    return (
      <div className="min-h-screen bg-[color:var(--color-background-primary)] flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-[color:var(--color-button-primary-bg)] border-t-transparent rounded-full animate-spin mb-4"></div>
        <h1 className="text-xl font-black italic text-[color:var(--color-button-primary-bg)] uppercase tracking-widest">Retrieving Vault...</h1>
      </div>
    );
  }

  if (!activeProfile) return null;

  return (
    <div className="min-h-screen p-6 md:p-12 transition-colors duration-300 bg-[color:var(--color-background-primary)] text-[color:var(--color-text-primary)]">
      <div className="max-w-7xl mx-auto">
        
        {/* HEADER AREA */}
        <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[color:var(--color-border-primary)] pb-8">
          <div className="space-y-1">
            <h1 className="text-5xl font-black tracking-tighter italic uppercase">Job Preferences</h1>
            <div className="flex items-center gap-2 mt-2 h-8">
              {isEditingLabel ? (
                <div className="flex items-center gap-2">
                  <input 
                    autoFocus
                    className="bg-transparent border-b-2 border-[color:var(--color-button-primary-bg)] outline-none text-xl font-bold italic w-48"
                    value={activeProfile.label || ""}
                    onChange={(e) => dispatch(updateActiveProfile({path: 'label', value: e.target.value}))}
                    onKeyDown={(e) => e.key === 'Enter' && setIsEditingLabel(false)}
                  />
                  <button onClick={() => setIsEditingLabel(false)} className="text-green-500 hover:scale-110 transition-all">
                    <Check size={32}/>
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2 group">
                  <p className="text-[color:var(--color-text-secondary)] font-black text-2xl uppercase tracking-widest">
                    {activeProfile.label || "Untitled Persona"}
                  </p>
                  <button onClick={() => setIsEditingLabel(true)} className="group-hover:cursor-pointer transition-all text-[color:var(--color-button-primary-bg)]">
                    <Edit2 size={24}/>
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4">
            {activeProfile._id && activeProfile._id !== primaryUserDataRef && (
              <button 
                onClick={() => dispatch(setPrimaryProfile(activeProfile._id))}
                className="px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest border border-[color:var(--color-border-primary)] hover:bg-[color:var(--color-background-tertiary)] transition-all flex items-center gap-2"
              >
                <Star size={14}/> Set as Primary
              </button>
            )}
            <button 
              onClick={() => dispatch(syncVaultToDb())}
              disabled={status === 'loading'}
              className="px-8 py-3 rounded-xl font-black text-xs uppercase tracking-[0.2em] shadow-lg transition-all active:scale-95 flex items-center gap-3 disabled:opacity-50 bg-[color:var(--color-cta-bg)] text-[color:var(--color-cta-text)]"
            >
              <Save size={16} /> {status === 'loading' ? 'Syncing...' : 'Save All Changes'}
            </button>
          </div>
        </header>

        {/* PROFILE SWITCHER */}
        <div className="mb-8 flex items-center gap-4 p-4 shadow-modal bg-[color:var(--color-background-secondary)] rounded-[20px] border border-[color:var(--color-border-primary)]">
          <Layers className="text-[color:var(--color-button-primary-bg)]" size={20} />
          <div className="flex flex-1 gap-2 overflow-x-auto no-scrollbar">
            {profiles.map((p, idx) => (
              <button 
                key={p._id || idx}
                onClick={() => { dispatch(setActiveProfile(idx)); setIsEditingLabel(false); }}
                className={`px-5 py-2 rounded-xl text-xs font-black transition-all whitespace-nowrap flex items-center gap-2 ${
                  activeIdx === idx 
                  ? 'bg-[color:var(--color-button-primary-bg)] text-[color:var(--color-text-inverse)]' 
                  : 'bg-[color:var(--color-background-tertiary)] text-[color:var(--color-text-secondary)]'
                }`}
              >
                {p._id === primaryUserDataRef && <Star size={12} fill="currentColor"/>}
                {p.label || "Profile"}
              </button>
            ))}
            <button onClick={() => dispatch(addProfile())} className="px-4 py-2 rounded-xl text-xs font-black border border-dashed border-[color:var(--color-border-primary)] text-[color:var(--color-button-primary-bg)]">
              + NEW
            </button>
          </div>
        </div>

        {/* MAIN DATA GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          
          {/* 1. PROFESSIONAL PROFILE */}
          <Section title="Professional Profile" icon={<User size={18}/>}>
            <Select label="Career Stage" value={activeProfile.profile.careerStage} onChange={v => dispatch(applyCareerPreset(v))}>
              {['Experienced Professional', 'Student', 'Recent Graduate', 'Other'].map(s => <option key={s} value={s}>{s}</option>)}
            </Select>
            <div className="grid grid-cols-2 gap-2">
              <Input label="Citizenship" value={activeProfile.profile.countryOfCitizenship} onChange={v => dispatch(updateActiveProfile({path: 'profile.countryOfCitizenship', value: v}))} />
              <Input label="Target Country" value={activeProfile.profile.targetEmploymentCountry} onChange={v => dispatch(updateActiveProfile({path: 'profile.targetEmploymentCountry', value: v}))} />
            </div>
            <div className="grid grid-cols-3 gap-2">
                <div className="col-span-2">
                    <Input label="Min Expected Salary" type="number" value={activeProfile.profile.expectedSalary.min} onChange={v => dispatch(updateActiveProfile({path: 'profile.expectedSalary.min', value: Number(v)}))} />
                </div>
                <Select label="Currency" value={activeProfile.profile.expectedSalary.currency} onChange={v => dispatch(updateActiveProfile({path: 'profile.expectedSalary.currency', value: v}))}>
                    {['JPY', 'USD', 'EUR', 'GBP', 'INR', 'CAD'].map(c => <option key={c} value={c}>{c}</option>)}
                </Select>
            </div>
            <Select label="Years of Experience" value={activeProfile.profile.yearsOfExperience} onChange={v => dispatch(updateActiveProfile({path: 'profile.yearsOfExperience', value: Number(v)}))}>
                {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 15].map(y => <option key={y} value={y}>{y} Years</option>)}
            </Select>
            <TagInput label="Target Job Titles" tags={activeProfile.profile.targetJobTitles} onUpdate={(tags) => dispatch(updateActiveProfile({path: 'profile.targetJobTitles', value: tags}))} />
          </Section>

          {/* 2. WORK ELIGIBILITY & SECURITY */}
          <Section title="Work Eligibility" icon={<Shield size={18}/>}>
            <Toggle label="Work Authorized?" checked={activeProfile.workEligibility.eligibleToWorkInTargetCountry} onChange={v => dispatch(updateActiveProfile({path: 'workEligibility.eligibleToWorkInTargetCountry', value: v}))} />
            <Toggle label="Requires Sponsorship?" checked={activeProfile.workEligibility.requiresSponsorship} onChange={v => dispatch(updateActiveProfile({path: 'workEligibility.requiresSponsorship', value: v}))} />
            <Select label="Visa Type" value={activeProfile.workEligibility.visaType} onChange={v => dispatch(updateActiveProfile({path: 'workEligibility.visaType', value: v}))}>
              {['None', 'F1-OPT', 'F1-CPT', 'H1-B', 'L1', 'H4-EAD', 'TN', 'Green Card', 'Citizen', 'N/A'].map(v => <option key={v} value={v}>{v}</option>)}
            </Select>
            <Select label="Current Location" value={activeProfile.workEligibility.currentLocationType} onChange={v => dispatch(updateActiveProfile({path: 'workEligibility.currentLocationType', value: v}))}>
              {['Local', 'Willing to Relocate', 'Remote Only'].map(o => <option key={o} value={o}>{o}</option>)}
            </Select>
            <Select label="Security Clearance" value={activeProfile.workEligibility.securityClearance} onChange={v => dispatch(updateActiveProfile({path: 'workEligibility.securityClearance', value: v}))}>
              {['None', 'Secret', 'Top Secret', 'TS/SCI', 'Other'].map(o => <option key={o} value={o}>{o}</option>)}
            </Select>
          </Section>

          {/* 3. DIVERSITY & INCLUSION */}
          <Section title="Diversity (EEO)" icon={<Sparkles size={18}/>}>
            <Select label="Gender" value={activeProfile.demographics.gender} onChange={v => dispatch(updateActiveProfile({path: 'demographics.gender', value: v}))}>
              {['Male', 'Female', 'Non-binary', 'Prefer not to say'].map(o => <option key={o} value={o}>{o}</option>)}
            </Select>
            <Select label="Ethnicity" value={activeProfile.demographics.ethnicity} onChange={v => dispatch(updateActiveProfile({path: 'demographics.ethnicity', value: v}))}>
              {['Hispanic or Latino', 'White', 'Black or African American', 'Asian', 'Native Hawaiian or Pacific Islander', 'American Indian or Alaska Native', 'Two or More Races', 'Prefer not to say'].map(o => <option key={o} value={o}>{o}</option>)}
            </Select>
            <Select label="Veteran Status" value={activeProfile.demographics.isVeteran} onChange={v => dispatch(updateActiveProfile({path: 'demographics.isVeteran', value: v}))}>
              {['I am not a veteran', 'Protected veteran', 'Prefer not to say'].map(o => <option key={o} value={o}>{o}</option>)}
            </Select>
            <Select label="Disability Status" value={activeProfile.demographics.disabilityStatus} onChange={v => dispatch(updateActiveProfile({path: 'demographics.disabilityStatus', value: v}))}>
              {['Yes, I have a disability', 'No, I do not have a disability', 'Prefer not to say'].map(o => <option key={o} value={o}>{o}</option>)}
            </Select>
          </Section>

          {/* 4. LEGAL & COMPLIANCE */}
          <Section title="Legal" icon={<Scale size={18}/>}>
             <div className="space-y-3">
                <Toggle label="Criminal Record?" checked={activeProfile.legal.hasCriminalRecord} onChange={v => dispatch(updateActiveProfile({path: 'legal.hasCriminalRecord', value: v}))} />
                <Toggle label="Non-Compete?" checked={activeProfile.legal.subjectToNonCompete} onChange={v => dispatch(updateActiveProfile({path: 'legal.subjectToNonCompete', value: v}))} />
                <Toggle label="Ever Discharged?" checked={activeProfile.legal.everDischargedFromJob} onChange={v => dispatch(updateActiveProfile({path: 'legal.everDischargedFromJob', value: v}))} />
                <Toggle label="Former Employee?" checked={activeProfile.legal.formerEmployee} onChange={v => dispatch(updateActiveProfile({path: 'legal.formerEmployee', value: v}))} />
             </div>
          </Section>

          {/* 5. LOGISTICS & AVAILABILITY */}
          <Section title="Logistics" icon={<Briefcase size={18}/>}>
             <Select label="Notice Period" value={activeProfile.availability.noticePeriod} onChange={v => dispatch(updateActiveProfile({path: 'availability.noticePeriod', value: v}))}>
              {['Immediate', '2 weeks', '1 month', '2 months', '3 months'].map(o => <option key={o} value={o}>{o}</option>)}
            </Select>
            <Input label="Earliest Start Date" type="date" value={activeProfile.availability.earliestStartDate?.split('T')[0] || ""} onChange={v => dispatch(updateActiveProfile({path: 'availability.earliestStartDate', value: v}))} icon={<Calendar size={14}/>} />
            <Select label="Willing to Travel" value={activeProfile.availability.willingToTravel} onChange={v => dispatch(updateActiveProfile({path: 'availability.willingToTravel', value: v}))}>
              {['0%', '25%', '50%', '75%', '100%'].map(o => <option key={o} value={o}>{o}</option>)}
            </Select>
          </Section>

          {/* 6. LANGUAGES */}
          <Section title="Languages" icon={<Globe size={18}/>}>
            <div className="space-y-3">
              {(activeProfile.languages || []).map((l, i) => (
                <div key={i} className="flex gap-2">
                  <input className="p-3 rounded-xl text-xs font-bold flex-1 outline-none bg-[color:var(--color-background-tertiary)]" value={l.language} onChange={(e) => {
                    const newL = [...activeProfile.languages];
                    newL[i] = { ...newL[i], language: e.target.value };
                    dispatch(updateActiveProfile({path: 'languages', value: newL}));
                  }}/>
                  <Select value={l.proficiency} noLabel onChange={(v) => {
                    const newL = [...activeProfile.languages];
                    newL[i] = { ...newL[i], proficiency: v };
                    dispatch(updateActiveProfile({path: 'languages', value: newL}));
                  }}>
                    {['Native', 'Fluent', 'Professional', 'Intermediate', 'Beginner'].map(p => <option key={p} value={p}>{p}</option>)}
                  </Select>
                </div>
              ))}
              <button onClick={() => dispatch(updateActiveProfile({path: 'languages', value: [...(activeProfile.languages || []), { language: "New", proficiency: "Professional" }]}))} className="text-[10px] font-black uppercase text-[color:var(--color-button-primary-bg)] flex items-center gap-1 transition-transform hover:translate-x-1">
                <Plus size={12}/> Add Language
              </button>
            </div>
          </Section>

          {/* 7. SOCIAL & LINKS */}
          <Section title="Social Links" icon={<LinkIcon size={18}/>}>
              <div className="space-y-4">
                <Input label="LinkedIn" value={activeProfile.links.linkedin} icon={<Linkedin size={14}/>} onChange={v => dispatch(updateActiveProfile({path: 'links.linkedin', value: v}))} />
                <Input label="GitHub" value={activeProfile.links.github} icon={<Github size={14}/>} onChange={v => dispatch(updateActiveProfile({path: 'links.github', value: v}))} />
                <Input label="Portfolio" value={activeProfile.links.portfolio} icon={<PortfolioIcon size={14}/>} onChange={v => dispatch(updateActiveProfile({path: 'links.portfolio', value: v}))} />
                
                {(activeProfile.links.other || []).map((link, idx) => (
                    <div key={idx} className="flex gap-2 animate-in fade-in slide-in-from-left-2">
                        <Input noLabel placeholder="Label" value={link.label} onChange={v => {
                            const newLinks = [...activeProfile.links.other];
                            newLinks[idx] = { ...newLinks[idx], label: v };
                            dispatch(updateActiveProfile({path: 'links.other', value: newLinks}));
                        }} />
                        <Input noLabel placeholder="URL" value={link.url} onChange={v => {
                            const newLinks = [...activeProfile.links.other];
                            newLinks[idx] = { ...newLinks[idx], url: v };
                            dispatch(updateActiveProfile({path: 'links.other', value: newLinks}));
                        }} />
                    </div>
                ))}
                <button onClick={() => dispatch(updateActiveProfile({path: 'links.other', value: [...(activeProfile.links.other || []), { label: "", url: "" }]}))} className="text-[10px] font-black uppercase text-[color:var(--color-button-primary-bg)] flex items-center gap-1">
                  <Plus size={12}/> Add Custom Link
                </button>
              </div>
          </Section>

        </div>
      </div>
    </div>
  );
}