// ISR: cache page for 5 minutes, then regenerate in background
export const revalidate = 300;

import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { Hero } from "@/components/site/hero";
import dynamicImport from "next/dynamic";
import { NotificationSubscribe } from "@/components/site/nnotification-subscribe";
import { PushNotificationPrompt } from "@/components/push-notification-prompt";
import { StateGrid } from "@/components/site/state-grid";
import { categorySections, featuredResults } from "@/lib/data";
import { getCategoryCta } from "@/lib/categories";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { AdUnit } from "@/components/ads/ad-unit";

const CategoryColumns = dynamicImport(
  () => import("@/components/site/category-columns").then((m) => m.CategoryColumns),
  { ssr: true }
);

export default function HomePage() {
  const trending = featuredResults.slice(0, 4);

  return (
    <>
      <Header />
      <main className="bg-white">
        {/* 1. Hero Section (Minimal Dark Slate visual language, large clean typography, orange accent, stats) */}
        <Hero />

        {/* 2. Trending Notifications */}
        <section className="pt-20 sm:pt-24 pb-12 sm:pb-16 bg-white border-b border-gray-100 font-sans">
          <div className="container-page">

            {/* Section header */}
            <div className="flex items-center justify-between mb-7">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-gray-400 mb-1">
                  Priority Alerts
                </p>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
                  Trending Notifications
                </h2>
              </div>
              <Link
                href="/results"
                className="flex items-center gap-1 text-sm font-medium text-[#0D9488] hover:text-teal-700 transition-colors"
              >
                View all
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            {/* 4-column cards */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {trending.map((post, i) => {
                const cta = getCategoryCta(post.category, post.title, post.isExpired);

                /* Pick a left-border color per category */
                const borderColor =
                  cta.badgeLabel === "RESULT"     ? "border-l-emerald-400" :
                  cta.badgeLabel === "ADMIT CARD" ? "border-l-sky-400"     :
                  cta.badgeLabel === "VACANCY"    ? "border-l-amber-400"   :
                  cta.badgeLabel === "ANSWER KEY" ? "border-l-violet-400"  :
                                                    "border-l-teal-400";

                const labelColor =
                  cta.badgeLabel === "RESULT"     ? "text-emerald-600" :
                  cta.badgeLabel === "ADMIT CARD" ? "text-sky-600"     :
                  cta.badgeLabel === "VACANCY"    ? "text-amber-600"   :
                  cta.badgeLabel === "ANSWER KEY" ? "text-violet-600"  :
                                                    "text-teal-600";

                return (
                  <Link
                    key={post.slug || i}
                    href={post.slug ? `/post/${post.slug}` : "#"}
                    className={`group flex flex-col justify-between rounded-xl border border-gray-100 border-l-4 ${borderColor} bg-white p-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-200`}
                  >
                    <div>
                      {/* Category label + date */}
                      <div className="flex items-center justify-between mb-2.5">
                        <span className={`text-[10px] font-bold uppercase tracking-wider ${labelColor}`}>
                          {cta.categoryLabel}
                        </span>
                        <span className="text-[10px] text-gray-400">
                          {post.date || "Active"}
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="text-[13px] sm:text-sm font-semibold text-gray-800 group-hover:text-[#0D9488] transition-colors leading-snug line-clamp-3">
                        {post.title}
                      </h3>
                    </div>

                    {/* CTA footer */}
                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-xs font-semibold text-[#0D9488]">
                        {cta.actionText || "View Details"}
                      </span>
                      <ArrowUpRight className="h-3.5 w-3.5 text-gray-300 group-hover:text-[#0D9488] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                    </div>
                  </Link>
                );
              })}
            </div>

          </div>
        </section>

        {/* 3. Latest Updates: 6 Columns Grid (Results, Jobs, Admit Card, Answer Key, Admissions, Documents) */}
        <CategoryColumns sections={categorySections} />

        {/* 4. Single Clean Ad Placement */}
        <div className="container-page py-8">
          <AdUnit format="horizontal" />
        </div>

        {/* 5. Clean Subscribe Box */}
        <NotificationSubscribe />

        <PushNotificationPrompt />

        {/* 6. State Desk */}
        <StateGrid />
      </main>
      <Footer />
    </>
  );
}
