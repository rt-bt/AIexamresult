"use client";

import { useBookmarks } from "@/lib/hooks/use-bookmarks";
import { Bookmark, BookmarkCheck } from "lucide-react";

export function BookmarkBtn({ slug, title, category, date }: { slug: string; title: string; category: string; date: string }) {
  const { hasBookmark, addBookmark, removeBookmark } = useBookmarks();
  const saved = hasBookmark(slug);

  return (
    <button
      onClick={() => saved ? removeBookmark(slug) : addBookmark({ slug, title, category, date })}
      className={`flex w-full items-center justify-center gap-2 rounded-full px-4 py-2.5 text-sm font-black transition ${
        saved ? "bg-amber-100 text-amber-700" : "border border-slate-200 text-slate-600 hover:border-slate-300"
      }`}
    >
      {saved ? <BookmarkCheck className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}
      {saved ? "Saved" : "Save for Later"}
    </button>
  );
}
