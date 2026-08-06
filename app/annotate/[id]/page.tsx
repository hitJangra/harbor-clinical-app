import { createClient } from '@/utils/supabase/server';
import { AnnotateClient } from './AnnotateClient';
import { redirect } from 'next/navigation';

export default async function AnnotatePage({ params }: { params: { id: string } }) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const sampleId = params.id;

  // 1. Fetch user profile to check if they are an admin
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();
    
  const userRole = profile?.role || 'therapist';

  // Fetch the sample directly
  const { data: sampleData, error: sampleError } = await supabase
    .from('samples')
    .select('id, source, context, gold_response')
    .eq('id', sampleId)
    .single();

  if (!sampleData || sampleError) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#F8F9FA] text-stone-600">
        Sample not found.
      </div>
    );
  }

  // 2. Fetch ANY existing draft globally (Removed the user.id check!)
  // Using limit(1) instead of single() just in case two people clicked at the exact same time before this update
  const { data: existingDrafts } = await supabase
    .from('annotations')
    .select('*')
    .eq('sample_id', sampleId)
    .limit(1);

  const existingDraft = existingDrafts?.[0] || null;
  const status = existingDraft?.status || 'not started';

  return (
    <AnnotateClient 
      sample={sampleData as { id: string; source: string; context: string; gold_response: string }} 
      assignment={{ status }} 
      existingDraft={existingDraft} 
      userRole={userRole}
    />
  );
}