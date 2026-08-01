"use client";

import { Header } from '@/components/Header';
import { Download, Upload, Users, Activity, FileText, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

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
    <div className="min-h-screen bg-[#F8F9FA]">
      <Header userName={userName} userRole={userRole} />
      
      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-stone-900">Researcher Dashboard</h1>
          <p className="mt-1 text-sm text-stone-500">Manage datasets, monitor progress, and export data.</p>
        </div>

        {/* Top Metrics */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 mb-8">
          <div className="overflow-hidden rounded-xl bg-white px-6 py-5 shadow-sm border border-stone-200 flex items-center space-x-4">
            <div className="p-3 bg-stone-100 text-stone-600 rounded-lg">
              <FileText size={24} />
            </div>
            <div>
              <dt className="text-sm font-medium text-stone-500">Total Samples</dt>
              <dd className="mt-1 text-2xl font-semibold text-stone-900">{metrics.totalSamples}</dd>
            </div>
          </div>
          
          <div className="overflow-hidden rounded-xl bg-white px-6 py-5 shadow-sm border border-stone-200 flex items-center space-x-4">
            <div className="p-3 bg-orange-100 text-orange-600 rounded-lg">
              <Users size={24} />
            </div>
            <div>
              <dt className="text-sm font-medium text-stone-500">Assignments</dt>
              <dd className="mt-1 text-2xl font-semibold text-stone-900">{metrics.totalAssignments}</dd>
            </div>
          </div>

          <div className="overflow-hidden rounded-xl bg-white px-6 py-5 shadow-sm border border-stone-200 flex items-center space-x-4">
            <div className="p-3 bg-emerald-100 text-emerald-600 rounded-lg">
              <CheckCircle2 size={24} />
            </div>
            <div>
              <dt className="text-sm font-medium text-stone-500">Completed</dt>
              <dd className="mt-1 text-2xl font-semibold text-stone-900">{metrics.completedAnnotations}</dd>
            </div>
          </div>
        </div>

        {/* Action Cards */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 mb-8">
          {/* Upload Card */}
          <div 
            onClick={() => handleUpcomingFeature('dataset uploading')}
            className="flex flex-col rounded-xl bg-white p-6 shadow-sm border border-stone-200 hover:border-teal-500 hover:shadow-md transition-all cursor-pointer group"
          >
            <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-teal-50 text-teal-600 group-hover:bg-teal-600 group-hover:text-white transition-colors">
              <Upload size={20} />
            </div>
            <h3 className="text-lg font-medium text-stone-900">Upload Dataset</h3>
            <p className="mt-1 text-sm text-stone-500">Import new JSONL samples for annotation.</p>
          </div>

          {/* Assignments Card */}
          <div 
            onClick={() => handleUpcomingFeature('sample assignment')}
            className="flex flex-col rounded-xl bg-white p-6 shadow-sm border border-stone-200 hover:border-teal-500 hover:shadow-md transition-all cursor-pointer group"
          >
            <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-teal-50 text-teal-600 group-hover:bg-teal-600 group-hover:text-white transition-colors">
              <Users size={20} />
            </div>
            <h3 className="text-lg font-medium text-stone-900">Manage Therapists</h3>
            <p className="mt-1 text-sm text-stone-500">Assign samples and track progress.</p>
          </div>

          {/* Export Card */}
          <div 
            onClick={handleExport}
            className="flex flex-col rounded-xl bg-white p-6 shadow-sm border border-stone-200 hover:border-teal-500 hover:shadow-md transition-all cursor-pointer group"
          >
            <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-teal-50 text-teal-600 group-hover:bg-teal-600 group-hover:text-white transition-colors">
              <Download size={20} />
            </div>
            <h3 className="text-lg font-medium text-stone-900">Export Annotations</h3>
            <p className="mt-1 text-sm text-stone-500">Download completed annotations in CSV format.</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="rounded-xl bg-white shadow-sm border border-stone-200 p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Activity className="text-stone-400" size={20} />
            <h2 className="text-lg font-medium text-stone-900">Overall Progress</h2>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex-1 bg-stone-100 rounded-full h-4 overflow-hidden">
              <div 
                className="bg-teal-600 h-4 rounded-full transition-all duration-500"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
            <span className="text-sm font-medium text-stone-700 w-12 text-right">{progressPercentage}%</span>
          </div>
          <p className="mt-3 text-sm text-stone-500">
            {metrics.completedAnnotations} of {metrics.totalAssignments} assigned samples have been annotated.
          </p>
        </div>
      </main>
    </div>
  );
}
