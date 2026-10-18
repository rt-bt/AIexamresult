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
import { ArrowUpRight, TrendingUp, CheckCircle2 } from "lucide-react";
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

        {/* 2. Trending Alerts: Clean minimal verified cards (No 3D illustration, No excessive cards) */}
        <section className="py-12 sm:py-16 bg-white border-b border-[#E2E8F0] font-sans">
          <div className="container-page">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
              <div className="flex items-start gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#343A46] text-[#F28A2E] shadow-xs">
                  <TrendingUp className="h-5 w-5" />
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-[0.16em] text-[#8B8F96]">
                      PRIORITY ALERTS
                    </span>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 uppercase tracking-wider font-heading">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      LIVE
                    </span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-[#172033] font-heading tracking-tight mt-0.5">
                    Trending Notifications
                  </h2>
                </div>
              </div>
              <Link
                href="/results"
                className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#343A46] hover:text-[#F28A2E] transition-colors font-heading"
              >
                <span>View All Updates</span>
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {trending.map((post, i) => {
                const cta = getCategoryCta(post.category, post.title, post.isExpired);

                return (
                  <Link
                    key={post.slug || i}
                    href={post.slug ? `/post/${post.slug}` : "#"}
                    className="group rounded-xl border border-[#E2E8F0] bg-white p-5 shadow-xs hover:border-[#8B8F96] hover:shadow-md transition-all duration-200 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#F28A2E]/10 text-[10.5px] font-bold text-[#F28A2E] uppercase tracking-wider">
                          <CheckCircle2 className="h-3 w-3" />
                          {cta.badgeLabel || "Verified"}
                        </span>
                        <span className="text-[11px] font-bold text-[#8B8F96]">
                          #{i + 1}
                        </span>
                      </div>
                      <h3 className="text-sm font-bold text-[#172033] group-hover:text-[#F28A2E] transition-colors leading-snug line-clamp-2 mb-2 font-heading">
                        {post.title}
                      </h3>
                      <p className="text-xs text-[#8B8F96]">
                        {cta.categoryLabel} · {post.date || "Active Update"}
                      </p>
                    </div>

                    <div className="mt-5 pt-3 border-t border-[#F1F5F9] flex items-center justify-between text-xs font-bold text-[#343A46] group-hover:text-[#F28A2E] transition-colors font-heading">
                      <span>{cta.actionText || "View Details"}</span>
                      <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
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
