import { ReviewRequest } from '@/app/types/review-request';
import StatusBadge from '@/app/components/StatusBadge';
import StatusSelect from '@/app/components/StatusSelect';

interface RequestListProps {
  requests: ReviewRequest[];
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export default function RequestList({ requests }: RequestListProps) {
  if (requests.length === 0) {
    return (
      <div className="text-center py-16 text-slate-400">
        <svg
          className="mx-auto mb-4 w-12 h-12 text-slate-300"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
        <p className="text-sm font-medium">No review requests found</p>
        <p className="text-xs mt-1">Add one using the form above.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 shadow-sm">
      <table className="min-w-full divide-y divide-slate-100">
        <thead className="bg-slate-50">
          <tr>
            {['Client', 'ASIN', 'Status', 'Change Status', 'Created'].map(
              (h) => (
                <th
                  key={h}
                  className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider"
                >
                  {h}
                </th>
              )
            )}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-slate-100">
          {requests.map((req) => (
            <tr
              key={req.id}
              className="hover:bg-indigo-50/30 transition-colors group"
            >
              <td className="px-6 py-4 text-sm font-medium text-slate-800 whitespace-nowrap">
                {req.client_name}
              </td>
              <td className="px-6 py-4">
                <code className="text-xs bg-slate-100 text-slate-700 px-2 py-1 rounded font-mono">
                  {req.product_asin}
                </code>
              </td>
              <td className="px-6 py-4">
                <StatusBadge status={req.status} />
              </td>
              <td className="px-6 py-4">
                <StatusSelect id={req.id} currentStatus={req.status} />
              </td>
              <td className="px-6 py-4 text-sm text-slate-400 whitespace-nowrap">
                {formatDate(req.created_at)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
