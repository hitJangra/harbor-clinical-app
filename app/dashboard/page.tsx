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

  // Fetch annotations by the current user
  const { data: userAnnotations } = await supabase
    .from('annotations')
    .select('sample_id, status')
    .eq('therapist_id', user.id);

  const safeAnnotations = userAnnotations || [];

  // Map annotations for quick lookup
  const annotationMap = new Map(safeAnnotations.map(a => [a.sample_id, a.status]));

  const totalSamples = safeSamples.length;
  const completedCount = safeAnnotations.filter(a => a.status === 'completed').length;
  const remainingCount = totalSamples - completedCount;

  const userName = profile?.full_name || 'Therapist';
  const userRole = profile?.role || 'Therapist';

  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      <Header userName={userName} userRole={userRole} />
      
      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-stone-900">Good afternoon, {userName.split(' ')[0]}</h1>
            <p className="mt-1 text-sm text-stone-500">Shared task pool</p>
          </div>
          <div>
            <RequestAccessButton />
          </div>
        </div>

        {/* Summary Metric Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 mb-8">
          <div className="overflow-hidden rounded-xl bg-white px-6 py-5 shadow-sm border border-stone-200">
            <dt className="truncate text-sm font-medium text-stone-500">Total Samples</dt>
            <dd className="mt-2 text-3xl font-semibold tracking-tight text-stone-900">{totalSamples}</dd>
          </div>
          <div className="overflow-hidden rounded-xl bg-white px-6 py-5 shadow-sm border border-stone-200">
            <dt className="truncate text-sm font-medium text-stone-500">Completed by You</dt>
            <dd className="mt-2 text-3xl font-semibold tracking-tight text-teal-600">{completedCount}</dd>
          </div>
          <div className="overflow-hidden rounded-xl bg-white px-6 py-5 shadow-sm border border-stone-200">
            <dt className="truncate text-sm font-medium text-stone-500">Remaining for You</dt>
            <dd className="mt-2 text-3xl font-semibold tracking-tight text-stone-900">{remainingCount}</dd>
          </div>
        </div>

        {/* Sample List Table */}
        <div className="overflow-hidden rounded-xl bg-white shadow-sm border border-stone-200">
          <ul role="list" className="divide-y divide-stone-200">
            {safeSamples.length === 0 ? (
              <li className="px-6 py-8 text-center text-stone-500 text-sm">No samples available in the pool yet.</li>
            ) : (
              safeSamples.map((sample) => {
                const status = annotationMap.get(sample.id) || 'not started';
                const isCompleted = status === 'completed';
                const statusColor = isCompleted
                  ? 'bg-emerald-100 text-emerald-800'
                  : status === 'draft'
                  ? 'bg-orange-100 text-orange-800'
                  : 'bg-stone-100 text-stone-800';

                return (
                  <li key={sample.id} className={`flex items-center justify-between px-6 py-4 transition-colors ${isCompleted ? 'bg-stone-50 opacity-75' : 'hover:bg-stone-50'}`}>
                    <div className="flex items-center space-x-4">
                      <span className="text-sm font-medium text-stone-900">{sample.id}</span>
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${statusColor}`}>
                        {status === 'draft' ? 'in progress' : status}
                      </span>
                    </div>
                    <Link
                      href={`/annotate/${sample.id}`}
                      className="flex items-center space-x-1 text-sm font-medium text-teal-600 hover:text-teal-700 transition-colors"
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
