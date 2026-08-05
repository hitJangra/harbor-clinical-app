"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { assignSamples } from '@/app/actions/assignSamples';

interface Therapist {
  id: string;
  full_name: string | null;
}

interface TherapistTableClientProps {
  therapists: Therapist[];
}

export function TherapistTableClient({ therapists }: TherapistTableClientProps) {
  const router = useRouter();
  
  const [selectedTherapist, setSelectedTherapist] = useState<Therapist | null>(null);
  const [sampleCount, setSampleCount] = useState<number>(10);
  const [isLoading, setIsLoading] = useState(false);

  const handleAssignClick = (therapist: Therapist) => {
    setSelectedTherapist(therapist);
    setSampleCount(10); // default value
  };

  const closeModal = () => {
    setSelectedTherapist(null);
    setIsLoading(false);
  };

  const handleConfirm = async () => {
    if (!selectedTherapist) return;
    
    setIsLoading(true);
    
    try {
      const result = await assignSamples(selectedTherapist.id, sampleCount);
      
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(`Successfully assigned ${result.count} samples to ${selectedTherapist.full_name || 'Therapist'}.`);
        closeModal();
        router.refresh();
      }
    } catch (error) {
      console.error(error);
      toast.error('An unexpected error occurred during assignment.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
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
              <th scope="col" className="relative px-6 py-3">
                <span className="sr-only">Assign</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-stone-200">
            {therapists.map((therapist) => (
              <tr key={therapist.id} className="hover:bg-stone-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-stone-900">
                  {therapist.full_name || 'Unnamed Therapist'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-stone-500 font-mono">
                  {therapist.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => handleAssignClick(therapist)}
                    className="inline-flex items-center rounded-md bg-teal-50 px-3 py-2 text-sm font-semibold text-teal-700 shadow-sm hover:bg-teal-100 border border-teal-200 transition-colors"
                  >
                    Assign Samples
                  </button>
                </td>
              </tr>
            ))}
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

      {/* Assignment Modal */}
      {selectedTherapist && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
            <h3 className="text-lg font-medium text-stone-900">
              Assign Samples to {selectedTherapist.full_name || 'Therapist'}
            </h3>
            <p className="mt-2 text-sm text-stone-500">
              Enter the number of unassigned samples you would like to allocate to this therapist.
            </p>
            
            <div className="mt-4">
              <label htmlFor="sample-count" className="block text-sm font-medium text-stone-700">
                Number of samples to assign
              </label>
              <input
                type="number"
                id="sample-count"
                min="1"
                value={sampleCount}
                onChange={(e) => setSampleCount(parseInt(e.target.value) || 1)}
                className="mt-1 block w-full rounded-md border border-stone-300 px-3 py-2 focus:border-teal-500 focus:outline-none focus:ring-teal-500 sm:text-sm text-stone-900"
              />
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={closeModal}
                disabled={isLoading}
                className="rounded-md border border-stone-300 bg-white px-4 py-2 text-sm font-medium text-stone-700 shadow-sm hover:bg-stone-50 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirm}
                disabled={isLoading}
                className="inline-flex items-center rounded-md border border-transparent bg-teal-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 disabled:opacity-50"
              >
                {isLoading ? 'Assigning...' : 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
