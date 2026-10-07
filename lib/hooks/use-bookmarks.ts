"use client";

import { useState, useCallback, useEffect } from "react";

type Bookmark = { slug: string; title: string; category: string; date: string };

const STORAGE_KEY = "aier_bookmarks";

function save(items: Bookmark[]) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(items)); } catch {}
}

export function useBookmarks() {
  const [items, setItems] = useState<Bookmark[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setItems(JSON.parse(stored));
      }
    } catch {}
  }, []);

  const add = useCallback((b: Bookmark) => {
    setItems((prev) => {
      if (prev.some((x) => x.slug === b.slug)) return prev;
      const next = [b, ...prev];
      save(next);
      return next;
    });
  }, []);

  const remove = useCallback((slug: string) => {
    setItems((prev) => {
      const next = prev.filter((x) => x.slug !== slug);
      save(next);
      return next;
    });
  }, []);

  const has = useCallback((slug: string) => items.some((x) => x.slug === slug), [items]);

  return { bookmarks: items, addBookmark: add, removeBookmark: remove, hasBookmark: has, bookmarkCount: items.length };
}
