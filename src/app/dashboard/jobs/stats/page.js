"use client";
import { useEffect } from "react";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { fetchJobs, updateJob } from "@lib/redux/features/job/thunks";
import { BarChart3, CheckCircle2, Send, Clock, Briefcase, ChevronRight } from "lucide-react";
import Link from "next/link";

export default function JobTrackerStats() {
  const dispatch = useDispatch();

  // Updated to use trackerListing from your jobsStore
  const { items, loading, token } = useSelector(
    (state) => ({ 
      items: state.jobsStore.trackerListing,
      loading: state.jobsStore.loading,
      token: state.auth.token 
    }), 
    shallowEqual
  );

  useEffect(() => {
    if (token) dispatch(fetchJobs("tracker"));
  }, [dispatch, token]);

  // Motivational Metrics Logic
  const stats = {
    total: items?.length || 0,
    interviewing: items?.filter(j => j.status === 'interviewing').length || 0,
    appliedToday: items?.filter(j => 
      new Date(j.createdAt).toDateString() === new Date().toDateString()
    ).length || 0,
    successRate: items?.length > 0 
      ? ((items.filter(j => j.status === 'offer').length / items.length) * 100).toFixed(0) 
      : 0
  };

  const handleStatusChange = (jobId, companyName, newStatus) => {
    dispatch(updateJob({ jobId, status: newStatus, companyName }));
  };

  return (
    <div className="p-8 max-w-7xl mx-auto min-h-screen bg-[color:var(--color-background-primary)]">
      <header className="mb-10">
        <h1 className="text-3xl font-bold text-gray-900">Application Tracker</h1>
        <p className="text-gray-500">Analyze your progress and stay motivated, Jayasimha.</p>
      </header>

      {/* Motivational KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <StatCard icon={<Send size={20}/>} label="Total Applied" value={stats.total} color="blue" />
        <StatCard icon={<Clock size={20}/>} label="Applied Today" value={stats.appliedToday} color="purple" />
        <StatCard icon={<BarChart3 size={20}/>} label="Interviews" value={stats.interviewing} color="yellow" />
        <StatCard icon={<CheckCircle2 size={20}/>} label="Success Rate" value={`${stats.successRate}%`} color="green" />
      </div>


    </div>
  );
}

function StatCard({ icon, label, value, color }) {
  const colors = {
    blue: "bg-blue-50 text-blue-600",
    purple: "bg-purple-50 text-purple-600",
    yellow: "bg-yellow-50 text-yellow-600",
    green: "bg-green-50 text-green-600"
  };
  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:border-blue-100 transition-colors">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${colors[color]}`}>
        {icon}
      </div>
      <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">{label}</p>
      <p className="text-3xl font-black text-gray-900">{value}</p>
    </div>
  );
}

function getStatusColor(status) {
  switch (status) {
    case 'interviewing': return "bg-yellow-50 text-yellow-700 hover:bg-yellow-100";
    case 'offer': return "bg-green-50 text-green-700 hover:bg-green-100";
    case 'rejected': return "bg-red-50 text-red-700 hover:bg-red-100";
    default: return "bg-blue-50 text-blue-700 hover:bg-blue-100";
  }
}