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
import { ArrowUpRight, TrendingUp } from "lucide-react";
import { TiltCard } from "@/components/unlumen-ui/tilt-card";
import DotField from "@/components/DotField";
import { AdUnit } from "@/components/ads/ad-unit";

const CategoryColumns = dynamicImport(() => import("@/components/site/category-columns").then(m => m.CategoryColumns), { ssr: true });

export default function HomePage() {
  const trending = featuredResults.slice(0, 4);

  return (
    <>
      <Header />
      <main>
        {/* 1. Hero Section (Clean 2-line headline, mouse scrub video, quick search) */}
        <Hero />

        {/* 2. Latest Updates: 6 Columns Grid (Results, Jobs, Admit Card, Answer Key, Admissions, Documents) */}
        <div className="relative overflow-hidden bg-[#FAFAFA] border-b border-[#DEDEDE]">
          <DotField
            dotRadius={1.2}
            dotSpacing={16}
            bulgeStrength={50}
            glowRadius={140}
            sparkle={false}
            waveAmplitude={0}
            cursorRadius={400}
            cursorForce={0.08}
            bulgeOnly
            gradientFrom="#71717a"
            gradientTo="#a1a1aa"
            glowColor="#52525b"
            opacity={0.12}
          />
          <div className="relative z-10 py-4">
            <CategoryColumns sections={categorySections} />
          </div>
        </div>

        {/* 3. Top Breaking / Trending Alerts (3D Tilt Cards) */}
        <section className="py-10 bg-white border-b border-[#DEDEDE] font-sans">
          <div className="container-page">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#5B0111] text-[#FFD84D] shadow-sm">
                  <TrendingUp className="h-5 w-5" />
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl sm:text-2xl font-bold text-[#111111] font-heading tracking-tight">Trending Alerts</h2>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#FF5B3E]/10 text-[#FF5B3E] border border-[#FF5B3E]/20 animate-pulse font-heading">
                      LIVE
                    </span>
                  </div>
                  <p className="text-xs text-neutral-500 font-sans">Top results &amp; recruitment updates today</p>
                </div>
              </div>
              <Link href="/results" className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#111111] hover:text-[#FF5B3E] transition font-heading">
                <span>View All Updates</span>
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {trending.map((post, i) => {
                const cta = getCategoryCta(post.category, post.title, post.isExpired);

                return (
                  <TiltCard
                    key={post.slug || i}
                    title={post.title}
                    description={`${cta.categoryLabel} · ${post.date || "Active Update"}`}
                    category={cta.categoryLabel}
                    price={`#${i + 1}`}
                    badgeLabel={cta.badgeLabel}
                    badgeVariant={cta.badgeVariant}
                    actionText={cta.actionText}
                    accentColor={cta.accentColor}
                    imageSrc={cta.cardImage}
                    imageAlt={post.title}
                    href={post.slug ? `/post/${post.slug}` : "#"}
                  />
                );
              })}
            </div>
          </div>
        </section>

        {/* 4. Single Clean Ad Placement */}
        <div className="container-page py-6">
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
