"use client";

import { useState } from "react";
import { Search, ArrowRight, CheckCircle2, Download } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { VoiceSearchBtn } from "./voice-search";

export function Hero() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    } else {
      router.push("/results");
    }
  }

  return (
    <section className="relative overflow-hidden bg-[#F8FAFC] py-14 sm:py-20 lg:py-24 border-b border-slate-200/80 font-sans">
      <div className="container-page max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          
          {/* Left Column (Desktop: Left-aligned, Mobile: Centered) */}
          <div className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left">
            
            {/* Small label: “Trusted Exam Updates” */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-slate-200/90 shadow-xs mb-5">
              <span className="h-2 w-2 rounded-full bg-[#F59E0B]" />
              <span className="text-xs font-semibold text-[#172033] tracking-wide">
                Trusted Exam Updates
              </span>
            </div>

            {/* Main heading: “Exam Results & Government Jobs” */}
            <h1 className="font-heading text-3xl sm:text-4xl lg:text-[44px] font-extrabold text-[#123B6D] tracking-tight leading-[1.15] mb-4">
              Exam Results &amp; Government Jobs
            </h1>

            {/* Subheading: “Latest results, admit cards and job notifications in one place.” */}
            <p className="text-base sm:text-lg text-[#172033]/80 max-w-lg mb-8 leading-relaxed font-sans">
              Latest results, admit cards and job notifications in one place.
            </p>

            {/* Primary button: “Check Latest Results” */}
            <div className="mb-6 w-full sm:w-auto">
              <Link
                href="/results"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#123B6D] hover:bg-[#0e2d53] text-white px-8 py-3.5 text-[15px] font-bold shadow-md shadow-[#123B6D]/15 transition-all duration-200 active:scale-[0.98] font-heading w-full sm:w-auto"
              >
                <span>Check Latest Results</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            {/* One small search bar below the CTA: “Search exam or job” */}
            <form
              onSubmit={handleSearch}
              className="w-full max-w-md relative flex items-center"
            >
              <Search className="absolute left-3.5 h-4 w-4 text-slate-400 pointer-events-none" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search exam or job"
                aria-label="Search exam name or job title"
                className="w-full rounded-xl border border-slate-300 bg-white pl-10 pr-24 py-2.5 text-sm font-medium text-[#172033] placeholder-slate-400 outline-none transition focus:border-[#123B6D] focus:ring-2 focus:ring-[#123B6D]/10"
              />
              <div className="absolute right-2 flex items-center gap-1">
                <VoiceSearchBtn
                  onResult={(val) => {
                    setQuery(val);
                    router.push(`/search?q=${encodeURIComponent(val)}`);
                  }}
                  className="p-1 text-slate-400 hover:text-[#123B6D] transition"
                />
                <button
                  type="submit"
                  className="rounded-lg bg-slate-100 hover:bg-slate-200 text-[#123B6D] px-2.5 py-1 text-xs font-bold transition font-heading"
                >
                  Search
                </button>
              </div>
            </form>

          </div>

          {/* Right Column: One simple animated document/result card */}
          <div className="lg:col-span-5 flex justify-center w-full">
            <div className="w-full max-w-sm rounded-2xl bg-white border border-slate-200/90 p-5 sm:p-6 shadow-[0_10px_25px_rgba(18,59,109,0.06)] hover:shadow-[0_14px_30px_rgba(18,59,109,0.1)] transition-all duration-300 hover:-translate-y-1">
              
              {/* Card Header: Authority + Status */}
              <div className="flex items-center justify-between gap-3 border-b border-slate-100 pb-3 mb-4">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#123B6D]">
                  Staff Selection Commission
                </span>
                
                {/* Status: “Result Declared” with small green checkmark */}
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#16A34A]/10 text-[#16A34A] text-xs font-bold">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span>Result Declared</span>
                </span>
              </div>

              {/* Title: “SSC CGL Result 2026” */}
              <h2 className="font-heading text-lg sm:text-xl font-bold text-[#172033] mb-2 leading-snug">
                SSC CGL Result 2026
              </h2>

              <p className="text-xs text-slate-500 mb-5 leading-relaxed">
                Combined Graduate Level Examination (Tier-I) official merit list &amp; cut-off marks.
              </p>

              {/* Cut-off Preview */}
              <div className="grid grid-cols-3 gap-2 p-2.5 rounded-xl bg-[#F8FAFC] border border-slate-100 text-center mb-5">
                <div>
                  <p className="text-[10px] text-slate-400 font-medium">UR Cut-off</p>
                  <p className="text-xs font-bold text-[#172033] mt-0.5">142.50</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-medium">OBC Cut-off</p>
                  <p className="text-xs font-bold text-[#172033] mt-0.5">138.00</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-medium">Status</p>
                  <p className="text-xs font-bold text-[#16A34A] mt-0.5">Qualified</p>
                </div>
              </div>

              {/* Download Action */}
              <Link
                href="/results"
                className="flex items-center justify-center gap-2 w-full rounded-xl bg-slate-50 hover:bg-[#123B6D] hover:text-white border border-slate-200 text-[#123B6D] py-2.5 text-xs font-bold transition-all duration-200 font-heading"
              >
                <Download className="h-3.5 w-3.5" />
                <span>Download Merit List PDF</span>
              </Link>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
