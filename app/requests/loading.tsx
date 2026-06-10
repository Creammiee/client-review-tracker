export default function Loading() {
  return (
    <main className="min-h-screen bg-slate-50">
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
        </div>
      </header>
      <div className="max-w-5xl mx-auto px-6 py-8 space-y-6">
        <div className="animate-pulse flex flex-col gap-6">
          <div className="h-64 bg-slate-200 rounded-2xl"></div>
          <div className="h-8 w-1/3 bg-slate-200 rounded-md"></div>
          <div className="h-96 bg-slate-200 rounded-xl"></div>
        </div>
      </div>
    </main>
  );
}
