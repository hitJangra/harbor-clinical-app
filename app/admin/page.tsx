import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { AdminClient } from './AdminClient';

export default async function AdminPage() {
  const supabase = createClient();
  
  // 1. Authorize: strictly admin
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect('/login');
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, role')
    .eq('id', user.id)
    .single();

  if (!profile || profile.role !== 'admin') {
    redirect('/dashboard');
  }

  // 2. Fetch all users
  const { data: allProfiles } = await supabase
    .from('profiles')
    .select('id, full_name, role')
    .order('full_name', { ascending: true });

  const safeProfiles = allProfiles || [];

  return (
    <AdminClient
      userName={profile.full_name}
      userRole={profile.role}
      profiles={safeProfiles}
    />
  );
}
