"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";

type SearchResult = {
  title: string;
  category: string;
  state: string;
  url: string;
};

const allCategories = ["All", "Result", "Admit Card", "Latest Job", "Answer Key", "Admission", "Documents"];

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
      <main>
        <div className="bg-gradient-to-br from-[#0D9488] via-[#0F766E] to-[#115E59] py-12">
          <div className="container-page">
            <h1 className="text-3xl font-black text-white sm:text-4xl">Search Results</h1>
            <p className="mt-2 text-white/70">Find exams, results, admit cards & jobs</p>
            <div className="relative mt-6">
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search exam, result, job..."
                aria-label="Search exams, results, jobs"
                className="w-full rounded-xl border-0 bg-white/20 px-5 py-3.5 text-base text-white placeholder-white/50 backdrop-blur-sm outline-none ring-1 ring-white/30 transition focus:ring-2 focus:ring-[#5EEAD4]"
              />
              {loading && (
                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                </div>
              )}
            </div>
          </div>
        </div>

        <section className="container-page py-8 pb-24 lg:pb-8">
          {query.length < 2 ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center">
              <p className="text-lg font-semibold text-slate-500">Type at least 2 characters to search</p>
            </div>
          ) : (
            <>
              <div className="mb-6 flex flex-wrap gap-2">
                {allCategories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setFilter(cat)}
                    aria-pressed={filter === cat}
                    className={`rounded-full px-4 py-1.5 text-sm font-semibold transition active:scale-90 ${
                      filter === cat
                        ? "bg-[#0D9488] text-white shadow-md"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {filtered.length > 0 ? (
                <>
                  <p className="mb-4 text-sm text-slate-500">{filtered.length} result{filtered.length !== 1 ? "s" : ""} found</p>
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {filtered.map((item) => (
                      <a
                        key={item.url}
                        href={item.url}
                        className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all active:scale-[0.98] hover:-translate-y-1 hover:shadow-lg"
                      >
                        <span className="inline-block rounded-full bg-[#0D9488]/10 px-3 py-0.5 text-xs font-bold uppercase tracking-wide text-[#0D9488]">
                          {item.category}
                        </span>
                        <h3 className="mt-3 font-bold leading-snug text-slate-800 group-hover:text-[#0D9488]">
                          {item.title}
                        </h3>
                        <p className="mt-2 text-xs text-slate-400">{item.state}</p>
                      </a>
                    ))}
                  </div>
                </>
              ) : (
                <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center">
                  <p className="text-lg font-semibold text-slate-500">No results found for &ldquo;{query}&rdquo;</p>
                  <p className="mt-1 text-sm text-slate-400">Try a different keyword</p>
                </div>
              )}
            </>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}
