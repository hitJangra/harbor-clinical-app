import { Header } from '@/components/Header';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { RequestAccessButton } from './RequestAccessButton';

export default async function DashboardPage() {
  const supabase = createClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Fetch user profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, role')
    .eq('id', user.id)
    .single();

  // Fetch ALL samples (for shared task pool)
  const { data: allSamples } = await supabase
    .from('samples')
    .select('*')
    .order('id');

  const safeSamples = allSamples || [];

  // Fetch ALL annotations globally (Removed the user.id filter!)
  const { data: globalAnnotations } = await supabase
    .from('annotations')
    .select('sample_id, status');

  const safeAnnotations = globalAnnotations || [];

  // Map annotations for quick lookup (Smart check: if ANY therapist completed it, lock it)
  const annotationMap = new Map();
  safeAnnotations.forEach(a => {
    if (annotationMap.get(a.sample_id) !== 'completed') {
      annotationMap.set(a.sample_id, a.status);
    }
  });

  const totalSamples = safeSamples.length;
  // Calculate completed based on the unique samples in our map
  const completedCount = Array.from(annotationMap.values()).filter(status => status === 'completed').length;
  const remainingCount = totalSamples - completedCount;

  const userName = profile?.full_name || 'Therapist';
  const userRole = profile?.role || 'Therapist';

  return (
    <div className="min-h-screen bg-slate-50">
      <Header userName={userName} userRole={userRole} />
      
      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Good afternoon, {userName.split(' ')[0]}</h1>
            <p className="mt-1 text-sm font-medium text-slate-500">Shared task pool</p>
          </div>
          <div>
            <RequestAccessButton />
          </div>
        </div>

        {/* Summary Metric Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 mb-8">
          <div className="overflow-hidden rounded-xl bg-white px-6 py-5 shadow-sm border border-slate-200">
            <dt className="truncate text-sm font-semibold text-slate-500">Total Samples</dt>
            <dd className="mt-2 text-3xl font-bold tracking-tight text-slate-900">{totalSamples}</dd>
          </div>
          <div className="overflow-hidden rounded-xl bg-white px-6 py-5 shadow-sm border border-slate-200">
            <dt className="truncate text-sm font-semibold text-slate-500">Global Completed</dt>
            <dd className="mt-2 text-3xl font-bold tracking-tight text-emerald-600">{completedCount}</dd>
          </div>
          <div className="overflow-hidden rounded-xl bg-white px-6 py-5 shadow-sm border border-slate-200">
            <dt className="truncate text-sm font-semibold text-slate-500">Global Remaining</dt>
            <dd className="mt-2 text-3xl font-bold tracking-tight text-slate-900">{remainingCount}</dd>
          </div>
        </div>

        {/* Sample List Table */}
        <div className="overflow-hidden rounded-xl bg-white shadow-sm border border-slate-200">
          <ul role="list" className="divide-y divide-stone-200">
            {safeSamples.length === 0 ? (
              <li className="px-6 py-8 text-center text-stone-500 text-sm">No samples available in the pool yet.</li>
            ) : (
              safeSamples.map((sample) => {
                const status = annotationMap.get(sample.id) || 'not started';
                const isCompleted = status === 'completed';
                const statusColor = isCompleted
                  ? 'bg-emerald-50 text-emerald-700'
                  : status === 'draft'
                  ? 'bg-amber-50 text-amber-700'
                  : 'bg-slate-100 text-slate-700';

                return (
                  <li key={sample.id} className={`flex items-center justify-between px-6 py-4 transition-colors ${isCompleted ? 'bg-slate-50 opacity-75' : 'hover:bg-slate-50'}`}>
                    <div className="flex items-center space-x-4">
                      <span className="text-sm font-medium text-stone-900">{sample.id}</span>
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${statusColor}`}>
                        {status === 'draft' ? 'in progress' : status}
                      </span>
                    </div>
                    <Link
                      href={`/annotate/${sample.id}`}
                      className="flex items-center space-x-1 text-sm font-semibold text-slate-900 hover:text-slate-600 transition-colors"
                    >
                      <span>{isCompleted ? 'View Only' : 'Open'}</span>
                      <ChevronRight size={16} />
                    </Link>
                  </li>
                );
              })
            )}
          </ul>
        </div>
      </main>
    </div>
  );
}