"use client";

import { useEffect } from "react";
import Link from "next/link";
import { RefreshCw, Home } from "lucide-react";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => { console.error(error); }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="text-center">
        <p className="text-8xl font-black text-slate-200">500</p>
        <h1 className="mt-4 text-3xl font-black text-slate-800">Something went wrong</h1>
        <p className="mx-auto mt-2 max-w-md text-slate-500">An unexpected error occurred. Please try again or return home.</p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <button onClick={reset} className="inline-flex items-center gap-2 rounded-full bg-brand px-6 py-3 text-sm font-bold text-white transition hover:bg-[#0F766E]">
            <RefreshCw className="h-4 w-4" /> Try Again
          </button>
          <Link href="/" className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-6 py-3 text-sm font-bold text-slate-600 transition hover:border-brand hover:text-brand">
            <Home className="h-4 w-4" /> Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}
