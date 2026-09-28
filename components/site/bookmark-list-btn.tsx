"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { BookmarkCheck, X, ChevronRight, Bookmark } from "lucide-react";
import { useBookmarks } from "@/lib/hooks/use-bookmarks";
import { cn } from "@/lib/utils";

export function BookmarkListBtn() {
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
        className="relative rounded-full p-2 text-white/80 transition hover:bg-white/15 hover:text-white"
        title="Saved posts"
      >
        <BookmarkCheck className="h-4.5 w-4.5" />
        {bookmarks.length > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-[14px] items-center justify-center rounded-full bg-red-500 px-1 text-[9px] font-bold text-white leading-none">
            {bookmarks.length > 99 ? "99+" : bookmarks.length}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 w-72 origin-top-right scale-100 rounded-xl bg-white shadow-xl shadow-black/10 ring-1 ring-black/5 transition">
          <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
            <span className="text-sm font-bold text-gray-800">Saved Posts</span>
            <span className="text-xs text-gray-400">{bookmarks.length} item{bookmarks.length !== 1 ? "s" : ""}</span>
          </div>

          <div className="max-h-80 overflow-y-auto">
            {bookmarks.length === 0 ? (
              <div className="px-4 py-8 text-center">
                <Bookmark className="mx-auto h-8 w-8 text-gray-200" />
                <p className="mt-2 text-xs text-gray-400">No saved posts yet</p>
                <p className="text-[11px] text-gray-300 mt-0.5">Tap the bookmark icon on any post to save it</p>
              </div>
            ) : (
              bookmarks.map((b) => (
                <div key={b.slug} className="group flex items-center gap-2 px-4 py-2.5 transition hover:bg-gray-50">
                  <Link href={`/post/${b.slug}`} onClick={() => setOpen(false)} className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-gray-700 group-hover:text-brand transition">{b.title}</p>
                    <p className="text-[11px] text-gray-400 mt-0.5">{b.category} · {b.date}</p>
                  </Link>
                  <button
                    onClick={() => removeBookmark(b.slug)}
                    className="shrink-0 rounded-lg p-1.5 text-gray-300 opacity-0 transition hover:bg-red-50 hover:text-red-500 group-hover:opacity-100"
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
              className="flex items-center justify-center gap-1 border-t border-gray-100 px-4 py-3 text-xs font-semibold text-brand transition hover:bg-brand/5"
            >
              View all saved posts <ChevronRight className="h-3 w-3" />
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
