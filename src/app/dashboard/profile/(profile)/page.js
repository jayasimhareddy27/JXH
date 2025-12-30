'use client';

import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { returnuseReference } from "@lib/redux/features/resumes/resumecrud/thunks";
import Link from 'next/link';
import { ChevronRight, Edit,BarChart3, Star, Eye, Bot, HardDrive, User, FileText, Upload, Briefcase } from 'lucide-react';
import { useRouter } from "next/navigation";

function useHydrated() {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);
  return hydrated;
}

const InfoCard = ({ href, icon: Icon, title, description, badge }) => (
  <Link href={href} className="group p-5 rounded-2xl border border-[color:var(--color-border-primary)] bg-[color:var(--color-background-primary)] hover:border-[color:var(--color-cta-bg)] transition-all shadow-sm">
    <div className="flex justify-between items-start mb-4">
      <div className="p-3 rounded-xl bg-[color:var(--color-card-bg)] border border-[color:var(--color-border-primary)] group-hover:border-[color:var(--color-cta-bg)] transition-colors">
        <Icon className="text-[color:var(--color-cta-bg)]" size={24} />
      </div>
      {badge && <span className="text-[10px] font-bold px-2 py-1 rounded-md bg-[color:var(--color-cta-bg)] text-white uppercase">{badge}</span>}
    </div>
    <h3 className="font-bold text-lg text-[color:var(--color-text-primary)] group-hover:text-[color:var(--color-cta-bg)] transition-colors">{title}</h3>
    <p className="text-sm text-[color:var(--color-text-secondary)] mt-1">{description}</p>
    <div className="mt-4 flex items-center text-xs font-semibold text-[color:var(--color-cta-bg)] opacity-0 group-hover:opacity-100 transition-opacity">
      Edit Details <ChevronRight size={14} />
    </div>
  </Link>
);

export default function ProfilePage() {
  const dispatch = useDispatch();
  const router = useRouter();

  const { user, favResumeTemplateId } = useSelector((state) => state.auth);

  
  const [Profile, setProfile] = useState(null);

  const hydrated = useHydrated();
  const displayName = hydrated ? (user?.name || "Guest") : "...";
  
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
    } else {
      const UserReference = dispatch(returnuseReference(token));
      UserReference.then((res) => {
          setProfile(res.payload.references);
      });
    }
  }, [dispatch, router]);

  
  

  const favoriteTemplate = hydrated ? (favResumeTemplateId || "None Selected") : "...";

  // Simplified Sidebar Settings
  const sidebarSettings = [
    { href: "/dashboard/profile/account", icon: Edit, title: "Account", description: "Email & Password" },
    { href: "/settings", icon: Bot, title: "AI Settings", description: "API Keys & Models" },
    { icon: HardDrive, title: "Storage", description: "Files (Soon)" },
  ];

  return (
    <main className="min-h-screen bg-[color:var(--color-background-primary)] p-4 sm:p-6 md:p-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8">

        {/* Sidebar */}
        <aside className="space-y-3 lg:col-span-1">
          {sidebarSettings.map((item) => (
            <Link key={item.title} href={item.href || "#"}>
              <div className="flex items-center gap-4 p-4 rounded-xl border border-[color:var(--color-border-primary)] bg-[color:var(--color-card-bg)] hover:scale-[1.02] transition cursor-pointer">
                <item.icon className="text-[color:var(--color-cta-bg)]" size={20} />
                <div>
                  <h3 className="font-semibold text-sm text-[color:var(--color-text-primary)]">{item.title}</h3>
                  <p className="text-[10px] text-[color:var(--color-text-secondary)]">{item.description}</p>
                </div>
              </div>
            </Link>
          ))}
        </aside>

        {/* Main content */}
        <section className="space-y-8 lg:col-span-3 p-8 rounded-2xl border border-[color:var(--color-border-primary)] bg-[color:var(--color-card-bg)] shadow-sm">
          
{/* Header */}
<div className="flex flex-col md:flex-row items-center justify-between gap-6 border-b border-[color:var(--color-border-primary)] pb-8">
  <div className="text-center md:text-left">
    <h1 className="text-4xl font-extrabold text-[color:var(--color-text-primary)] tracking-tight">
      Hello, <span className="text-[color:var(--color-cta-bg)]">{displayName}</span>
    </h1>
    <p className="text-lg mt-2 text-[color:var(--color-text-secondary)]">
      Welcome to your professional command center.
    </p>
  </div>
  
  {/* Job Analytics Shortcut */}
  <Link 
    href="/dashboard/analytics" 
    className="flex items-center gap-3 px-5 py-2.5 rounded-xl bg-[color:var(--color-background-primary)] border border-[color:var(--color-border-primary)] hover:border-[color:var(--color-cta-bg)] hover:shadow-md transition-all group"
  >
    <div className="p-2 rounded-lg bg-[color:var(--color-card-bg)] group-hover:bg-[color:var(--color-cta-bg)] transition-colors">
      <BarChart3 size={20} className="text-[color:var(--color-cta-bg)] group-hover:text-white" />
    </div>
    <div className="text-left">
      <p className="text-[10px] font-bold uppercase tracking-wider text-[color:var(--color-text-secondary)]">Insights</p>
      <p className="text-sm font-bold text-[color:var(--color-text-primary)]">Job Analytics</p>
    </div>
    <ChevronRight size={16} className="text-[color:var(--color-text-secondary)] group-hover:translate-x-1 transition-transform" />
  </Link>
</div>

          {/* 1. AI Connection Card (Access Section) */}

          {/* 2. Preferences & Style Section (Moved from Sidebar) */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-[color:var(--color-text-primary)] px-1">Personalization & Style</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InfoCard 
                href="/dashboard/profile/templateselection" 
                icon={Star} 
                title="Resume Template" 
                description={`Current: ${favoriteTemplate}`}
                badge="Design"
              />
              <InfoCard 
                href="/dashboard/profile/templateselection" 
                icon={FileText} 
                title="Cover Letter Style" 
                description="Select how your letters look to employers"
                badge="Design"
              />
              <InfoCard 
                href={`/dashboard/myresumes/${Profile?.myProfileRef}`} 
                icon={Eye} 
                title="Professional Info" 
                description="Work history and skills for AI automation"
                badge="Data"
              />
              <InfoCard 
                href="/dashboard/profile/edit/preferences" 
                icon={Briefcase} 
                title="Job Preferences" 
                description="Location, salary, and job titles you want"
                badge="Search"
              />
            </div>
          </div>

        </section>
      </div>
    </main>
  );
}