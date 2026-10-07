"use client";

import Link from "next/link";
import { ExternalLink, CalendarDays, Sparkles } from "lucide-react";
import type { PostCard } from "@/lib/data";
import { getCategoryCta } from "@/lib/categories";

const now = Date.now();

function isWithinDays(date: string, days: number): boolean {
  try {
    const d = new Date(date);
    return (now - d.getTime()) <= days * 24 * 60 * 60 * 1000 && d.getTime() <= now;
  } catch { return false; }
}

function getHeaderActionLabel(title: string): string {
  const t = title.toLowerCase();
  if (t.includes("result")) return "Check Result";
  if (t.includes("admit card") || t.includes("hall ticket")) return "Download Admit Card";
  if (t.includes("answer key")) return "View Answer Key";
  if (t.includes("syllabus")) return "View Syllabus";
  if (t.includes("scholarship")) return "Check Scholarship";
  if (t.includes("admission")) return "Check Admission";
  if (t.includes("job") || t.includes("vacancy")) return "Apply Online";
  return "Official Link";
}

export function TableContent({ title, items }: { title: string; items: PostCard[] }) {
  if (items.length === 0) return null;
  const headerAction = getHeaderActionLabel(title);

  return (
    <section className="py-8">
      <div className="container-page">
        <h2 className="mb-6 text-2xl font-black text-ink">{title}</h2>
        <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                <th className="px-4 py-3.5 text-xs font-bold uppercase tracking-wider text-slate-500 sm:px-6">Post Name</th>
                <th className="px-4 py-3.5 text-xs font-bold uppercase tracking-wider text-slate-500 sm:px-6">Date</th>
                <th className="px-4 py-3.5 text-xs font-bold uppercase tracking-wider text-slate-500 sm:px-6">{headerAction}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {items.map((item) => {
                const cta = getCategoryCta(item.category, item.title, item.isExpired);
                return (
                  <tr key={item.title + item.date} className="transition hover:bg-slate-50/50">
                    <td className="px-4 py-4 sm:px-6">
                      <div className="flex items-center gap-2">
                        <Link href={item.slug ? `/post/${item.slug}` : "#"} className="font-semibold text-[#111111] transition hover:text-[#FF5B3E] line-clamp-2 font-heading">
                          {item.title}
                        </Link>
                        {isWithinDays(item.date, 3) && (
                          <span className="inline-flex shrink-0 items-center gap-0.5 rounded bg-[#FF5B3E]/10 px-1.5 py-0.5 text-[10px] font-bold text-[#FF5B3E] ring-1 ring-[#FF5B3E]/30">
                            <Sparkles className="h-2.5 w-2.5" /> NEW
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-4 sm:px-6">
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-500 font-sans">
                        <CalendarDays className="h-3.5 w-3.5 shrink-0" /> {item.date}
                      </span>
                    </td>
                    <td className="px-4 py-4 sm:px-6">
                      <Link
                        href={item.slug ? `/post/${item.slug}` : "#"}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-[#FFD84D] px-4 py-2 text-xs font-bold text-[#111111] transition hover:bg-[#FF5B3E] hover:text-white font-heading"
                      >
                        {cta.actionText} <ExternalLink className="h-3 w-3" />
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-xs text-slate-400">{items.length} posts found</p>
      </div>
    </section>
  );
}
