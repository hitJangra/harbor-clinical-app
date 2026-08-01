import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

export default async function RootPage() {
  const supabase = createClient();
  
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  const role = profile?.role;

  if (role === 'admin') {
    redirect('/admin');
  } else if (role === 'researcher') {
    redirect('/researcher');
  } else {
    redirect('/dashboard');
  }
}