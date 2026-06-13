"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { Settings, User, TrendingUp, ChevronRight, Bell, Bookmark } from "lucide-react";
import { loadPrefs } from "@/lib/user-prefs";
import type { UserPrefs } from "@/lib/user-prefs";

export default function DashboardPage() {
  const [prefs, setPrefs] = useState<UserPrefs | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); setPrefs(loadPrefs()); }, []);

  if (!mounted) return null;

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-br from-gray-50 to-teal-50 pb-20">
        <div className="container-page py-8 sm:py-12">
          <div className="mx-auto max-w-3xl">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">My Dashboard</h1>
                <p className="mt-1 text-gray-500 text-sm">Personalized exam updates & quick access</p>
              </div>
              <Link href="/dashboard/settings" className="inline-flex items-center gap-2 rounded-xl bg-white border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition hover:border-brand/30 hover:text-brand">
                <Settings className="h-4 w-4" /> Edit
              </Link>
            </div>

            {!prefs?.category && !prefs?.targetExams?.length ? (
              <div className="rounded-2xl bg-gradient-to-br from-brand to-emerald-700 p-8 text-white text-center shadow-lg">
                <User className="mx-auto h-12 w-12 text-white/60" />
                <h2 className="mt-4 text-xl font-bold">Set Up Your Dashboard</h2>
                <p className="mt-2 text-white/70 text-sm">Select your category, state & target exams to see personalized updates</p>
                <Link href="/dashboard/settings" className="mt-5 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-bold text-brand shadow-lg transition hover:bg-white/90">
                  Get Started <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
            ) : (
              <div className="space-y-5">
                <div className="rounded-2xl bg-white border border-gray-100 p-5 shadow-sm">
                  <h2 className="text-sm font-bold text-gray-700 mb-4 flex items-center gap-2">
                    <User className="h-4 w-4 text-brand" /> Your Profile
                  </h2>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[
                      { label: "Category", value: prefs?.category || "Not set" },
                      { label: "State", value: prefs?.state || "All India" },
                      { label: "Qualification", value: prefs?.qualification || "Not set" },
                      { label: "Target Exams", value: String(prefs?.targetExams?.length || 0) },
                    ].map((item) => (
                      <div key={item.label} className="rounded-xl bg-gray-50 p-3">
                        <p className="text-[10px] font-semibold text-gray-400 uppercase">{item.label}</p>
                        <p className="text-sm font-bold text-gray-800 mt-0.5">{item.value}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {[
                    { href: "/exam-comparison", icon: TrendingUp, label: "Compare Exams", color: "text-brand" },
                    { href: "/exam-calendar", icon: Bell, label: "Exam Calendar", color: "text-orange-500" },
                    { href: "/document-checklist", icon: Bookmark, label: "Checklist", color: "text-purple-500" },
                  ].map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link key={item.href} href={item.href} className="rounded-xl bg-white border border-gray-100 p-4 shadow-sm hover:shadow-md transition text-center">
                        <Icon className={`mx-auto h-6 w-6 ${item.color}`} />
                        <p className="mt-1.5 text-xs font-semibold text-gray-700">{item.label}</p>
                      </Link>
                    );
                  })}
                </div>

                {prefs?.targetExams && prefs.targetExams.length > 0 && (
                  <div className="rounded-2xl bg-white border border-gray-100 p-5 shadow-sm">
                    <h2 className="text-sm font-bold text-gray-700 mb-3">Your Target Exams</h2>
                    <div className="flex flex-wrap gap-2">
                      {prefs.targetExams.map((e) => (
                        <Link key={e} href={`/search?q=${encodeURIComponent(e)}`}
                          className="rounded-full bg-brand/10 px-4 py-2 text-xs font-semibold text-brand border border-brand/20 hover:bg-brand hover:text-white transition">
                          {e}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
