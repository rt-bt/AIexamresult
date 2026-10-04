"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { VoiceSearchBtn } from "@/components/site/voice-search";
import { QuickAccess } from "@/components/site/quick-access";

type SearchResult = {
  title: string;
  category: string;
  state: string;
  url: string;
};

const allCategories = ["All", "Result", "Admit Card", "Latest Job", "Answer Key", "Admission", "Documents"];

const popularKeywords = [
  "SSC CGL 2026", "Railway RRB NTPC", "UPSC Civil Services", "NEET UG",
  "CTET 2026", "UP Police Constable", "Bihar Teacher", "IBPS PO",
  "Railway Group D", "10th Pass Jobs", "12th Pass Jobs", "Army Agniveer"
];

function fetchSearch(q: string, signal?: AbortSignal): Promise<SearchResult[]> {
  return fetch(`/api/search?q=${encodeURIComponent(q)}`, { signal })
    .then((r) => r.json())
    .then((d) => d.items as SearchResult[]);
}

export default function SearchPage() {
  const searchParams = useSearchParams();
  const initialQ = searchParams.get("q") ?? "";

  const [query, setQuery] = useState(initialQ);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("All");
  const inputRef = useRef<HTMLInputElement>(null);

  const doSearch = useCallback(async (q: string) => {
    if (q.length < 2) { setResults([]); setLoading(false); return; }
    setLoading(true);
    try {
      const items = await fetchSearch(q);
      setResults(items);
    } catch { /* ignore aborts */ }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (initialQ) { setQuery(initialQ); doSearch(initialQ); }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => doSearch(query), 200);
    return () => clearTimeout(timer);
  }, [query, doSearch]);

  useEffect(() => { inputRef.current?.focus(); }, []);

  const filtered = results.filter(
    (r) => filter === "All" || r.category.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <>
      <Header />
      <main className="bg-white min-h-screen font-sans">
        <div className="border-b border-[#222222] bg-[#07131a] min-h-[460px] sm:min-h-[520px] md:min-h-[580px] flex items-center justify-center py-10 sm:py-16 md:py-24 px-4 sm:px-6 relative overflow-hidden">
          {/* Fullscreen looping background video shifted upward */}
          <video
            autoPlay
            loop
            muted
            playsInline
            src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260314_131748_f2ca2a28-fed7-44c8-b9a9-bd9acdd5ec31.mp4"
            className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none"
            style={{ objectPosition: "center 80%" }}
          />

          <div className="w-full max-w-4xl relative z-10 flex flex-col items-center text-center -mt-1 sm:-mt-3">
            {/* Cinematic H1 Heading - Fluid Responsive Scale */}
            <h1
              className="text-4xl xs:text-5xl sm:text-7xl md:text-8xl font-normal text-white tracking-tight sm:tracking-[-1.5px] max-w-4xl leading-[1.08] sm:leading-[1.02] animate-fade-rise"
              style={{ fontFamily: "'Instrument Serif', serif" }}
            >
              Search <em className="not-italic text-neutral-300">Results</em>
            </h1>

            {/* Subtext */}
            <p className="mt-2.5 sm:mt-4 text-xs sm:text-base md:text-lg text-neutral-200/90 font-sans max-w-xl leading-relaxed px-2 sm:px-0 animate-fade-rise-delay">
              Find exams, scorecards, admit cards &amp; government jobs across India
            </p>

            {/* Liquid-Glass Search Input - Mobile Optimized */}
            <div className="relative mt-5 sm:mt-8 w-full max-w-2xl mx-auto text-left animate-fade-rise-delay-2">
              <div className="liquid-glass rounded-xl sm:rounded-2xl p-1 sm:p-1.5 shadow-xl transition hover:shadow-[0_0_30px_rgba(255,255,255,0.18)]">
                <div className="relative flex items-center">
                  <input
                    ref={inputRef}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search exam, result, job..."
                    aria-label="Search exams, results, jobs"
                    className="w-full rounded-lg sm:rounded-xl bg-black/40 pl-4 pr-12 sm:pl-5 sm:pr-20 py-3 sm:py-4 text-[15px] sm:text-base text-white placeholder-white/50 outline-none transition focus:bg-black/50 font-sans"
                  />
                  <div className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 sm:gap-1.5">
                    {loading && (
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-[#FF5B3E]" />
                    )}
                    <VoiceSearchBtn
                      onResult={(q) => {
                        setQuery(q);
                        doSearch(q);
                      }}
                      className="rounded-full p-1.5 sm:p-2 text-white/80 hover:bg-white/20 hover:text-white transition active:scale-90"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Badges in Liquid Glass */}
            <div className="mt-3.5 sm:mt-4 flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 px-1 animate-fade-rise-delay-2 text-xs">
              <span className="text-white/60 text-[11px] sm:text-[12px] font-sans">Trending:</span>
              {["SSC CGL", "RRB NTPC", "UPSC IAS", "NEET UG", "CTET"].map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => {
                    setQuery(tag);
                    doSearch(tag);
                  }}
                  className="liquid-glass rounded-full px-2.5 py-0.5 sm:px-3 sm:py-1 text-[11px] sm:text-xs text-white/90 hover:text-white active:scale-95 transition font-sans"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>

        {query.length < 2 ? (
          <div className="container-page py-6 sm:py-10 pb-28 lg:pb-16 px-4 sm:px-6">
            {/* Popular Searches */}
            <div className="mb-8 sm:mb-10 rounded-xl sm:rounded-2xl border border-[#E5E7EB] bg-gradient-to-br from-neutral-50/80 to-white p-4 sm:p-6 shadow-xs">
              <div className="mb-3.5 sm:mb-4 flex items-center gap-2 sm:gap-2.5">
                <span className="flex h-6 w-6 sm:h-7 sm:w-7 items-center justify-center rounded-lg bg-[#FFD84D] text-[#111111] text-[11px] sm:text-xs font-bold shadow-xs">
                  🔥
                </span>
                <div>
                  <h2 className="text-sm sm:text-base font-bold text-[#111111] font-heading">Popular Searches</h2>
                  <p className="text-[11px] sm:text-xs text-neutral-500 font-sans">Click any topic to explore verified links &amp; updates</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {popularKeywords.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => {
                      setQuery(item);
                      doSearch(item);
                    }}
                    className="inline-flex items-center gap-1 rounded-lg sm:rounded-xl border border-[#DEDEDE] bg-white px-2.5 py-1.5 sm:px-3.5 sm:py-2 text-[11px] sm:text-xs font-semibold text-neutral-700 hover:border-[#111111] hover:bg-neutral-50 hover:text-[#111111] active:scale-95 transition font-sans"
                  >
                    <span>{item}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Browse Categories */}
            <QuickAccess />
          </div>
        ) : (
          <section className="container-page py-6 sm:py-8 pb-28 lg:pb-12 px-4 sm:px-6">
            {/* Category Filter Pills - Horizontally scrollable on mobile */}
            <div className="mb-4 sm:mb-6 -mx-4 px-4 sm:mx-0 sm:px-0 overflow-x-auto scrollbar-hide flex sm:flex-wrap gap-1.5 sm:gap-2 justify-start sm:justify-center">
              {allCategories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  aria-pressed={filter === cat}
                  className={`rounded-full shrink-0 whitespace-nowrap px-3.5 py-1 sm:px-4 sm:py-1.5 text-xs sm:text-sm font-semibold transition active:scale-90 font-heading ${
                    filter === cat
                      ? "bg-[#111111] text-white shadow-md"
                      : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {filtered.length > 0 ? (
              <>
                <p className="mb-3 sm:mb-4 text-xs sm:text-sm text-neutral-500">{filtered.length} result{filtered.length !== 1 ? "s" : ""} found</p>
                <div className="grid gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {filtered.map((item) => (
                    <a
                      key={item.url}
                      href={item.url}
                      className="group rounded-xl sm:rounded-2xl border border-[#DEDEDE] bg-white p-4 sm:p-5 shadow-xs transition-all active:scale-[0.98] hover:-translate-y-0.5 hover:border-[#111111]/40 hover:shadow-md"
                    >
                      <span className="inline-block rounded-full bg-[#FFD84D] px-2.5 py-0.5 text-[10px] sm:text-xs font-bold uppercase tracking-wide text-[#111111]">
                        {item.category}
                      </span>
                      <h3 className="mt-2.5 sm:mt-3 text-sm sm:text-base font-bold leading-snug text-[#111111] group-hover:text-[#FF5B3E] font-heading line-clamp-2">
                        {item.title}
                      </h3>
                      <p className="mt-2 text-[11px] sm:text-xs text-neutral-400 font-sans">{item.state}</p>
                    </a>
                  ))}
                </div>
              </>
            ) : (
              <div className="rounded-xl sm:rounded-2xl border border-slate-200 bg-white p-6 sm:p-10 text-center">
                <p className="text-base sm:text-lg font-semibold text-slate-500">No results found for &ldquo;{query}&rdquo;</p>
                <p className="mt-1 text-xs sm:text-sm text-slate-400">Try a different keyword</p>
              </div>
            )}
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}
