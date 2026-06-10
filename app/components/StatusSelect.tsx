'use client';

import { useTransition } from 'react';
import { STATUS_OPTIONS, ReviewStatus } from '@/app/types/review-request';
import { updateRequestStatus } from '@/app/requests/actions';

interface StatusSelectProps {
  id: string;
  currentStatus: ReviewStatus;
}

export default function StatusSelect({ id, currentStatus }: StatusSelectProps) {
  const [isPending, startTransition] = useTransition();

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const next = e.target.value as ReviewStatus;
    startTransition(async () => {
      await updateRequestStatus(id, next);
    });
  }

  return (
    <select
      defaultValue={currentStatus}
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
