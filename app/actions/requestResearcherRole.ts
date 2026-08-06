"use server";

import { createClient } from '@/utils/supabase/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function requestResearcherRole() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'Not authenticated' };
  }

  // Fetch user profile for name
  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name')
    .eq('id', user.id)
    .single();

  const userName = profile?.full_name || 'Unknown User';

  // Insert into role_requests
  const { error: insertError } = await supabase
    .from('role_requests')
    .insert([{ user_id: user.id, status: 'pending' }]);

  if (insertError) {
    console.error('Error inserting role_request:', insertError);
    return { error: 'Failed to record request.' };
  }

  // Send email
  try {
    const adminEmail = process.env.ADMIN_EMAIL;
    const fromEmail = process.env.FROM_EMAIL || 'onboarding@resend.dev';

    if (adminEmail) {
      await resend.emails.send({
        from: fromEmail,
        to: adminEmail,
        subject: 'New Researcher Access Request',
        html: `<p>User <strong>${userName}</strong> (ID: ${user.id}) has requested Researcher access.</p>`
      });
    } else {
      console.warn('ADMIN_EMAIL not configured, skipping email.');
    }
  } catch (emailError) {
    console.error('Error sending email:', emailError);
    // Even if email fails, we recorded the request, so we can return success but maybe log the error.
  }

  return { success: true };
}
