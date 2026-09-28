"use client";

import { useState } from "react";
import { useBookmarks } from "@/lib/hooks/use-bookmarks";
import { Bookmark, BookmarkCheck } from "lucide-react";

export function BookmarkBtn({ slug, title, category, date }: { slug: string; title: string; category: string; date: string }) {
  const { hasBookmark, addBookmark, removeBookmark } = useBookmarks();
  const saved = hasBookmark(slug);

  return (
    <button
      onClick={() => saved ? removeBookmark(slug) : addBookmark({ slug, title, category, date })}
      className={`flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition-all w-full ${
        saved
          ? "bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100"
          : "bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100 hover:text-gray-800"
      }`}
    >
      {saved ? <BookmarkCheck className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}
      {saved ? "Saved" : "Save for Later"}
    </button>
  );
}
