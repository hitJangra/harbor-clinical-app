"use client";

import { ShieldCheck } from 'lucide-react';
import { useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        setError(signInError.message);
        return;
      }

      if (data.user) {
        // Fetch role to determine routing
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', data.user.id)
          .single();
          
        const role = profile?.role;
        
        let redirectPath = '/dashboard';
        if (role === 'admin') redirectPath = '/admin';
        else if (role === 'researcher') redirectPath = '/researcher';
        
        router.push(redirectPath);
        router.refresh();
      }
    } catch (err) {
      console.error(err);
      setError('An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    setError(null);
    try {
      const { error: googleError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (googleError) {
        setError(googleError.message);
      }
    } catch (err) {
      console.error(err);
      setError('An unexpected error occurred.');
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Left Pane - Neural/AI Theme Image */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-slate-900 items-center justify-center overflow-hidden">
        {/* Placeholder Unsplash neural network image */}
        <div 
          className="absolute inset-0 opacity-40 bg-cover bg-center"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=2565&auto=format&fit=crop')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/60 to-transparent" />
        <div className="relative z-10 max-w-lg px-12 text-left">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-white/10 backdrop-blur-md text-white mb-6 border border-white/20">
            <ShieldCheck size={28} />
          </div>
          <h1 className="text-4xl font-semibold tracking-tight text-white mb-4">
            Evaluating Sycophancy in Large Language Models
          </h1>
          <p className="text-lg text-slate-300 font-medium">
            Clinical Annotation Portal for Academic Research
          </p>
        </div>
      </div>

      {/* Right Pane - Login Form */}
      <div className="flex w-full lg:w-1/2 flex-col items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-sm space-y-8">
          <div className="flex flex-col items-start lg:hidden mb-8">
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-slate-900 text-white mb-4">
              <ShieldCheck size={24} />
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">
              Harbor Research
            </h2>
          </div>
          
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">
              Researcher Login
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Secure access for authorized lab personnel.
            </p>
          </div>
          
          {error && (
            <div className="text-sm text-red-700 bg-red-50 p-3 rounded border border-red-200">
              {error}
            </div>
          )}
          
          <form className="space-y-5" onSubmit={handleEmailLogin}>
            <div>
              <label className="block text-sm font-semibold text-slate-900" htmlFor="email">
                Institutional Email
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1.5 block w-full rounded border border-slate-300 px-3 py-2 text-slate-900 placeholder-slate-400 focus:border-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-800 sm:text-sm"
                placeholder="researcher@mit.edu"
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-slate-900" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1.5 block w-full rounded border border-slate-300 px-3 py-2 text-slate-900 placeholder-slate-400 focus:border-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-800 sm:text-sm"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading || googleLoading}
              className="mt-4 flex w-full justify-center rounded bg-slate-900 py-2.5 px-4 text-sm font-semibold text-white hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2 disabled:opacity-50 transition-colors shadow-sm"
            >
              {loading ? 'Authenticating...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center text-xs uppercase tracking-widest font-semibold">
                <span className="bg-slate-50 px-3 text-slate-400">External Provider</span>
              </div>
            </div>

            <div className="mt-6">
              <button
                onClick={handleGoogleLogin}
                type="button"
                disabled={loading || googleLoading}
                className="flex w-full items-center justify-center gap-3 rounded border border-slate-300 bg-white py-2.5 px-4 text-sm font-semibold text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2 disabled:opacity-50 transition-colors shadow-sm"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                  <path d="M1 1h22v22H1z" fill="none" />
                </svg>
                {googleLoading ? 'Redirecting...' : 'Sign in with Google'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
