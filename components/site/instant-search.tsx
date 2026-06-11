"use client";

import { Search } from "lucide-react";
import { useEffect, useState } from "react";

type Suggestion = {
  title: string;
  category: string;
  state: string;
  url: string;
};

export function InstantSearch({ compact = false }: { compact?: boolean }) {
  const [query, setQuery] = useState("");
  const [items, setItems] = useState<Suggestion[]>([]);

  useEffect(() => {
    const controller = new AbortController();
    if (query.trim().length < 2) {
      setItems([]);
      return;
    }

    const timer = window.setTimeout(async () => {
      const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`, { signal: controller.signal });
      if (response.ok) setItems((await response.json()).items);
    }, 140);

    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [query]);

  return (
    <div className="relative w-full">
      <div className={`${compact ? "px-3 py-2" : "px-4 py-3"} flex items-center gap-3 rounded-xl bg-slate-50 dark:bg-ink/70`}>
        <Search className="h-5 w-5 text-slate-400" />
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
          placeholder="Search exams, states, qualification..."
        />
      </div>
      {items.length > 0 ? (
        <div className="absolute left-0 right-0 top-full z-40 mt-2 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-panel dark:border-white/10 dark:bg-ink">
          {items.map((item) => (
            <a key={item.url} href={item.url} className="block border-b border-slate-100 p-4 last:border-0 hover:bg-slate-50 dark:border-white/10 dark:hover:bg-white/10">
              <p className="font-black text-ink dark:text-white">{item.title}</p>
              <p className="mt-1 text-xs font-bold text-slate-500">{item.category} · {item.state}</p>
            </a>
          ))}
        </div>
      ) : null}
    </div>
  );
}
