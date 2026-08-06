"use client";

import { Header } from '@/components/Header';
import { Download, Upload, Users, Activity, FileText, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';

interface ResearcherClientProps {
  userName: string;
  userRole: string;
  metrics: {
    totalSamples: number;
    totalAssignments: number;
    completedAnnotations: number;
  };
}

export function ResearcherClient({ userName, userRole, metrics }: ResearcherClientProps) {
  
  const handleUpcomingFeature = (feature: string) => {
    toast.info(`Advanced ${feature} via UI is coming in V2!`, {
      description: "Currently handled via Python scripts for the beta.",
    });
  };

  const handleExport = () => {
    toast.loading("Preparing CSV export...", { id: "export-csv" });
    
    // Trigger download via API Route
    window.location.href = "/api/export";
    
    setTimeout(() => {
      toast.success("Download started!", { id: "export-csv" });
    }, 1500);
  };

  const progressPercentage = metrics.totalAssignments > 0 
    ? Math.round((metrics.completedAnnotations / metrics.totalAssignments) * 100) 
    : 0;

  return (
    <div className="min-h-screen bg-transparent">
      <Header userName={userName} userRole={userRole} />
      
      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight text-white">Researcher Dashboard</h1>
          <p className="mt-1 text-sm font-medium text-neutral-400">Manage datasets, monitor progress, and export data.</p>
        </div>

        {/* Top Metrics */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 mb-8">
          <div className="overflow-hidden rounded-2xl bg-white/[0.03] backdrop-blur-2xl border border-white/[0.08] shadow-2xl px-6 py-5 flex items-center space-x-4">
            <div className="p-3 bg-white/10 text-white rounded-xl">
              <FileText size={24} />
            </div>
            <div>
              <dt className="text-sm font-semibold text-neutral-400">Total Samples</dt>
              <dd className="mt-1 text-2xl font-bold tracking-tight text-white">{metrics.totalSamples}</dd>
            </div>
          </div>
          
          <div className="overflow-hidden rounded-2xl bg-white/[0.03] backdrop-blur-2xl border border-white/[0.08] shadow-2xl px-6 py-5 flex items-center space-x-4">
            <div className="p-3 bg-white/10 text-white rounded-xl">
              <Users size={24} />
            </div>
            <div>
              <dt className="text-sm font-semibold text-neutral-400">Assignments</dt>
              <dd className="mt-1 text-2xl font-bold tracking-tight text-white">{metrics.totalAssignments}</dd>
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl bg-white/[0.03] backdrop-blur-2xl border border-white/[0.08] shadow-2xl px-6 py-5 flex items-center space-x-4">
            <div className="p-3 bg-white/10 text-white rounded-xl">
              <CheckCircle2 size={24} />
            </div>
            <div>
              <dt className="text-sm font-semibold text-neutral-400">Completed</dt>
              <dd className="mt-1 text-2xl font-bold tracking-tight text-white">{metrics.completedAnnotations}</dd>
            </div>
          </div>
        </div>

        {/* Action Cards */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 mb-8">
          {/* Upload Card */}
          <div 
            onClick={() => handleUpcomingFeature('dataset uploading')}
            className="flex flex-col rounded-2xl bg-white/[0.03] backdrop-blur-2xl border border-white/[0.08] p-6 shadow-2xl hover:bg-white/[0.06] hover:border-white/20 transition-all cursor-pointer group"
          >
            <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-neutral-400 group-hover:bg-white/20 group-hover:text-white transition-colors">
              <Upload size={20} />
            </div>
            <h3 className="text-lg font-bold text-white">Upload Dataset</h3>
            <p className="mt-1 text-sm font-medium text-neutral-400">Import new JSONL samples for annotation.</p>
          </div>

          {/* Assignments Card */}
          <Link 
            href="/researcher/therapists"
            className="flex flex-col rounded-2xl bg-white/[0.03] backdrop-blur-2xl border border-white/[0.08] p-6 shadow-2xl hover:bg-white/[0.06] hover:border-white/20 transition-all cursor-pointer group"
          >
            <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-neutral-400 group-hover:bg-white/20 group-hover:text-white transition-colors">
              <Users size={20} />
            </div>
            <h3 className="text-lg font-bold text-white">Manage Therapists</h3>
            <p className="mt-1 text-sm font-medium text-neutral-400">Assign samples and track progress.</p>
          </Link>

          {/* Export Card */}
          <div 
            onClick={handleExport}
            className="flex flex-col rounded-2xl bg-white/[0.03] backdrop-blur-2xl border border-white/[0.08] p-6 shadow-2xl hover:bg-white/[0.06] hover:border-white/20 transition-all cursor-pointer group"
          >
            <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-neutral-400 group-hover:bg-white/20 group-hover:text-white transition-colors">
              <Download size={20} />
            </div>
            <h3 className="text-lg font-bold text-white">Export Annotations</h3>
            <p className="mt-1 text-sm font-medium text-neutral-400">Download completed annotations in CSV format.</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="rounded-2xl bg-white/[0.03] backdrop-blur-2xl border border-white/[0.08] shadow-2xl p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Activity className="text-neutral-400" size={20} />
            <h2 className="text-lg font-bold text-white">Overall Progress</h2>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex-1 bg-white/10 rounded-full h-4 overflow-hidden shadow-inner">
              <div 
                className="bg-white h-4 rounded-full transition-all duration-500 shadow-[0_0_10px_rgba(255,255,255,0.5)]"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
            <span className="text-sm font-bold text-white w-12 text-right">{progressPercentage}%</span>
          </div>
          <p className="mt-3 text-sm font-medium text-neutral-400">
            {metrics.completedAnnotations} of {metrics.totalAssignments} assigned samples have been annotated.
          </p>
        </div>
      </main>
    </div>
  );
}
