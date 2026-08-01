import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { ResearcherClient } from './ResearcherClient';

export default async function ResearcherPage() {
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

  // 2. Fetch Metrics (using count)
  const [{ count: samplesCount }, { count: assignmentsCount }, { count: completedCount }] = await Promise.all([
    supabase.from('samples').select('*', { count: 'exact', head: true }),
    supabase.from('sample_assignments').select('*', { count: 'exact', head: true }),
    supabase.from('annotations').select('*', { count: 'exact', head: true }).eq('is_draft', false)
  ]);

  return (
    <ResearcherClient
      userName={profile.full_name}
      userRole={profile.role}
      metrics={{
        totalSamples: samplesCount || 0,
        totalAssignments: assignmentsCount || 0,
        completedAnnotations: completedCount || 0,
      }}
    />
  );
}
