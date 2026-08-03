"use client";

import { ShieldCheck } from 'lucide-react';
import { useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();
  const [loadingRole, setLoadingRole] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSwitch = async (role: string) => {
    setLoadingRole(role);
    setError(null);
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
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        console.error('Demo login error:', signInError.message);
        setError('Failed to login: ' + signInError.message);
      } else {
        // Redirect and refresh server components
        router.push(redirect);
        router.refresh();
      }
    } catch (err) {
      console.error(err);
      setError('An unexpected error occurred.');
    } finally {
      setLoadingRole(null);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#F8F9FA] px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 rounded-xl bg-white p-10 shadow-sm border border-stone-200">
        <div className="flex flex-col items-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-teal-600 text-white">
            <ShieldCheck size={32} />
          </div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-stone-900">
            Sign in to Harbor
          </h2>
          <p className="mt-2 text-center text-sm text-stone-500">
            Select a role to continue
          </p>
        </div>
        
        <div className="mt-8 flex flex-col gap-4">
          {error && (
            <div className="text-sm text-red-600 text-center mb-2">
              {error}
            </div>
          )}
          
          <button
            onClick={() => handleSwitch('therapist')}
            disabled={loadingRole !== null}
            className="flex items-center justify-center w-full px-6 py-3 rounded-md bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold transition-colors disabled:opacity-50"
          >
            {loadingRole === 'therapist' ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Signing in...
              </>
            ) : 'View as Therapist'}
          </button>
          
          <button
            onClick={() => handleSwitch('researcher')}
            disabled={loadingRole !== null}
            className="flex items-center justify-center w-full px-6 py-3 rounded-md bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold transition-colors disabled:opacity-50"
          >
            {loadingRole === 'researcher' ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Signing in...
              </>
            ) : 'View as Researcher'}
          </button>
          
          <button
            onClick={() => handleSwitch('admin')}
            disabled={loadingRole !== null}
            className="flex items-center justify-center w-full px-6 py-3 rounded-md bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold transition-colors disabled:opacity-50"
          >
            {loadingRole === 'admin' ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Signing in...
              </>
            ) : 'View as Admin'}
          </button>
        </div>
      </div>
    </div>
  );
}
