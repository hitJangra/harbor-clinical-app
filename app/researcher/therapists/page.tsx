import { createClient } from '@/utils/supabase/server';
import { createClient as createAdminClient } from '@supabase/supabase-js';
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

  const safeTherapists = therapists || [];

  // 3. Fetch auth users to get last_sign_in_at
  let authUsers: { id: string; last_sign_in_at?: string }[] = [];
  try {
    const supabaseAdmin = createAdminClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
    const { data: { users }, error: usersError } = await supabaseAdmin.auth.admin.listUsers();
    if (!usersError && users) {
      authUsers = users as { id: string; last_sign_in_at?: string }[];
    }
  } catch (err) {
    console.error('Failed to fetch auth users', err);
  }

  const authUserMap = new Map(authUsers.map(u => [u.id, u.last_sign_in_at]));

  const mergedTherapists = safeTherapists.map(therapist => {
    return {
      ...therapist,
      last_sign_in_at: authUserMap.get(therapist.id) || null
    };
  });

  return (
    <div className="min-h-screen bg-transparent">
      <Header userName={profile.full_name || ''} userRole={profile.role} />
      
      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link 
            href="/researcher" 
            className="inline-flex items-center text-sm font-medium text-neutral-400 hover:text-white transition-colors"
          >
            <ChevronLeft size={16} className="mr-1" />
            Back to Dashboard
          </Link>
        </div>

        <div className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight text-white">Therapist Directory</h1>
          <p className="mt-1 text-sm font-medium text-neutral-400">
            View all registered therapists and their current status.
          </p>
        </div>

        <TherapistTableClient therapists={mergedTherapists} />
      </main>
    </div>
  );
}
