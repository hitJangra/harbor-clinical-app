"use client";

import { useTransition } from 'react';
import { requestResearcherRole } from '@/app/actions/requestResearcherRole';
import { toast } from 'sonner';

export function RequestAccessButton() {
  const [isPending, startTransition] = useTransition();

  const handleRequest = () => {
    startTransition(async () => {
      const result = await requestResearcherRole();
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("Request sent to admins.");
      }
    });
  };

  return (
    <button
      onClick={handleRequest}
      disabled={isPending}
      className="inline-flex items-center rounded bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 transition-colors disabled:opacity-50"
    >
      {isPending ? 'Requesting...' : 'Request Researcher Access'}
    </button>
  );
}
