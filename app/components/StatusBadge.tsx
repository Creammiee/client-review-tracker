import { ReviewStatus } from '@/app/types/review-request';

const STATUS_STYLES: Record<ReviewStatus, string> = {
  Pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  'In Progress': 'bg-blue-100 text-blue-800 border-blue-200',
  Done: 'bg-green-100 text-green-800 border-green-200',
};

const STATUS_DOTS: Record<ReviewStatus, string> = {
  Pending: 'bg-yellow-500',
  'In Progress': 'bg-blue-500',
  Done: 'bg-green-500',
};

interface StatusBadgeProps {
  status: ReviewStatus;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${STATUS_STYLES[status]}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${STATUS_DOTS[status]}`} />
      {status}
    </span>
  );
}
