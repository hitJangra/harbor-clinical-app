"use client";

interface Therapist {
  id: string;
  full_name: string | null;
  last_sign_in_at: string | null;
}

interface TherapistTableClientProps {
  therapists: Therapist[];
}

export function TherapistTableClient({ therapists }: TherapistTableClientProps) {
  
  const isOnline = (lastSignIn: string | null) => {
    if (!lastSignIn) return false;
    const signInDate = new Date(lastSignIn);
    const now = new Date();
    const diffHours = (now.getTime() - signInDate.getTime()) / (1000 * 60 * 60);
    return diffHours <= 2;
  };

  return (
    <div className="overflow-hidden rounded-2xl bg-white/[0.03] backdrop-blur-2xl border border-white/[0.08] shadow-2xl">
      <table className="min-w-full divide-y divide-white/5">
        <thead className="bg-black/20">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">
              Name
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">
              ID
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">
              Status
            </th>
          </tr>
        </thead>
        <tbody className="bg-transparent divide-y divide-white/5">
          {therapists.map((therapist) => {
            const online = isOnline(therapist.last_sign_in_at);
            
            return (
              <tr key={therapist.id} className="hover:bg-white/5 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                  {therapist.full_name || 'Unnamed Therapist'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-400 font-mono">
                  {therapist.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {online ? (
                    <span className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-2.5 py-0.5 text-xs font-medium text-white">
                      Online/Live
                    </span>
                  ) : (
                    <span className="inline-flex items-center rounded-full border border-white/10 bg-transparent px-2.5 py-0.5 text-xs font-medium text-neutral-500">
                      Offline
                    </span>
                  )}
                </td>
              </tr>
            );
          })}
          {therapists.length === 0 && (
            <tr>
              <td colSpan={3} className="px-6 py-8 text-center text-sm text-neutral-500">
                No therapists found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
