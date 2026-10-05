"use client";

import { useMemo } from "react";
import { useParams, notFound } from "next/navigation";
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { SectionContent } from "@/components/site/section-content";
import { featuredResults, latestJobs, notifications, centralExams, admissions, documents } from "@/lib/data";
import type { PostCard } from "@/lib/data";

const stateNames: Record<string, string> = {
  // Short codes
  up: "Uttar Pradesh",
  bihar: "Bihar",
  rajasthan: "Rajasthan",
  mp: "Madhya Pradesh",
  maharashtra: "Maharashtra",
  delhi: "Delhi",
  haryana: "Haryana",
  punjab: "Punjab",
  uttarakhand: "Uttarakhand",
  jharkhand: "Jharkhand",
  odisha: "Odisha",
  "west-bengal": "West Bengal",
  gujarat: "Gujarat",
  karnataka: "Karnataka",
  "tamil-nadu": "Tamil Nadu",
  "andhra-pradesh": "Andhra Pradesh",
  telangana: "Telangana",
  kerala: "Kerala",
  assam: "Assam",
  chhattisgarh: "Chhattisgarh",
  "himachal-pradesh": "Himachal Pradesh",
  "jammu-kashmir": "Jammu & Kashmir",
  "jammu-and-kashmir": "Jammu & Kashmir",
  india: "India",
  // Full slugs matching StateGrid
  "uttar-pradesh": "Uttar Pradesh",
  "madhya-pradesh": "Madhya Pradesh",
};

export default function StatePage() {
  const { slug } = useParams<{ slug: string }>();
  const stateName = stateNames[slug] || (slug ? slug.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ").replace(/And/g, "&") : "");

  if (!stateName) notFound();

  const allPosts = useMemo<PostCard[]>(() => {
    const all = [...featuredResults, ...latestJobs, ...notifications, ...centralExams, ...admissions, ...documents];
    const target = stateName.toLowerCase();
    return all.filter((p) => {
      const pState = (p.state || "").toLowerCase();
      return pState === target || (target.includes("jammu") && pState.includes("jammu"));
    }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [stateName]);

  return (
    <>
      <Header />
      <main>
        <div className="bg-gradient-to-br from-[#5B0111] via-[#3a000b] to-[#111111] py-12 border-b border-black/20">
          <div className="container-page">
            <p className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#FFD84D] font-heading">State-wise Updates</p>
            <h1 className="mt-2 text-3xl font-black text-white sm:text-4xl font-heading">{stateName} Exam Results & Jobs</h1>
            <p className="mt-2 text-white/80 font-sans">{allPosts.length} post{allPosts.length !== 1 ? "s" : ""} found for {stateName}</p>
          </div>
        </div>
        <SectionContent title={stateName} items={allPosts} />
      </main>
      <Footer />
    </>
  );
}
