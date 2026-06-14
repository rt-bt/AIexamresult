export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-[#f0fdfa] dark:from-[#070b16] dark:to-[#0f172a]">
      <div className="h-1 bg-gradient-to-r from-[#F97316] via-[#EA580C] to-[#4F46E5]" />
      <div className="container-page py-20">
        <div className="mx-auto max-w-4xl space-y-6">
          {/* Title skeleton */}
          <div className="h-10 w-3/4 animate-pulse rounded-xl bg-slate-200 dark:bg-slate-800" />
          <div className="h-5 w-1/2 animate-pulse rounded-lg bg-slate-200 dark:bg-slate-800" />

          {/* Cards skeleton */}
          <div className="grid gap-5 sm:grid-cols-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <div className="mb-3 h-4 w-20 animate-pulse rounded-full bg-slate-200 dark:bg-slate-800" />
                <div className="mb-2 h-5 w-full animate-pulse rounded-lg bg-slate-200 dark:bg-slate-800" />
                <div className="mb-1 h-5 w-3/4 animate-pulse rounded-lg bg-slate-200 dark:bg-slate-800" />
                <div className="mt-3 h-3 w-24 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
