import Link from "next/link";
import { ArrowUpRight, CalendarDays, MapPin, Sparkles } from "lucide-react";
import type { PostCard } from "@/lib/data";

const now = Date.now();

function isWithinDays(date: string, days: number): boolean {
  try {
    const d = new Date(date);
    const ms = days * 24 * 60 * 60 * 1000;
    return (now - d.getTime()) <= ms && d.getTime() <= now;
  } catch { return false; }
}

export function ContentRail({
  title,
  badge,
  items,
  compact = false,
  variant,
  viewAllHref
}: {
  title: string;
  badge: string;
  items: PostCard[];
  compact?: boolean;
  variant?: "carousel";
  viewAllHref?: string;
}) {
  if (items.length === 0) return null;

  return (
    <section className="py-10">
      <div className="container-page">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-brand/10 px-4 py-1.5 text-sm font-bold text-brand">{badge}</span>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-ink dark:text-white">{title}</h2>
          </div>
          {viewAllHref ? (
            <Link href={viewAllHref} className="hidden items-center gap-1 rounded-full border border-slate-200 px-5 py-2.5 text-sm font-bold text-ink transition hover:border-brand hover:text-brand sm:inline-flex dark:border-white/10 dark:text-white">
              View all <ArrowUpRight className="h-4 w-4" />
            </Link>
          ) : (
            <a className="hidden items-center gap-1 rounded-full border border-slate-200 px-5 py-2.5 text-sm font-bold text-ink transition hover:border-brand hover:text-brand sm:inline-flex dark:border-white/10 dark:text-white">
              View all <ArrowUpRight className="h-4 w-4" />
            </a>
          )}
        </div>
        <div className={variant === "carousel" ? "flex gap-5 overflow-x-auto pb-4" : "grid gap-5 md:grid-cols-2 lg:grid-cols-3"}>
          {items.map((item) => (
            <Link key={item.title} href={item.slug ? `/post/${item.slug}` : "#"} className={`group ${variant === "carousel" ? "min-w-[280px] sm:min-w-[340px]" : ""} rounded-2xl border border-slate-100 bg-white p-5 sm:p-6 shadow-lg shadow-black/[0.02] transition-all active:scale-[0.98] hover:-translate-y-1 hover:border-brand/30 hover:shadow-xl dark:border-white/10 dark:bg-white/10`}>
              <div className="flex items-start justify-between gap-4">
                <span className="rounded-full bg-brand/10 px-3 py-1 text-xs font-bold text-brand">{item.category}</span>
                <ArrowUpRight className="h-4 w-4 text-slate-400 transition group-hover:-translate-y-1 group-hover:translate-x-1" />
              </div>
              <h3 className={`${compact ? "text-lg" : "text-xl"} mt-4 font-black leading-snug text-ink transition group-hover:text-brand dark:text-white`}>{item.title}</h3>
              <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-500 dark:text-slate-400">{item.excerpt}</p>
              <div className="mt-5 flex flex-wrap gap-3 text-xs font-semibold text-slate-400">
                <span className="inline-flex items-center gap-1.5"><CalendarDays className="h-3.5 w-3.5" /> {item.date}</span>
                <span className="inline-flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" /> {item.state}</span>
                {isWithinDays(item.date, 3) ? (
                  <span className="inline-flex items-center gap-0.5 rounded bg-orange-50 px-1.5 py-0.5 text-[10px] font-bold text-[#EA580C] ring-1 ring-orange-200">
                    <Sparkles className="h-2.5 w-2.5" /> NEW
                  </span>
                ) : item.category === "Latest Job" && item.isExpired ? (
                  <span className="inline-flex items-center gap-0.5 rounded bg-red-50 px-1.5 py-0.5 text-[10px] font-bold text-red-600 ring-1 ring-red-200">
                    EXPIRED
                  </span>
                ) : null}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
