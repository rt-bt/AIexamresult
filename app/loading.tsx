export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-4">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-brand" />
        <p className="text-sm font-semibold text-slate-500">Loading...</p>
      </div>
    </div>
  );
}
