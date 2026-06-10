import { getRequestsByStatus } from '@/app/lib/requests';
import RequestList from '@/app/components/RequestList';
import RequestForm from '@/app/components/RequestForm';
import StatusFilter from '@/app/components/StatusFilter';

interface PageProps {
  searchParams: Promise<{ status?: string }>;
}

export const dynamic = 'force-dynamic';

export default async function RequestsPage({ searchParams }: PageProps) {
  const { status = '' } = await searchParams;
  const requests = await getRequestsByStatus(status);

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-5xl mx-auto px-6 py-5 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Client Review Tracker
            </h1>
            <p className="text-sm text-slate-500 mt-0.5">
              Manage Amazon review requests by client and ASIN
            </p>
          </div>
          <span className="text-xs bg-indigo-100 text-indigo-700 font-semibold px-3 py-1 rounded-full">
            Internal Tool
          </span>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-8 space-y-6">
        {/* Add Form */}
        <RequestForm />

        {/* Filter + Count */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <StatusFilter current={status} />
          <span className="text-sm text-slate-400">
            {requests.length} request{requests.length !== 1 ? 's' : ''}
            {status ? ` · ${status}` : ''}
          </span>
        </div>

        {/* List */}
        <RequestList requests={requests} />
      </div>
    </main>
  );
}
