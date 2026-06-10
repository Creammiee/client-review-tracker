import Link from 'next/link';
import { STATUS_OPTIONS, ReviewStatus } from '@/app/types/review-request';

interface StatusFilterProps {
  current: string;
}

export default function StatusFilter({ current }: StatusFilterProps) {
  const allOption = { label: 'All', value: '' };
  const options = [
    allOption,
    ...STATUS_OPTIONS.map((s) => ({ label: s, value: s })),
  ];

  return (
    <div className="flex gap-2 flex-wrap">
      {options.map(({ label, value }) => {
        const isActive = current === value;
        return (
          <Link
            key={label}
            href={value ? `/requests?status=${encodeURIComponent(value)}` : '/requests'}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all border ${
              isActive
                ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-300 hover:text-indigo-600'
            }`}
          >
            {label}
          </Link>
        );
      })}
    </div>
  );
}
