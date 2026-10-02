"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { BookmarkCheck, X, ChevronRight, Bookmark } from "lucide-react";
import { useBookmarks } from "@/lib/hooks/use-bookmarks";
import { cn } from "@/lib/utils";

interface BookmarkListBtnProps {
  className?: string;
}

export function BookmarkListBtn({ className }: BookmarkListBtnProps) {
  const { bookmarks, removeBookmark } = useBookmarks();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className={cn(
          "relative flex h-8 w-8 items-center justify-center rounded-lg border transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500",
          "border-slate-200 bg-white/80 text-slate-700 hover:bg-slate-100 hover:text-slate-900",
          "dark:border-slate-800 dark:bg-slate-900/80 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white",
          className
        )}
        title="Saved posts"
        aria-label="Saved posts"
      >
        <BookmarkCheck className="h-4 w-4" />
        {bookmarks.length > 0 && (
          <span className="absolute -right-1 -top-1 flex h-4 min-w-[14px] items-center justify-center rounded-full bg-teal-600 px-1 text-[9px] font-bold text-white leading-none shadow-xs">
            {bookmarks.length > 99 ? "99+" : bookmarks.length}
          </span>
        )}
      </button>

      {open && (
        <div className="fixed sm:absolute right-4 sm:right-0 top-16 sm:top-full z-50 mt-1.5 w-80 origin-top-right rounded-xl border border-slate-200 bg-white/95 shadow-xl backdrop-blur-xl animate-fade-up dark:border-slate-800 dark:bg-slate-950/95 dark:shadow-slate-950/60">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 px-4 py-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Saved Posts</span>
            <span className="text-xs font-mono text-slate-400 dark:text-slate-500">{bookmarks.length} item{bookmarks.length !== 1 ? "s" : ""}</span>
          </div>

          <div className="max-h-80 overflow-y-auto">
            {bookmarks.length === 0 ? (
              <div className="px-4 py-8 text-center">
                <Bookmark className="mx-auto h-8 w-8 text-slate-300 dark:text-slate-700" />
                <p className="mt-2 text-xs font-medium text-slate-500 dark:text-slate-400">No saved posts yet</p>
                <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">Click the bookmark icon on any exam alert to save</p>
              </div>
            ) : (
              bookmarks.map((b) => (
                <div key={b.slug} className="group flex items-center gap-2.5 px-4 py-2.5 transition hover:bg-slate-50 dark:hover:bg-slate-900/60">
                  <Link href={`/post/${b.slug}`} onClick={() => setOpen(false)} className="min-w-0 flex-1">
                    <p className="truncate text-xs font-semibold text-slate-800 dark:text-slate-200 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition">{b.title}</p>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5 font-mono">{b.category} · {b.date}</p>
                  </Link>
                  <button
                    onClick={() => removeBookmark(b.slug)}
                    className="shrink-0 rounded-lg p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 opacity-0 group-hover:opacity-100 transition"
                    title="Remove"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))
            )}
          </div>

          {bookmarks.length > 0 && (
            <Link
              href="/bookmarks"
              onClick={() => setOpen(false)}
              className="flex items-center justify-center gap-1 border-t border-slate-100 dark:border-slate-800/80 px-4 py-2.5 text-xs font-semibold text-teal-600 dark:text-teal-400 transition hover:bg-teal-50 dark:hover:bg-teal-950/30"
            >
              View all saved posts <ChevronRight className="h-3 w-3" />
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
