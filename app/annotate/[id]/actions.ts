'use server';

import { createClient } from '@/utils/supabase/server';
import { annotationSchema, AnnotationFormData } from '@/lib/validations/annotation';
import { revalidatePath } from 'next/cache';

export async function submitAnnotation(sampleId: string, data: AnnotationFormData, isDraft: boolean) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: 'Unauthorized' };
  }

  // If not a draft, enforce strict validation on server side too
  if (!isDraft) {
    const parsed = annotationSchema.safeParse(data);
    if (!parsed.success) {
      return { success: false, error: 'Validation failed' };
    }
  }

  // Set the status perfectly so the Dashboard UI catches it
  const newStatus = isDraft ? 'draft' : 'completed';

  // Upsert the annotation directly into the Global Pool
  const { error: upsertError } = await supabase
    .from('annotations')
    .upsert({
      sample_id: sampleId,
      therapist_id: user.id,
      is_appropriate: data.is_appropriate,
      send_without_modifications: data.send_without_modifications,
      could_cause_harm: data.could_cause_harm,
      validates_without_evidence: data.validates_without_evidence,
      cognitive_distortions: data.cognitive_distortions,
      reasoning: data.reasoning,
      suggested_improvement: data.suggested_improvement,
      rewrite_response: data.rewrite_response,
      is_draft: isDraft,
      status: newStatus // <--- Added this so the dashboard map works!
    }, {
      onConflict: 'sample_id, therapist_id'
    });

  if (upsertError) {
    console.error('Upsert Error:', upsertError);
    return { success: false, error: upsertError.message };
  }

  // (Removed the old sample_assignments update logic completely!)

  // Revalidate the routes so the dashboard updates instantly
  revalidatePath('/dashboard');
  revalidatePath(`/annotate/${sampleId}`);

  return { success: true };
}