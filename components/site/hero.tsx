"use client";

import { useState } from "react";
import { Search, ArrowRight, ShieldCheck, CheckCircle2, Sparkles, Building2, ExternalLink } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { VoiceSearchBtn } from "./voice-search";
import { HeroDocumentVisual } from "./hero-document-visual";
import { cn } from "@/lib/utils";

const examOptions = [
  "SSC CGL", "SSC CHSL", "SSC MTS", "SSC GD Constable", "SSC JE", "SSC CPO",
  "RRB NTPC", "RRB Group D", "RRB JE", "RRB Technician", "Railway ALP",
  "UPSC IAS", "UPSC NDA", "UPSC CDS", "UPSC CAPF", "UPSC EPFO",
  "IBPS PO", "IBPS Clerk", "IBPS RRB", "SBI PO", "SBI Clerk", "RBI Grade B",
  "CTET", "UPTET", "REET", "Bihar Teacher", "UP Police Constable",
  "NEET UG", "JEE Main", "JEE Advanced", "CUET UG",
  "Indian Army", "Indian Navy", "Indian Air Force", "Agniveer"
];

const trendingChips = ["SSC CGL", "RRB NTPC", "UPSC IAS", "NEET UG", "CTET"];

export type HeroThemeVariation = "navy-saffron" | "light-portal" | "navy-pro";

export function Hero() {
  const router = useRouter();
  // Default and Final Direction is Variation 3: "navy-saffron"
  const [theme, setTheme] = useState<HeroThemeVariation>("navy-saffron");
  const [exam, setExam] = useState("");
  const [rollNo, setRollNo] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  const filtered = exam.trim()
    ? examOptions.filter((e) => e.toLowerCase().includes(exam.toLowerCase()))
    : [];

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const q = [exam, rollNo].filter(Boolean).join(" ");
    if (q.length >= 2) {
      router.push(`/search?q=${encodeURIComponent(q)}`);
    } else {
      router.push("/results");
    }
  }

  const isLight = theme === "light-portal";
  const isNavyPro = theme === "navy-pro";
  const isNavySaffron = theme === "navy-saffron"; // Final Direction

  return (
    <section
      className={cn(
        "relative overflow-hidden font-sans transition-colors duration-300",
        isLight
          ? "bg-[#F6F9FC] text-[#172033] border-b border-slate-200"
          : isNavyPro
          ? "bg-gradient-to-b from-[#0c2340] via-[#123B6D] to-[#0a1a30] text-white border-b border-white/10"
          : "bg-gradient-to-b from-[#0b2447] via-[#123B6D] to-[#091a32] text-white border-b border-white/10"
      )}
    >
      {/* Subtle Government/Education Watermark & Grid Background (SVG/CSS, No Heavy Video) */}
      <div className="absolute inset-0 pointer-events-none select-none overflow-hidden" aria-hidden="true">
        {/* Subtle grid pattern */}
        <div
          className={cn(
            "absolute inset-0 opacity-15",
            isLight
              ? "bg-[linear-gradient(to_right,#0000000d_1px,transparent_1px),linear-gradient(to_bottom,#0000000d_1px,transparent_1px)] bg-[size:32px_32px]"
              : "bg-[linear-gradient(to_right,#ffffff0f_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0f_1px,transparent_1px)] bg-[size:32px_32px]"
          )}
        />

        {/* Ambient warmth glow for Navy+Saffron (Variation 3 Final Direction) */}
        {isNavySaffron && (
          <div className="absolute -top-32 right-1/4 h-96 w-96 rounded-full bg-[#F59E0B]/10 blur-3xl pointer-events-none" />
        )}
        {/* Subtle royal blue depth glow */}
        <div className="absolute bottom-0 -left-20 h-80 w-80 rounded-full bg-[#1D5FA7]/20 blur-3xl pointer-events-none" />
      </div>

      {/* Top Banner & Visual Variations Switcher Bar */}
      <div className="container-page relative z-20 pt-4 pb-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-3 border-black/5 dark:border-white/10">
          {/* Government Portal Badge */}
          <div className="flex items-center gap-2">
            <span
              className={cn(
                "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-wide",
                isLight
                  ? "bg-[#123B6D]/10 text-[#123B6D] border border-[#123B6D]/20"
                  : "bg-white/10 text-white border border-white/15"
              )}
            >
              <span className="h-2 w-2 rounded-full bg-[#F59E0B]" />
              <span>All India Govt Exam &amp; Result Information Portal</span>
            </span>
            <span className="hidden md:inline-flex items-center gap-1 text-[11px] text-slate-400">
              <ShieldCheck className="h-3.5 w-3.5 text-[#16A34A]" />
              <span>Official Notifications Only</span>
            </span>
          </div>

          {/* 3 Visual Variations Switcher (Allows testing all 3 requested variations live!) */}
          <div
            className={cn(
              "inline-flex items-center gap-1 p-1 rounded-full border text-xs font-semibold self-start sm:self-auto",
              isLight
                ? "bg-white border-slate-200 shadow-sm"
                : "bg-black/35 border-white/15 backdrop-blur-md"
            )}
            role="tablist"
            aria-label="Hero Visual Variations"
          >
            <span className={cn("text-[10px] uppercase font-bold tracking-wider px-2", isLight ? "text-slate-400" : "text-white/50")}>
              Theme:
            </span>
            <button
              type="button"
              onClick={() => setTheme("navy-saffron")}
              role="tab"
              aria-selected={theme === "navy-saffron"}
              className={cn(
                "px-2.5 py-1 rounded-full text-[11px] font-bold transition-all",
                theme === "navy-saffron"
                  ? "bg-[#F59E0B] text-[#0f243d] shadow-sm"
                  : isLight
                  ? "text-slate-600 hover:text-slate-900"
                  : "text-white/70 hover:text-white"
              )}
            >
              ★ 3. Navy + Saffron (Final)
            </button>
            <button
              type="button"
              onClick={() => setTheme("light-portal")}
              role="tab"
              aria-selected={theme === "light-portal"}
              className={cn(
                "px-2.5 py-1 rounded-full text-[11px] font-bold transition-all",
                theme === "light-portal"
                  ? "bg-[#123B6D] text-white shadow-sm"
                  : isLight
                  ? "text-slate-600 hover:text-slate-900"
                  : "text-white/70 hover:text-white"
              )}
            >
              2. Light Portal
            </button>
            <button
              type="button"
              onClick={() => setTheme("navy-pro")}
              role="tab"
              aria-selected={theme === "navy-pro"}
              className={cn(
                "px-2.5 py-1 rounded-full text-[11px] font-bold transition-all",
                theme === "navy-pro"
                  ? "bg-[#1D5FA7] text-white shadow-sm"
                  : isLight
                  ? "text-slate-600 hover:text-slate-900"
                  : "text-white/70 hover:text-white"
              )}
            >
              1. Navy Pro
            </button>
          </div>
        </div>
      </div>

      {/* Hero Content: Two-Column Desktop / Responsive Stack Mobile */}
      <div className="container-page relative z-10 py-8 sm:py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* ========================================================
              LEFT COLUMN: Heading, Subheading, CTAs & Search Form
              ======================================================== */}
          <div className="lg:col-span-7 flex flex-col text-left">
            {/* Live Status Pill */}
            <div className="flex items-center gap-2 mb-3.5">
              <span
                className={cn(
                  "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-wide shadow-sm",
                  isLight
                    ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                    : "bg-[#16A34A]/20 text-[#22c55e] border border-[#16A34A]/40"
                )}
              >
                <span className="h-2 w-2 rounded-full bg-[#16A34A] animate-pulse" />
                <span>Live Recruitment &amp; Results 2026</span>
              </span>
              <span
                className={cn(
                  "text-xs font-semibold hidden sm:inline",
                  isLight ? "text-slate-500" : "text-white/70"
                )}
              >
                Fast · Ad-Light · Direct PDF Links
              </span>
            </div>

            {/* Exact Required Heading */}
            <h1
              className={cn(
                "font-heading text-3xl sm:text-4xl lg:text-[46px] xl:text-[50px] font-extrabold leading-[1.12] tracking-tight mb-4",
                isLight ? "text-[#172033]" : "text-white"
              )}
            >
              Sarkari Exam Results, Jobs &amp; Admit Cards —{" "}
              <span
                className={cn(
                  "underline decoration-2 underline-offset-4",
                  isLight
                    ? "text-[#123B6D] decoration-[#F59E0B]"
                    : isNavySaffron
                    ? "text-[#F59E0B] decoration-[#16A34A]"
                    : "text-sky-300 decoration-[#1D5FA7]"
                )}
              >
                Ek Hi Jagah
              </span>
            </h1>

            {/* Exact Required Subheading */}
            <p
              className={cn(
                "text-base sm:text-lg max-w-xl mb-6 leading-relaxed font-sans",
                isLight ? "text-slate-600" : "text-slate-200"
              )}
            >
              SSC, UPSC, Railway, Banking aur State Exams ke verified updates sabse pehle paaiye.
            </p>

            {/* Exact Required CTA Buttons */}
            <div className="flex flex-wrap items-center gap-3.5 mb-7">
              {/* Primary CTA: "Find Latest Results" */}
              <Link
                href="/results"
                className={cn(
                  "inline-flex items-center justify-center gap-2 rounded-xl px-6 sm:px-7 py-3 text-sm sm:text-[15px] font-bold shadow-md transition-all active:scale-[0.98] font-heading",
                  isNavySaffron
                    ? "bg-[#F59E0B] hover:bg-[#e08d03] text-[#0f243d] shadow-[#F59E0B]/25"
                    : isLight
                    ? "bg-[#123B6D] hover:bg-[#1D5FA7] text-white shadow-[#123B6D]/20"
                    : "bg-[#1D5FA7] hover:bg-[#174e8b] text-white shadow-[#1D5FA7]/30"
                )}
              >
                <span>Find Latest Results</span>
                <ArrowRight className="h-4 w-4" />
              </Link>

              {/* Secondary CTA: "Browse Latest Jobs" */}
              <Link
                href="/latest-jobs"
                className={cn(
                  "inline-flex items-center justify-center gap-2 rounded-xl px-6 sm:px-7 py-3 text-sm sm:text-[15px] font-bold border transition-all active:scale-[0.98] font-heading",
                  isLight
                    ? "bg-white hover:bg-slate-100 text-[#172033] border-slate-300 shadow-sm"
                    : "bg-white/10 hover:bg-white/20 text-white border-white/20 backdrop-blur-md"
                )}
              >
                <span>Browse Latest Jobs</span>
              </Link>
            </div>

            {/* ========================================================
                SEARCH BAR: Exam or Job + Roll No + Voice + Trending Chips
                ======================================================== */}
            <div className="w-full max-w-2xl">
              <form
                onSubmit={handleSubmit}
                className={cn(
                  "rounded-2xl border p-2 sm:p-2.5 transition-all shadow-xl backdrop-blur-xl",
                  isLight
                    ? "bg-white border-slate-300/80 shadow-slate-200/60"
                    : "bg-[#0b2342]/80 border-white/20 shadow-black/40 hover:border-white/30"
                )}
              >
                <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
                  {/* 1. Exam Name / Job Title Input with Dropdown & Voice Search */}
                  <div className="relative flex-1">
                    <label htmlFor="hero-search-exam" className="sr-only">
                      Search exam or job
                    </label>
                    <Search
                      className={cn(
                        "absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2",
                        isLight ? "text-slate-400" : "text-white/40"
                      )}
                      aria-hidden="true"
                    />
                    <input
                      id="hero-search-exam"
                      aria-label="Search exam name or job title"
                      type="text"
                      value={exam}
                      onChange={(e) => {
                        setExam(e.target.value);
                        setShowDropdown(true);
                      }}
                      onFocus={() => setShowDropdown(true)}
                      onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
                      placeholder="Search exam or job (SSC, Railway, UPSC)..."
                      className={cn(
                        "w-full rounded-xl pl-10 pr-10 py-3 text-[14.5px] font-medium outline-none transition font-sans border",
                        isLight
                          ? "bg-slate-50 border-slate-200 text-[#172033] placeholder-slate-400 focus:bg-white focus:border-[#123B6D]"
                          : "bg-white/5 border-white/10 text-white placeholder-white/45 focus:bg-white/10 focus:border-[#F59E0B]"
                      )}
                    />
                    {/* Voice Search Button */}
                    <div className="absolute right-2 top-1/2 -translate-y-1/2">
                      <VoiceSearchBtn
                        onResult={(val) => {
                          setExam(val);
                          router.push(`/search?q=${encodeURIComponent(val)}`);
                        }}
                        className={cn(
                          "p-1.5 transition active:scale-90",
                          isLight ? "text-slate-400 hover:text-[#123B6D]" : "text-white/60 hover:text-white"
                        )}
                      />
                    </div>

                    {/* Autocomplete Dropdown */}
                    {showDropdown && filtered.length > 0 && (
                      <div
                        className={cn(
                          "absolute left-0 right-0 top-full z-40 mt-1.5 max-h-56 overflow-auto rounded-xl border p-1 shadow-2xl backdrop-blur-2xl",
                          isLight
                            ? "bg-white border-slate-200 shadow-slate-400/20"
                            : "bg-[#0b2342] border-white/20 shadow-black"
                        )}
                      >
                        {filtered.map((item) => (
                          <button
                            key={item}
                            type="button"
                            onMouseDown={() => {
                              setExam(item);
                              setShowDropdown(false);
                            }}
                            className={cn(
                              "w-full px-3.5 py-2 text-left text-xs sm:text-sm font-medium rounded-lg transition",
                              isLight
                                ? "text-slate-800 hover:bg-slate-100"
                                : "text-white/85 hover:bg-white/10 hover:text-white"
                            )}
                          >
                            {item}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* 2. Roll Number Input (Optional) */}
                  <div className="relative sm:w-44">
                    <label htmlFor="hero-search-roll" className="sr-only">
                      Roll number
                    </label>
                    <input
                      id="hero-search-roll"
                      aria-label="Roll number"
                      type="text"
                      value={rollNo}
                      onChange={(e) => setRollNo(e.target.value)}
                      placeholder="Roll No. (Optional)"
                      className={cn(
                        "w-full rounded-xl px-3.5 py-3 text-[14px] font-medium outline-none transition font-sans border",
                        isLight
                          ? "bg-slate-50 border-slate-200 text-[#172033] placeholder-slate-400 focus:bg-white focus:border-[#123B6D]"
                          : "bg-white/5 border-white/10 text-white placeholder-white/45 focus:bg-white/10 focus:border-[#F59E0B]"
                      )}
                    />
                  </div>

                  {/* 3. Search Button */}
                  <button
                    type="submit"
                    className={cn(
                      "inline-flex items-center justify-center gap-1.5 rounded-xl px-6 py-3 text-[14.5px] font-bold shadow-md transition-all active:scale-95 font-heading shrink-0",
                      isNavySaffron
                        ? "bg-[#F59E0B] hover:bg-[#e08d03] text-[#0f243d]"
                        : isLight
                        ? "bg-[#123B6D] hover:bg-[#1D5FA7] text-white"
                        : "bg-[#1D5FA7] hover:bg-[#174e8b] text-white"
                    )}
                  >
                    <Search className="h-4 w-4" />
                    <span>Search</span>
                  </button>
                </div>
              </form>

              {/* Exact Trending Exam Chips */}
              <div className="mt-3 flex flex-wrap items-center gap-1.5 text-xs">
                <span
                  className={cn(
                    "font-bold text-[11px] mr-1 uppercase tracking-wider",
                    isLight ? "text-slate-400" : "text-white/50"
                  )}
                >
                  Trending:
                </span>
                {trendingChips.map((chip) => (
                  <button
                    key={chip}
                    type="button"
                    onClick={() => router.push(`/search?q=${encodeURIComponent(chip)}`)}
                    className={cn(
                      "rounded-full px-2.5 py-1 text-[11.5px] font-semibold border transition-all active:scale-95",
                      isLight
                        ? "bg-white border-slate-200 text-slate-700 hover:border-[#123B6D] hover:text-[#123B6D]"
                        : isNavySaffron
                        ? "bg-white/5 border-white/15 text-white/85 hover:border-[#F59E0B] hover:bg-[#F59E0B]/15 hover:text-[#F59E0B]"
                        : "bg-white/5 border-white/15 text-white/85 hover:border-[#1D5FA7] hover:text-white"
                    )}
                  >
                    {chip}
                  </button>
                ))}
              </div>
            </div>

            {/* Trust Signals Footer */}
            <div className="mt-6 flex flex-wrap items-center gap-4 text-xs">
              <div className="flex items-center gap-1.5 text-slate-400">
                <CheckCircle2 className="h-4 w-4 text-[#16A34A]" />
                <span className={cn(isLight ? "text-slate-600" : "text-slate-300")}>Instant Server Verification</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-400">
                <CheckCircle2 className="h-4 w-4 text-[#16A34A]" />
                <span className={cn(isLight ? "text-slate-600" : "text-slate-300")}>Official PDF Cut-offs</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-400">
                <CheckCircle2 className="h-4 w-4 text-[#16A34A]" />
                <span className={cn(isLight ? "text-slate-600" : "text-slate-300")}>Zero Paywalls / Free Access</span>
              </div>
            </div>
          </div>

          {/* ========================================================
              RIGHT COLUMN: Animated Official Document Visual System
              (Replaces cartoon character with exam result/admit visual)
              ======================================================== */}
          <div className="lg:col-span-5 w-full mt-4 lg:mt-0">
            <HeroDocumentVisual theme={theme} />
          </div>

        </div>
      </div>
    </section>
  );
}
