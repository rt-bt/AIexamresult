"use client";

import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { useBookmarks } from "@/lib/hooks/use-bookmarks";
import { BookmarkX, Bookmark } from "lucide-react";

export default function BookmarksPage() {
  const { bookmarks, removeBookmark } = useBookmarks();

  return (
    <>
      <Header />
      <main>
        <div className="bg-gradient-to-br from-[#0D9488] via-[#0F766E] to-[#115E59] py-12">
          <div className="container-page">
            <h1 className="flex items-center gap-3 text-3xl font-black text-white sm:text-4xl">
              <Bookmark className="h-8 w-8 fill-white/90 text-white" /> Saved Posts
            </h1>
            <p className="mt-2 text-white/70">{bookmarks.length} post{bookmarks.length !== 1 ? "s" : ""} saved</p>
          </div>
        </div>

        <section className="container-page py-8">
          {bookmarks.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-14 text-center">
              <BookmarkX className="mx-auto h-12 w-12 text-slate-300" />
              <h2 className="mt-4 text-xl font-bold text-slate-500">No saved posts yet</h2>
              <p className="mt-1 text-sm text-slate-400">Bookmark posts to read later</p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {bookmarks.map((b) => (
                <div key={b.slug} className="group relative rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
                  <a href={`/post/${b.slug}`}>
                    <span className="inline-block rounded-full bg-[#0D9488]/10 px-3 py-0.5 text-xs font-bold uppercase tracking-wide text-[#0D9488]">
                      {b.category}
                    </span>
                    <h3 className="mt-3 font-bold leading-snug text-slate-800 group-hover:text-[#0D9488]">
                      {b.title}
                    </h3>
                    <p className="mt-2 text-xs text-slate-400">{b.date}</p>
                  </a>
                  <button
                    onClick={() => removeBookmark(b.slug)}
                    className="absolute right-3 top-3 rounded-full p-1.5 text-slate-300 transition hover:bg-red-50 hover:text-red-500"
                    title="Remove bookmark"
                  >
                    <BookmarkX className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}
