"use client";

import { ShieldCheck, LogOut } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { useState } from 'react';

interface HeaderProps {
  userName?: string;
  userRole?: string;
}

export function Header({ userName = 'Dr. Rao', userRole = 'Therapist' }: HeaderProps) {
  const router = useRouter();
  const supabase = createClient();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  };

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-stone-200 bg-white px-6 shadow-sm">
      <div className="flex items-center space-x-3">
        <Link href="/dashboard" className="flex items-center space-x-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-teal-600 text-white">
            <ShieldCheck size={20} />
          </div>
          <span className="text-xl font-bold tracking-tight text-stone-900">Harbor</span>
        </Link>
        <div className="hidden h-5 w-px bg-stone-300 sm:block"></div>
        <span className="hidden rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700 sm:inline-block">
          Clinical Review
        </span>
      </div>

      <nav className="hidden md:flex items-center space-x-6 absolute left-1/2 -translate-x-1/2">
        <Link href="/dashboard" className="text-sm font-medium text-stone-600 hover:text-stone-900 transition-colors">
          Dashboard
        </Link>
        {(userRole?.toLowerCase() === 'researcher' || userRole?.toLowerCase() === 'admin') && (
          <Link href="/researcher" className="text-sm font-medium text-stone-600 hover:text-stone-900 transition-colors">
            Researcher
          </Link>
        )}
        {userRole?.toLowerCase() === 'admin' && (
          <Link href="/admin" className="text-sm font-medium text-stone-600 hover:text-stone-900 transition-colors">
            Admin Panel
          </Link>
        )}
      </nav>
      
      <div className="flex items-center space-x-4">
        <div className="hidden text-sm sm:block">
          <span className="font-medium text-stone-900">{userName}</span>
          <span className="text-stone-500"> — {userRole}</span>
        </div>
        <button 
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="flex items-center space-x-1 rounded-md px-3 py-2 text-sm font-medium text-stone-600 hover:bg-stone-100 hover:text-stone-900 transition-colors disabled:opacity-50"
        >
          <LogOut size={16} />
          <span className="hidden sm:inline">{isLoggingOut ? 'Logging out...' : 'Log out'}</span>
        </button>
      </div>
    </header>
  );
}
