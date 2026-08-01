'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

export async function updateUserRole(userId: string, newRole: string) {
  const supabase = createClient();
  
  // 1. Authorize: Check if the requestor is an admin
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { success: false, error: 'Unauthorized' };
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (!profile || profile.role !== 'admin') {
    return { success: false, error: 'Forbidden. Only admins can change roles.' };
  }

  // 2. Validate the new role
  if (!['admin', 'researcher', 'therapist'].includes(newRole)) {
    return { success: false, error: 'Invalid role provided.' };
  }

  // 3. Update the role in the database
  const { error } = await supabase
    .from('profiles')
    .update({ role: newRole })
    .eq('id', userId);

  if (error) {
    console.error('Update Role Error:', error);
    return { success: false, error: error.message };
  }

  revalidatePath('/admin');
  return { success: true };
}
