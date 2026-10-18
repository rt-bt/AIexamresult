"use client";

import { useState, useEffect } from "react";
import { CheckCircle2, Download, FileText, ExternalLink, ShieldCheck, Clock, Award, Sparkles, Building2, Bell } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export type DocumentTab = "result" | "admit" | "key" | "job";

interface HeroDocumentVisualProps {
  theme?: "navy-saffron" | "navy-pro" | "light-portal";
}

export function HeroDocumentVisual({ theme = "navy-saffron" }: HeroDocumentVisualProps) {
  const [activeTab, setActiveTab] = useState<DocumentTab>("result");
  const [isHovered, setIsHovered] = useState(false);
  const [simulatedRoll, setSimulatedRoll] = useState("2201048921");
  const [isVerifying, setIsVerifying] = useState(false);

  // Auto rotate tabs gently every 6 seconds unless user is hovering
  useEffect(() => {
    if (isHovered) return;
    const tabs: DocumentTab[] = ["result", "admit", "job", "key"];
    const interval = setInterval(() => {
      setActiveTab((prev) => {
        const nextIdx = (tabs.indexOf(prev) + 1) % tabs.length;
        return tabs[nextIdx];
      });
    }, 6000);
    return () => clearInterval(interval);
  }, [isHovered]);

  const handleSimulateCheck = () => {
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
    }, 600);
  };

  const isLight = theme === "light-portal";
  const isNavyPro = theme === "navy-pro";

  return (
    <div
      className="relative w-full max-w-xl mx-auto lg:max-w-none select-none"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      role="region"
      aria-label="Official Government Exam Document Visual System"
    >
      {/* Ambient background glow behind documents (lightweight, GPU friendly) */}
      <div
        className={cn(
          "absolute -inset-4 rounded-3xl opacity-60 blur-2xl pointer-events-none transition-all duration-700",
          isLight
            ? "bg-gradient-to-tr from-blue-100 via-amber-50 to-emerald-50"
            : isNavyPro
            ? "bg-gradient-to-tr from-[#123B6D]/40 via-[#1D5FA7]/20 to-emerald-500/10"
            : "bg-gradient-to-tr from-[#F59E0B]/20 via-[#1D5FA7]/30 to-[#16A34A]/20"
        )}
        aria-hidden="true"
      />

      {/* Floating Pill: Live Sync Timestamp (Top Left) */}
      <div
        className={cn(
          "hidden sm:flex absolute -top-4 -left-3 z-30 items-center gap-2 px-3 py-1.5 rounded-full border shadow-lg text-[11px] font-semibold backdrop-blur-md animate-[bounce_4s_infinite]",
          isLight
            ? "bg-white/95 border-slate-200 text-[#172033]"
            : "bg-[#0b2342]/90 border-white/20 text-white shadow-[#0b2342]/50"
        )}
      >
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#16A34A] opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-[#16A34A]" />
        </span>
        <span className="tracking-wide">NIC/Govt Server 1 · Live Sync</span>
      </div>

      {/* Floating Pill: Verified Checkmark (Top Right) */}
      <div
        className={cn(
          "hidden sm:flex absolute -top-3 -right-2 z-30 items-center gap-1.5 px-3 py-1.5 rounded-full border shadow-lg text-[11px] font-bold backdrop-blur-md",
          isLight
            ? "bg-emerald-50 border-emerald-300 text-emerald-800"
            : "bg-emerald-950/80 border-emerald-500/40 text-emerald-300"
        )}
      >
        <ShieldCheck className="h-3.5 w-3.5 text-[#16A34A]" />
        <span>100% Verified Updates</span>
      </div>

      {/* Main Document Showcase Container */}
      <div
        className={cn(
          "relative z-20 rounded-2xl border p-4 sm:p-5 transition-all duration-300 shadow-2xl",
          isLight
            ? "bg-white/90 border-slate-200 shadow-slate-300/60"
            : isNavyPro
            ? "bg-[#0d284b]/85 border-white/20 shadow-black/40 backdrop-blur-xl"
            : "bg-[#0e2a4e]/90 border-white/20 shadow-black/50 backdrop-blur-xl"
        )}
      >
        {/* Document Selection Interactive Tabs */}
        <div className="flex items-center justify-between gap-1 p-1 rounded-xl bg-black/10 dark:bg-black/30 border border-black/5 dark:border-white/10 mb-4 overflow-x-auto no-scrollbar">
          <button
            type="button"
            onClick={() => setActiveTab("result")}
            className={cn(
              "flex-1 min-w-[90px] py-2 px-2.5 rounded-lg text-xs font-bold transition-all duration-200 flex items-center justify-center gap-1.5",
              activeTab === "result"
                ? isLight
                  ? "bg-[#123B6D] text-white shadow-md"
                  : "bg-[#16A34A] text-white shadow-md shadow-[#16A34A]/30"
                : isLight
                ? "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                : "text-white/70 hover:text-white hover:bg-white/5"
            )}
          >
            <span className={cn("h-1.5 w-1.5 rounded-full", activeTab === "result" ? "bg-white animate-pulse" : "bg-[#16A34A]")} />
            <span>Result</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("admit")}
            className={cn(
              "flex-1 min-w-[90px] py-2 px-2.5 rounded-lg text-xs font-bold transition-all duration-200 flex items-center justify-center gap-1.5",
              activeTab === "admit"
                ? isLight
                  ? "bg-[#123B6D] text-white shadow-md"
                  : "bg-[#1D5FA7] text-white shadow-md shadow-[#1D5FA7]/30"
                : isLight
                ? "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                : "text-white/70 hover:text-white hover:bg-white/5"
            )}
          >
            <span className={cn("h-1.5 w-1.5 rounded-full", activeTab === "admit" ? "bg-white" : "bg-[#1D5FA7]")} />
            <span>Admit Card</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("job")}
            className={cn(
              "flex-1 min-w-[90px] py-2 px-2.5 rounded-lg text-xs font-bold transition-all duration-200 flex items-center justify-center gap-1.5",
              activeTab === "job"
                ? isLight
                  ? "bg-[#123B6D] text-white shadow-md"
                  : "bg-[#F59E0B] text-[#0f243d] shadow-md shadow-[#F59E0B]/30"
                : isLight
                ? "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                : "text-white/70 hover:text-white hover:bg-white/5"
            )}
          >
            <span className={cn("h-1.5 w-1.5 rounded-full", activeTab === "job" ? "bg-[#0f243d]" : "bg-[#F59E0B]")} />
            <span>Govt Job</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("key")}
            className={cn(
              "flex-1 min-w-[90px] py-2 px-2.5 rounded-lg text-xs font-bold transition-all duration-200 flex items-center justify-center gap-1.5",
              activeTab === "key"
                ? isLight
                  ? "bg-[#123B6D] text-white shadow-md"
                  : "bg-purple-600 text-white shadow-md"
                : isLight
                ? "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                : "text-white/70 hover:text-white hover:bg-white/5"
            )}
          >
            <span className={cn("h-1.5 w-1.5 rounded-full", activeTab === "key" ? "bg-white" : "bg-purple-400")} />
            <span>Answer Key</span>
          </button>
        </div>

        {/* ========================================================
            CARD 1: RESULT CARD (Primary Spotlight)
            ======================================================== */}
        {activeTab === "result" && (
          <div className="space-y-3.5 transition-all duration-300">
            {/* Header: Organization & Declared Status */}
            <div className="flex items-start justify-between gap-2 border-b border-black/10 dark:border-white/10 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#123B6D] text-white shadow-sm font-bold text-xs">
                  <Building2 className="h-5 w-5 text-[#F59E0B]" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] font-bold tracking-wider uppercase text-[#1D5FA7] dark:text-[#F59E0B]">
                      Staff Selection Commission
                    </span>
                    <span className="text-[10px] text-slate-400">· Govt of India</span>
                  </div>
                  <h3 className={cn("text-base sm:text-lg font-bold font-heading leading-tight", isLight ? "text-[#172033]" : "text-white")}>
                    SSC CGL 2025 Tier-I Final Result
                  </h3>
                </div>
              </div>

              {/* Green Result Declared Badge with Animated SVG Checkmark */}
              <div className="flex shrink-0 items-center gap-1.5 px-3 py-1 rounded-full bg-[#16A34A] text-white font-bold text-[11px] shadow-sm shadow-[#16A34A]/30">
                <svg className="h-3.5 w-3.5 animate-[spin_6s_linear_infinite]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <circle cx="12" cy="12" r="9" strokeOpacity="0.3" />
                  <path d="M12 3a9 9 0 0 1 9 9" />
                </svg>
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>Result Declared</span>
              </div>
            </div>

            {/* Candidate Result Simulation & Status Box */}
            <div
              className={cn(
                "rounded-xl p-3 border transition-colors",
                isLight ? "bg-slate-50 border-slate-200" : "bg-black/25 border-white/10"
              )}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                <div>
                  <span className="text-[11px] text-slate-400 uppercase tracking-wider block font-semibold">Sample Verification</span>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className={cn("font-mono font-bold text-sm tracking-wider", isLight ? "text-slate-800" : "text-white")}>
                      Roll: {simulatedRoll}
                    </span>
                    <button
                      type="button"
                      onClick={handleSimulateCheck}
                      className="text-[10px] underline text-[#1D5FA7] dark:text-[#F59E0B] font-semibold hover:opacity-80"
                    >
                      {isVerifying ? "Checking..." : "Re-check"}
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-[#16A34A]/15 border border-[#16A34A]/30 text-[#16A34A] font-bold text-xs">
                  <CheckCircle2 className="h-4 w-4 shrink-0" />
                  <span>QUALIFIED FOR TIER-II</span>
                </div>
              </div>

              {/* Cut-off & Score Metrics Grid */}
              <div className="grid grid-cols-4 gap-2 mt-2.5 pt-2.5 border-t border-black/5 dark:border-white/10 text-center">
                <div className="rounded-lg p-1.5 bg-black/5 dark:bg-white/5">
                  <p className="text-[10px] text-slate-400 font-medium">UR Cutoff</p>
                  <p className={cn("font-bold text-xs mt-0.5", isLight ? "text-slate-800" : "text-white")}>142.50</p>
                </div>
                <div className="rounded-lg p-1.5 bg-black/5 dark:bg-white/5">
                  <p className="text-[10px] text-slate-400 font-medium">OBC</p>
                  <p className={cn("font-bold text-xs mt-0.5", isLight ? "text-slate-800" : "text-white")}>138.00</p>
                </div>
                <div className="rounded-lg p-1.5 bg-black/5 dark:bg-white/5">
                  <p className="text-[10px] text-slate-400 font-medium">EWS</p>
                  <p className={cn("font-bold text-xs mt-0.5", isLight ? "text-slate-800" : "text-white")}>135.25</p>
                </div>
                <div className="rounded-lg p-1.5 bg-[#16A34A]/10 border border-[#16A34A]/20">
                  <p className="text-[10px] text-[#16A34A] font-bold">Marks</p>
                  <p className="font-bold text-xs mt-0.5 text-[#16A34A]">158.50</p>
                </div>
              </div>
            </div>

            {/* Direct Official Link & Download Bar */}
            <div className="flex items-center justify-between gap-3 pt-1">
              <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                <Clock className="h-3.5 w-3.5 text-[#F59E0B]" />
                <span>Declared today · 100% Official PDF</span>
              </div>

              <Link
                href="/results"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#16A34A] hover:bg-[#15803d] text-white font-bold text-xs shadow-md shadow-[#16A34A]/20 transition-transform active:scale-95"
              >
                <Download className="h-3.5 w-3.5" />
                <span>Download Merit List</span>
              </Link>
            </div>
          </div>
        )}

        {/* ========================================================
            CARD 2: ADMIT CARD
            ======================================================== */}
        {activeTab === "admit" && (
          <div className="space-y-3.5 transition-all duration-300">
            <div className="flex items-start justify-between gap-2 border-b border-black/10 dark:border-white/10 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#1D5FA7] text-white shadow-sm font-bold text-xs">
                  <FileText className="h-5 w-5" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] font-bold tracking-wider uppercase text-[#1D5FA7] dark:text-[#F59E0B]">
                      Railway Recruitment Boards
                    </span>
                    <span className="text-[10px] text-slate-400">· RRB Portal</span>
                  </div>
                  <h3 className={cn("text-base sm:text-lg font-bold font-heading leading-tight", isLight ? "text-[#172033]" : "text-white")}>
                    RRB NTPC CEN 01/2025 E-Call Letter
                  </h3>
                </div>
              </div>

              <div className="flex shrink-0 items-center gap-1.5 px-3 py-1 rounded-full bg-[#1D5FA7] text-white font-bold text-[11px] shadow-sm shadow-[#1D5FA7]/30">
                <Award className="h-3.5 w-3.5" />
                <span>Admit Card Live</span>
              </div>
            </div>

            <div
              className={cn(
                "rounded-xl p-3 border transition-colors",
                isLight ? "bg-slate-50 border-slate-200" : "bg-black/25 border-white/10"
              )}
            >
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 font-medium">Exam Date &amp; Shift</span>
                  <p className={cn("font-bold text-xs mt-0.5", isLight ? "text-slate-800" : "text-white")}>
                    Phase 1: CBT Examination
                  </p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-medium">City Intimation Slip</span>
                  <p className="font-bold text-xs mt-0.5 text-[#16A34A]">Available Online</p>
                </div>
              </div>

              <div className="mt-2.5 pt-2 border-t border-black/5 dark:border-white/10 flex items-center justify-between text-xs">
                <span className="text-slate-400 text-[11px]">Download using Reg. No &amp; DOB</span>
                <span className="font-mono font-bold text-[11px] text-[#1D5FA7] dark:text-[#F59E0B]">Active Server 1 &amp; 2</span>
              </div>
            </div>

            <div className="flex items-center justify-between gap-3 pt-1">
              <span className="text-[11px] text-slate-400">Direct Railway Board Link</span>
              <Link
                href="/admit-card"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#1D5FA7] hover:bg-[#174e8b] text-white font-bold text-xs shadow-md transition-transform active:scale-95"
              >
                <Download className="h-3.5 w-3.5" />
                <span>Download Admit Card</span>
              </Link>
            </div>
          </div>
        )}

        {/* ========================================================
            CARD 3: GOVERNMENT JOB NOTIFICATION
            ======================================================== */}
        {activeTab === "job" && (
          <div className="space-y-3.5 transition-all duration-300">
            <div className="flex items-start justify-between gap-2 border-b border-black/10 dark:border-white/10 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#F59E0B] text-[#0f243d] shadow-sm font-bold text-xs">
                  <Building2 className="h-5 w-5" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] font-bold tracking-wider uppercase text-[#1D5FA7] dark:text-[#F59E0B]">
                      Union Public Service Commission
                    </span>
                    <span className="text-[10px] text-slate-400">· UPSC 2026</span>
                  </div>
                  <h3 className={cn("text-base sm:text-lg font-bold font-heading leading-tight", isLight ? "text-[#172033]" : "text-white")}>
                    Civil Services (IAS / IFS) 2026
                  </h3>
                </div>
              </div>

              <div className="flex shrink-0 items-center gap-1.5 px-3 py-1 rounded-full bg-[#F59E0B] text-[#0f243d] font-bold text-[11px] shadow-sm shadow-[#F59E0B]/30">
                <Sparkles className="h-3.5 w-3.5" />
                <span>1,105 Vacancies</span>
              </div>
            </div>

            <div
              className={cn(
                "rounded-xl p-3 border transition-colors",
                isLight ? "bg-slate-50 border-slate-200" : "bg-black/25 border-white/10"
              )}
            >
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 font-medium">Total Posts</span>
                  <p className={cn("font-bold text-xs mt-0.5", isLight ? "text-slate-800" : "text-white")}>1,105 Posts</p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-medium">Qualification</span>
                  <p className={cn("font-bold text-xs mt-0.5", isLight ? "text-slate-800" : "text-white")}>Graduate</p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-medium">Status</span>
                  <p className="font-bold text-xs mt-0.5 text-[#16A34A]">Apply Online</p>
                </div>
              </div>

              <div className="mt-2.5 pt-2 border-t border-black/5 dark:border-white/10 flex items-center justify-between text-xs">
                <span className="text-slate-400 text-[11px]">Registration: One Time Registration (OTR)</span>
                <span className="font-semibold text-xs text-[#F59E0B]">Last Date: Active</span>
              </div>
            </div>

            <div className="flex items-center justify-between gap-3 pt-1">
              <span className="text-[11px] text-slate-400">All India Eligibility</span>
              <Link
                href="/latest-jobs"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#F59E0B] hover:bg-[#d98207] text-[#0f243d] font-bold text-xs shadow-md transition-transform active:scale-95"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                <span>Apply / View Notice</span>
              </Link>
            </div>
          </div>
        )}

        {/* ========================================================
            CARD 4: ANSWER KEY
            ======================================================== */}
        {activeTab === "key" && (
          <div className="space-y-3.5 transition-all duration-300">
            <div className="flex items-start justify-between gap-2 border-b border-black/10 dark:border-white/10 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-700 text-white shadow-sm font-bold text-xs">
                  <Award className="h-5 w-5" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] font-bold tracking-wider uppercase text-purple-400">
                      National Testing Agency (NTA)
                    </span>
                    <span className="text-[10px] text-slate-400">· Official Key</span>
                  </div>
                  <h3 className={cn("text-base sm:text-lg font-bold font-heading leading-tight", isLight ? "text-[#172033]" : "text-white")}>
                    NEET UG 2026 Provisional Key &amp; OMR
                  </h3>
                </div>
              </div>

              <div className="flex shrink-0 items-center gap-1.5 px-3 py-1 rounded-full bg-purple-600 text-white font-bold text-[11px] shadow-sm">
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>OMR Active</span>
              </div>
            </div>

            <div
              className={cn(
                "rounded-xl p-3 border transition-colors",
                isLight ? "bg-slate-50 border-slate-200" : "bg-black/25 border-white/10"
              )}
            >
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 font-medium">Question Paper Set</span>
                  <p className={cn("font-bold text-xs mt-0.5", isLight ? "text-slate-800" : "text-white")}>Codes Q, R, S, T</p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-medium">Objection Window</span>
                  <p className="font-bold text-xs mt-0.5 text-[#F59E0B]">Open for 48 Hours</p>
                </div>
              </div>

              <div className="mt-2.5 pt-2 border-t border-black/5 dark:border-white/10 flex items-center justify-between text-xs">
                <span className="text-slate-400 text-[11px]">Download Scanned OMR Response</span>
                <span className="font-semibold text-xs text-purple-400">Direct Link</span>
              </div>
            </div>

            <div className="flex items-center justify-between gap-3 pt-1">
              <span className="text-[11px] text-slate-400">Verify Answers with Master Key</span>
              <Link
                href="/answer-key"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md transition-transform active:scale-95"
              >
                <Download className="h-3.5 w-3.5" />
                <span>Check Answer Key</span>
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Stacked 3D Depth Card in Background (Creates Layered Government File / Document Stack Look) */}
      <div
        className={cn(
          "absolute -bottom-3 left-4 right-4 h-12 rounded-2xl border -z-10 transition-transform duration-300 opacity-60",
          isLight ? "bg-slate-100 border-slate-300 shadow-md" : "bg-[#091b33] border-white/10"
        )}
        aria-hidden="true"
      />
      <div
        className={cn(
          "absolute -bottom-6 left-8 right-8 h-10 rounded-2xl border -z-20 transition-transform duration-300 opacity-40",
          isLight ? "bg-slate-200 border-slate-300" : "bg-[#071529] border-white/5"
        )}
        aria-hidden="true"
      />
    </div>
  );
}
