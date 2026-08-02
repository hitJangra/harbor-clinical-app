'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';

export default function DemoSwitcher() {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);

  const handleSwitch = async (role: string) => {
    setLoading(true);
    try {
      // Clear existing session
      await supabase.auth.signOut();

      let email = '';
      let password = '';
      let redirect = '';

      switch (role) {
        case 'therapist':
          email = 'therapist@demo.com';
          password = 'password1234';
          redirect = '/dashboard';
          break;
        case 'researcher':
          email = 'researcher@demo.com';
          password = 'password123456';
          redirect = '/researcher';
          break;
        case 'admin':
          email = 'admin@demo.com';
          password = 'Password12345';
          redirect = '/admin';
          break;
      }

      // Sign in with new credentials
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Demo login error:', error.message);
        alert('Failed to login: ' + error.message);
      } else {
        // Redirect and refresh server components
        router.push(redirect);
        router.refresh();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-amber-500 text-amber-950 px-4 py-2 flex flex-col sm:flex-row items-center justify-center sm:justify-between gap-3 text-sm font-medium z-[100] sticky top-0 border-b border-amber-600 shadow-sm">
      <div className="flex items-center gap-2 font-bold tracking-tight">
        <span className="bg-amber-900 text-amber-400 px-2 py-0.5 rounded text-xs uppercase tracking-wider">
          Demo Mode
        </span>
        <span>One-Click Switcher</span>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-2">
        <button
          onClick={() => handleSwitch('therapist')}
          disabled={loading}
          className="bg-amber-400 hover:bg-amber-300 px-3 py-1.5 rounded-md transition-colors disabled:opacity-50 shadow-sm border border-amber-500/50 flex items-center justify-center min-w-[140px]"
        >
          View as Therapist
        </button>
        <button
          onClick={() => handleSwitch('researcher')}
          disabled={loading}
          className="bg-amber-400 hover:bg-amber-300 px-3 py-1.5 rounded-md transition-colors disabled:opacity-50 shadow-sm border border-amber-500/50 flex items-center justify-center min-w-[140px]"
        >
          View as Researcher
        </button>
        <button
          onClick={() => handleSwitch('admin')}
          disabled={loading}
          className="bg-amber-400 hover:bg-amber-300 px-3 py-1.5 rounded-md transition-colors disabled:opacity-50 shadow-sm border border-amber-500/50 flex items-center justify-center min-w-[140px]"
        >
          View as Admin
        </button>
      </div>
    </div>
  );
}
