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
    <div className="overflow-hidden rounded-xl bg-white shadow-sm border border-stone-200">
      <table className="min-w-full divide-y divide-stone-200">
        <thead className="bg-stone-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">
              Name
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">
              ID
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">
              Status
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-stone-200">
          {therapists.map((therapist) => {
            const online = isOnline(therapist.last_sign_in_at);
            
            return (
              <tr key={therapist.id} className="hover:bg-stone-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-stone-900">
                  {therapist.full_name || 'Unnamed Therapist'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-stone-500 font-mono">
                  {therapist.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {online ? (
                    <span className="inline-flex items-center rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-800">
                      Online/Live
                    </span>
                  ) : (
                    <span className="inline-flex items-center rounded-full bg-stone-100 px-2.5 py-0.5 text-xs font-medium text-stone-800">
                      Offline
                    </span>
                  )}
                </td>
              </tr>
            );
          })}
          {therapists.length === 0 && (
            <tr>
              <td colSpan={3} className="px-6 py-8 text-center text-sm text-stone-500">
                No therapists found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
