"use server";

import { createClient } from "@/utils/supabase/server";

export async function assignSamples(therapistId: string, count: number) {
  const supabase = createClient();
  
  // 1. Authorize user is researcher or admin
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { error: 'Unauthorized' };
  }
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();
    
  if (!profile || (profile.role !== 'researcher' && profile.role !== 'admin')) {
    return { error: 'Unauthorized. Only researchers and admins can assign samples.' };
  }

  if (count <= 0) {
    return { error: 'Count must be greater than 0.' };
  }

  // 2. Query for unassigned samples
  const { data: unassignedSamples, error: fetchError } = await supabase
    .from('samples')
    .select('id')
    .is('therapist_id', null)
    .limit(count);
    
  if (fetchError) {
    console.error("Error fetching samples:", fetchError);
    return { error: 'Failed to fetch unassigned samples.' };
  }

  if (!unassignedSamples || unassignedSamples.length < count) {
    return { error: `Only ${unassignedSamples?.length || 0} unassigned samples remaining.` };
  }

  // 3. Update those specific rows
  const sampleIds = unassignedSamples.map(s => s.id);
  
  const { error: updateError } = await supabase
    .from('samples')
    .update({ therapist_id: therapistId })
    .in('id', sampleIds);

  if (updateError) {
    console.error("Error updating samples:", updateError);
    return { error: 'Failed to assign samples.' };
  }

  return { success: true, count: sampleIds.length };
}
