import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { TherapistTableClient } from './TherapistTableClient';
import { Header } from '@/components/Header';

export default async function TherapistsPage() {
  const supabase = createClient();
  
  // 1. Authorize user
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect('/login');
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, role')
    .eq('id', user.id)
    .single();

  if (!profile || (profile.role !== 'researcher' && profile.role !== 'admin')) {
    redirect('/dashboard');
  }

  // 2. Fetch therapists
  const { data: therapists } = await supabase
    .from('profiles')
    .select('id, full_name')
    .eq('role', 'therapist')
    .order('full_name');

  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      <Header userName={profile.full_name || ''} userRole={profile.role} />
      
      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link 
            href="/researcher" 
            className="inline-flex items-center text-sm font-medium text-stone-500 hover:text-stone-900 transition-colors"
          >
            <ChevronLeft size={16} className="mr-1" />
            Back to Dashboard
          </Link>
        </div>

        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-stone-900">Manage Therapists</h1>
          <p className="mt-1 text-sm text-stone-500">
            View all registered therapists and assign samples to them.
          </p>
        </div>

        <TherapistTableClient therapists={therapists || []} />
      </main>
    </div>
  );
}
