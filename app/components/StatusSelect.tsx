'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { STATUS_OPTIONS, ReviewStatus } from '@/app/types/review-request';
import { createClient } from '@/app/lib/supabase/client';

interface StatusSelectProps {
  id: string;
  currentStatus: ReviewStatus;
}

export default function StatusSelect({ id, currentStatus }: StatusSelectProps) {
  const [value, setValue] = useState(currentStatus);
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setValue(currentStatus);
  }, [currentStatus]);

  async function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const next = e.target.value as ReviewStatus;
    setValue(next); // Instant UI update
    setIsPending(true);

    try {
      const supabase = createClient();
      const { error } = await supabase
        .from('review_requests')
        .update({ status: next })
        .eq('id', id);

      if (error) {
        alert('Failed to update: ' + error.message);
        setValue(currentStatus); // revert
      } else {
        router.refresh(); // sync server state
      }
    } catch (err: any) {
      alert('Network error: ' + err.message);
      setValue(currentStatus);
    } finally {
      setIsPending(false);
    }
  }

  return (
    <select
      value={value}
      onChange={handleChange}
      disabled={isPending}
      className={`text-sm border border-slate-200 rounded-md px-2 py-1 bg-white text-slate-700 
        focus:outline-none focus:ring-2 focus:ring-indigo-400 transition
        ${isPending ? 'opacity-50 cursor-wait' : 'hover:border-indigo-300 cursor-pointer'}`}
    >
      {STATUS_OPTIONS.map((s) => (
        <option key={s} value={s}>
          {s}
        </option>
      ))}
    </select>
  );
}
