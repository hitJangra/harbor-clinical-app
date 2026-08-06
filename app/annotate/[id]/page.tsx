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

  // Fetch existing draft if any
  const { data: existingDraft } = await supabase
    .from('annotations')
    .select('*')
    .eq('sample_id', sampleId)
    .eq('therapist_id', user.id)
    .single();

  const status = existingDraft?.status || 'not started';

  return (
    <AnnotateClient 
      sample={sampleData as { id: string; source: string; context: string; gold_response: string }} 
      assignment={{ status }} 
      existingDraft={existingDraft} 
    />
  );
}
