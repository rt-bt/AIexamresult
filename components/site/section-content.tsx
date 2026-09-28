"use client";

import { useState, useMemo } from "react";
import { ContentRail } from "@/components/site/content-rail";
import type { PostCard } from "@/lib/data";
import { ArrowUpDown, Filter, ChevronDown, ChevronUp } from "lucide-react";

export function SectionContent({ title, items }: { title: string; items: PostCard[] }) {
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");
  const [showFilters, setShowFilters] = useState(false);

  const categories = useMemo(() => {
    const cats = new Set(items.map((i) => i.category));
    return ["All", ...Array.from(cats)];
  }, [items]);

  const parseDate = (d: string) => {
    const parsed = Date.parse(d);
    return isNaN(parsed) ? 0 : parsed;
  };

  const filtered = useMemo(() => {
    let result = categoryFilter === "All" ? items : items.filter((i) => i.category === categoryFilter);
    result = [...result].sort((a, b) =>
      sortOrder === "newest" ? parseDate(b.date) - parseDate(a.date) : parseDate(a.date) - parseDate(b.date)
    );
    return result;
  }, [items, categoryFilter, sortOrder]);

  if (items.length === 0) {
    return (
      <section className="container-page py-20 text-center">
        <h2 className="text-2xl font-black text-ink">Coming Soon</h2>
        <p className="mt-2 text-slate-500">Updates for this section will appear shortly.</p>
      </section>
    );
  }

  return (
    <>
      <div className="container-page pt-8 pb-4">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-[#0D9488] hover:text-[#0D9488]"
        >
          <Filter className="h-4 w-4" /> Filters {showFilters ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>
        {showFilters && (
          <div className="mt-4 flex flex-wrap items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4">
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  className={`rounded-full px-4 py-1.5 text-sm font-semibold transition ${
                    categoryFilter === cat
                      ? "bg-[#0D9488] text-white shadow-md"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
            <div className="ml-auto flex items-center gap-2">
              <ArrowUpDown className="h-4 w-4 text-slate-400" />
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value as "newest" | "oldest")}
                className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-semibold text-slate-600 outline-none"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
              </select>
            </div>
          </div>
        )}
      </div>
      <ContentRail title={`${title} Updates`} badge="Fresh desk" items={filtered} />
    </>
  );
}
