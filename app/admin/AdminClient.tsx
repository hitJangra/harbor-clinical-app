"use client";

import { Header } from '@/components/Header';
import { ShieldAlert, UserCog } from 'lucide-react';
import { toast } from 'sonner';
import { updateUserRole } from './actions';
import { useState } from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface Profile {
  id: string;
  full_name: string;
  role: string;
}

interface AdminClientProps {
  userName: string;
  userRole: string;
  profiles: Profile[];
}

export function AdminClient({ userName, userRole, profiles }: AdminClientProps) {
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleRoleChange = async (userId: string, newRole: string, currentRole: string) => {
    if (newRole === currentRole) return;
    
    setLoadingId(userId);
    const toastId = toast.loading(`Updating role to ${newRole}...`);

    const result = await updateUserRole(userId, newRole);

    if (result.success) {
      toast.success(`User role successfully updated to ${newRole}`, { id: toastId });
    } else {
      toast.error(result.error || 'Failed to update role', { id: toastId });
    }
    setLoadingId(null);
  };

  return (
    <div className="min-h-screen bg-transparent">
      <Header userName={userName} userRole={userRole} />
      
      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center space-x-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-500/10 text-red-500">
            <ShieldAlert size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white">Admin Controls</h1>
            <p className="mt-1 text-sm font-medium text-neutral-400">Manage user roles and system access.</p>
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl bg-white/[0.03] backdrop-blur-2xl border border-white/[0.08] shadow-2xl">
          <div className="border-b border-white/10 bg-black/20 px-6 py-4 flex items-center space-x-2">
            <UserCog size={18} className="text-neutral-400" />
            <h2 className="text-base font-bold text-white">User Management</h2>
          </div>
          <ul role="list" className="divide-y divide-white/5 bg-transparent">
            {profiles.length === 0 ? (
              <li className="px-6 py-8 text-center text-neutral-500 text-sm">No users found.</li>
            ) : (
              profiles.map((profile) => (
                <li key={profile.id} className="flex items-center justify-between px-6 py-4 hover:bg-white/5 transition-colors">
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-white">{profile.full_name || 'Unnamed User'}</span>
                    <span className="text-xs text-neutral-500 font-mono mt-0.5">{profile.id}</span>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <span className={cn(
                      "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold capitalize border",
                      profile.role === 'admin' ? "bg-red-500/10 text-red-500 border-red-500/20" :
                      profile.role === 'researcher' ? "bg-blue-500/10 text-blue-400 border-blue-500/20" :
                      "bg-white/10 text-neutral-300 border-white/10"
                    )}>
                      {profile.role}
                    </span>

                    <select
                      disabled={loadingId === profile.id}
                      value={profile.role}
                      onChange={(e) => handleRoleChange(profile.id, e.target.value, profile.role)}
                      className="block w-32 rounded-xl border border-white/10 bg-black/40 py-1.5 pl-3 pr-10 text-white focus:border-white/30 focus:outline-none focus:ring-0 sm:text-sm sm:leading-6 disabled:opacity-50 transition-colors"
                    >
                      <option value="therapist">Therapist</option>
                      <option value="researcher">Researcher</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                </li>
              ))
            )}
          </ul>
        </div>
      </main>
    </div>
  );
}
