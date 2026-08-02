'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';

export default function DemoSwitcher() {
  const router = useRouter();
  const supabase = createClient();
  const [loadingRole, setLoadingRole] = useState<string | null>(null);

  const handleSwitch = async (role: string) => {
    setLoadingRole(role);
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
      setLoadingRole(null);
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
          disabled={loadingRole !== null}
          className="bg-amber-400 hover:bg-amber-300 px-3 py-1.5 rounded-md transition-colors disabled:opacity-50 shadow-sm border border-amber-500/50 flex items-center justify-center min-w-[150px]"
        >
          {loadingRole === 'therapist' ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-amber-950" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Switching...
            </>
          ) : 'View as Therapist'}
        </button>
        <button
          onClick={() => handleSwitch('researcher')}
          disabled={loadingRole !== null}
          className="bg-amber-400 hover:bg-amber-300 px-3 py-1.5 rounded-md transition-colors disabled:opacity-50 shadow-sm border border-amber-500/50 flex items-center justify-center min-w-[150px]"
        >
          {loadingRole === 'researcher' ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-amber-950" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Switching...
            </>
          ) : 'View as Researcher'}
        </button>
        <button
          onClick={() => handleSwitch('admin')}
          disabled={loadingRole !== null}
          className="bg-amber-400 hover:bg-amber-300 px-3 py-1.5 rounded-md transition-colors disabled:opacity-50 shadow-sm border border-amber-500/50 flex items-center justify-center min-w-[150px]"
        >
          {loadingRole === 'admin' ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-amber-950" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Switching...
            </>
          ) : 'View as Admin'}
        </button>
      </div>
    </div>
  );
}
