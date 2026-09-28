import Link from "next/link";

const searches = ["SSC CGL result", "UPSC notification", "Railway admit card", "Bihar teacher vacancy", "NEET UG counselling", "CTET answer key", "UP Police result", "Rajasthan CET syllabus", "CBSE board result", "Scholarship form 2026"];

export function PopularSearches() {
  return (
    <section className="py-10">
      <div className="container-page">
        <div className="mb-8 text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-brand/10 px-4 py-1.5 text-sm font-bold text-brand">Trending now</span>
          <h2 className="mt-3 text-3xl font-black tracking-tight text-ink dark:text-white">Popular Searches</h2>
        </div>
        <div className="flex flex-wrap justify-center gap-2">
          {searches.map((search) => (
            <Link key={search} href={`/search?q=${encodeURIComponent(search)}`} className="rounded-full border border-slate-100 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 shadow-card transition hover:-translate-y-0.5 hover:border-brand/30 hover:text-brand hover:shadow-card-hover dark:border-white/10 dark:bg-white/10 dark:text-slate-300">
              {search}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
