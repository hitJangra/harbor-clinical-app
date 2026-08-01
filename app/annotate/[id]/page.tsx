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

  // Fetch assignment status and join with the sample data
  const { data: assignment, error: assignmentError } = await supabase
    .from('sample_assignments')
    .select(`
      status,
      samples (
        id,
        source,
        context,
        gold_response
      )
    `)
    .eq('sample_id', sampleId)
    .eq('therapist_id', user.id)
    .single();

  if (!assignment || assignmentError) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#F8F9FA] text-stone-600">
        Sample not found or you don&apos;t have access.
      </div>
    );
  }

  // Handle Supabase joining returning either an array or an object
  const sampleData = Array.isArray(assignment.samples) ? assignment.samples[0] : assignment.samples;

  if (!sampleData) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#F8F9FA] text-stone-600">
        Sample details could not be loaded.
      </div>
    );
  }

  // Fetch existing draft if any
  const { data: existingDraft } = await supabase
    .from('annotations')
    .select('*')
    .eq('sample_id', sampleId)
    .eq('therapist_id', user.id)
    .single();

  return (
    <AnnotateClient 
      sample={sampleData as { id: string; source: string; context: string; gold_response: string }} 
      assignment={{ status: assignment.status }} 
      existingDraft={existingDraft} 
    />
  );
}
