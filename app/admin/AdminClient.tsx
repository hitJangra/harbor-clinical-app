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
    <div className="min-h-screen bg-[#F8F9FA]">
      <Header userName={userName} userRole={userRole} />
      
      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center space-x-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-50 text-red-600">
            <ShieldAlert size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-stone-900">Admin Controls</h1>
            <p className="text-sm text-stone-500">Manage user roles and system access.</p>
          </div>
        </div>

        <div className="overflow-hidden rounded-xl bg-white shadow-sm border border-stone-200">
          <div className="border-b border-stone-200 bg-stone-50 px-6 py-4 flex items-center space-x-2">
            <UserCog size={18} className="text-stone-500" />
            <h2 className="text-base font-medium text-stone-900">User Management</h2>
          </div>
          <ul role="list" className="divide-y divide-stone-200">
            {profiles.length === 0 ? (
              <li className="px-6 py-8 text-center text-stone-500 text-sm">No users found.</li>
            ) : (
              profiles.map((profile) => (
                <li key={profile.id} className="flex items-center justify-between px-6 py-4 hover:bg-stone-50 transition-colors">
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-stone-900">{profile.full_name || 'Unnamed User'}</span>
                    <span className="text-xs text-stone-500 font-mono mt-0.5">{profile.id}</span>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <span className={cn(
                      "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize",
                      profile.role === 'admin' ? "bg-red-100 text-red-800" :
                      profile.role === 'researcher' ? "bg-teal-100 text-teal-800" :
                      "bg-stone-100 text-stone-800"
                    )}>
                      {profile.role}
                    </span>

                    <select
                      disabled={loadingId === profile.id}
                      value={profile.role}
                      onChange={(e) => handleRoleChange(profile.id, e.target.value, profile.role)}
                      className="block w-32 rounded-md border-0 py-1.5 pl-3 pr-10 text-stone-900 ring-1 ring-inset ring-stone-300 focus:ring-2 focus:ring-teal-600 sm:text-sm sm:leading-6 disabled:opacity-50"
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
