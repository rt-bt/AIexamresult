"use client";

import { useMemo } from "react";
import { useParams, notFound } from "next/navigation";
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { SectionContent } from "@/components/site/section-content";
import { featuredResults, latestJobs, notifications, centralExams, admissions, documents } from "@/lib/data";
import type { PostCard } from "@/lib/data";

const stateNames: Record<string, string> = {
  up: "Uttar Pradesh", bihar: "Bihar", rajasthan: "Rajasthan", mp: "Madhya Pradesh",
  maharashtra: "Maharashtra", delhi: "Delhi", haryana: "Haryana", punjab: "Punjab",
  uttarakhand: "Uttarakhand", jharkhand: "Jharkhand", odisha: "Odisha", "west-bengal": "West Bengal",
  gujarat: "Gujarat", karnataka: "Karnataka", "tamil-nadu": "Tamil Nadu", "andhra-pradesh": "Andhra Pradesh",
  telangana: "Telangana", kerala: "Kerala", assam: "Assam", chhattisgarh: "Chhattisgarh",
  "himachal-pradesh": "Himachal Pradesh", "jammu-kashmir": "Jammu and Kashmir", india: "India",
};

export default function StatePage() {
  const { slug } = useParams<{ slug: string }>();
  const stateName = stateNames[slug];

  if (!stateName) notFound();

  const allPosts = useMemo<PostCard[]>(() => {
    const all = [...featuredResults, ...latestJobs, ...notifications, ...centralExams, ...admissions, ...documents];
    return all.filter((p) => p.state.toLowerCase() === stateName.toLowerCase()).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [stateName]);

  return (
    <>
      <Header />
      <main>
        <div className="bg-gradient-to-br from-[#4F46E5] via-[#0D9488] to-[#115E59] py-12">
          <div className="container-page">
            <p className="text-sm font-bold uppercase tracking-wide text-[#5EEAD4]">State-wise Updates</p>
            <h1 className="mt-3 text-3xl font-black text-white sm:text-4xl">{stateName} Exam Results & Jobs</h1>
            <p className="mt-2 text-white/70">{allPosts.length} post{allPosts.length !== 1 ? "s" : ""} found for {stateName}</p>
          </div>
        </div>
        <SectionContent title={stateName} items={allPosts} />
      </main>
      <Footer />
    </>
  );
}
