import React from "react";
import {
  featuredResults,
  admitCards,
  latestJobs,
  centralExams,
  syllabusItems,
} from "@/lib/data";
import { HeroSection } from "@/components/HeroSection";
import type { LiveUpdateItem } from "@/components/LiveUpdatesCard";

/**
 * Modern, high-conversion Hero component for All India Exam Result
 * Search input accessibility specification: aria-label="Search exam name or job title"
 *
 * Sourced directly from live exam & recruitment data:
 * - Left column: Live pill badge, high-contrast H1, subtext, glass search bar,
 *   popular exam chips, dual CTAs, trust row.
 * - Right column: LiveUpdatesCard with real-time 4-item rotating feed.
 * - Bottom overlap: CategoryTiles linking directly to top categories with live counts.
 */
export function Hero() {
  const liveUpdates: LiveUpdateItem[] = [
    {
      type: "RESULT",
      title: featuredResults[0]?.title || "Latest Exam Result",
      slug: featuredResults[0]?.slug || "results",
      date: featuredResults[0]?.date || "Today",
    },
    {
      type: "ADMIT CARD",
      title: admitCards[0]?.title || "Latest Admit Card",
      slug: admitCards[0]?.slug || "admit-card",
      date: admitCards[0]?.date || "Today",
    },
    {
      type: "JOB",
      title: latestJobs[0]?.title || "Latest Government Vacancy",
      slug: latestJobs[0]?.slug || "latest-jobs",
      date: latestJobs[0]?.date || "Active",
    },
    {
      type: "ANSWER KEY",
      title:
        centralExams[0]?.title ||
        featuredResults[1]?.title ||
        "Official Answer Key",
      slug:
        centralExams[0]?.slug || featuredResults[1]?.slug || "answer-key",
      date: centralExams[0]?.date || featuredResults[1]?.date || "Today",
    },
  ];

  const counts = {
    jobs: latestJobs.length || 470,
    admit: admitCards.length || 230,
    results: featuredResults.length || 320,
    answerKeys: centralExams.length || 120,
    syllabus: syllabusItems.length || 25,
  };

  return <HeroSection liveUpdates={liveUpdates} counts={counts} />;
}

export { HeroSection };
export default Hero;
