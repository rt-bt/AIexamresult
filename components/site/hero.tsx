"use client";

import { useState, useEffect, useRef } from "react";
import { Search, ArrowRight, ShieldCheck, FileText, CheckCircle2, Download } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { VoiceSearchBtn } from "./voice-search";

/**
 * Mux HLS Video Background with HLS.js streaming and Safari m3u8 native fallback
 * URL: https://stream.mux.com/T6oQJQ02cQ6N01TR6iHwZkKFkbepS34dkkIc9iukgy400g.m3u8
 * Poster fallback: https://images.unsplash.com/photo-1647356191320-d7a1f80ca777
 */
function HeroMuxVideoBackground() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let hlsInstance: any = null;
    const videoSrc = "https://stream.mux.com/T6oQJQ02cQ6N01TR6iHwZkKFkbepS34dkkIc9iukgy400g.m3u8";

    // Dynamically load HLS.js for client-side streaming
    import("hls.js").then(({ default: Hls }) => {
      if (Hls.isSupported()) {
        hlsInstance = new Hls({
          enableWorker: true,
          lowLatencyMode: true,
        });
        hlsInstance.loadSource(videoSrc);
        hlsInstance.attachMedia(video);
        hlsInstance.on(Hls.Events.MANIFEST_PARSED, () => {
          video.play().catch(() => {});
        });
      } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = videoSrc;
        video.addEventListener("loadedmetadata", () => {
          video.play().catch(() => {});
        });
      }
    });

    return () => {
      if (hlsInstance) {
        hlsInstance.destroy();
      }
    };
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {/* Video element streaming MUX m3u8 */}
      <video
        ref={videoRef}
        poster="https://images.unsplash.com/photo-1647356191320-d7a1f80ca777?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhYnN0cmFjdCUyMGRhcmslMjB0ZWNobm9sb2d5JTIwbmV1cmFsJTIwbmV0d29ya3xlbnwxfHx8fDE3Njg5NzIyNTV8MA&ixlib=rb-4.1.0&q=80&w=1080"
        playsInline
        muted
        autoPlay
        loop
        preload="auto"
        className="absolute inset-0 h-full w-full object-cover opacity-75"
      />

      {/* Video Overlay with minimal blur to preserve clarity */}
      <div
        className="absolute inset-0 bg-black/45 backdrop-blur-[1px] pointer-events-none"
        aria-hidden="true"
      />

      {/* Decorative Gradients: top-left & bottom-right */}
      <div
        className="absolute -top-[20%] left-[20%] h-[600px] w-[600px] rounded-full bg-blue-900/25 blur-[120px] mix-blend-screen pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute -bottom-[10%] right-[20%] h-[500px] w-[500px] rounded-full bg-indigo-900/25 blur-[120px] mix-blend-screen pointer-events-none"
        aria-hidden="true"
      />
    </div>
  );
}

export function Hero() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    } else {
      router.push("/results");
    }
  }

  return (
    <section className="relative min-h-[620px] lg:min-h-[700px] w-full overflow-hidden bg-[#000000] text-white font-sans border-b border-white/15">
      {/* 1. MUX HLS Video Background with Decorative Gradients */}
      <HeroMuxVideoBackground />

      {/* 2. Main Hero Content Layer at z-10 */}
      <div className="relative z-10 container-page flex flex-col justify-between pt-12 pb-14 sm:pt-16 sm:pb-16 lg:pt-20 lg:pb-20">
        
        {/* Top & Middle Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-end">
          
          {/* Left Column: Pre-headline, Heading, Description, Pill CTA, Capsule Search */}
          <div className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left">
            
            {/* Pre-headline: Instrument Serif pill */}
            <div className="inline-flex items-center gap-2 mb-4 px-3.5 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20">
              <span className="h-1.5 w-1.5 rounded-full bg-[#3054ff]" aria-hidden="true" />
              <span className="text-xs sm:text-[13px] font-medium tracking-wide text-white" style={{ fontFamily: "'Instrument Serif', serif" }}>
                Design at the speed of thought · Latest Exam Updates
              </span>
            </div>

            {/* Main Headline with gradient text */}
            <h1 className="text-4xl sm:text-6xl lg:text-[64px] font-semibold tracking-tighter leading-[1.05] mb-5 font-heading animate-fade-rise">
              <span className="bg-gradient-to-b from-white via-white to-[#b4c0ff] bg-clip-text text-transparent">
                Exam results,
              </span>
              <br />
              <span className="text-[#F28A2E] drop-shadow-[0_2px_14px_rgba(242,138,46,0.4)]">
                finally made simple.
              </span>
            </h1>

            {/* Subheadline / Description */}
            <p className="text-base sm:text-lg text-white/80 max-w-xl mb-8 leading-[1.65] font-normal animate-fade-rise-delay drop-shadow-md">
              Get the latest government exam results, admit cards, answer keys and job notifications in one place.
            </p>

            {/* CTAs: Primary White Pill with Blue Arrow Circle + Secondary Link */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-8 w-full sm:w-auto animate-fade-rise-delay-2">
              <Link
                href="/results"
                className="group inline-flex items-center justify-between gap-4 pl-6 pr-2 py-2 rounded-full bg-white hover:scale-105 transition-all duration-200 shadow-[0_0_25px_rgba(255,255,255,0.25)] text-[#0a0400]"
              >
                <span className="text-sm sm:text-base font-semibold">Check Latest Results</span>
                <span className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-[#3054ff] group-hover:bg-[#2040e0] text-white transition-colors">
                  <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
                </span>
              </Link>
              
              <Link
                href="/latest-jobs"
                className="group inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm sm:text-base font-medium text-white/80 hover:text-white backdrop-blur-sm hover:bg-white/10 transition-all"
              >
                <span>Browse Latest Jobs</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>

            {/* Capsule Search Field */}
            <form
              onSubmit={handleSearch}
              className="w-full sm:max-w-md animate-fade-rise-delay-2"
            >
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center rounded-2xl sm:rounded-full bg-white/95 p-1.5 shadow-2xl backdrop-blur-md border border-white/40 gap-2 sm:gap-0">
                <div className="relative flex-1 flex items-center pl-3">
                  <Search className="h-4 w-4 text-gray-400 shrink-0 pointer-events-none" />
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search exam or job"
                    aria-label="Search exam or job"
                    className="w-full bg-transparent pl-2.5 pr-2 py-2 text-sm font-medium text-gray-900 placeholder-gray-400 outline-none"
                  />
                  <VoiceSearchBtn
                    onResult={(val) => {
                      setQuery(val);
                      router.push(`/search?q=${encodeURIComponent(val)}`);
                    }}
                    className="p-1 text-gray-400 hover:text-gray-700 transition mr-1"
                  />
                </div>
                <button
                  type="submit"
                  className="rounded-full px-6 py-2.5 text-xs font-semibold text-white transition-all bg-[#3054ff] hover:bg-[#2040e0] shadow-md shrink-0"
                >
                  Search
                </button>
              </div>
            </form>

          </div>

          {/* Right Column: Glass Cards */}
          <div className="hidden lg:flex lg:col-span-5 justify-end">
            <div className="flex flex-col gap-4 sm:flex-row lg:flex-col w-full max-w-sm">
              
              {/* Glass Card 1: Stats Card */}
              <div className="rounded-2xl bg-white/10 backdrop-blur-lg border border-white/20 p-5 shadow-2xl flex flex-col justify-between">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-silkscreen text-3xl font-normal tracking-tight text-white">
                    42,500+
                  </span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-[10px] font-bold text-emerald-300 uppercase tracking-wider">
                    <CheckCircle2 className="h-3 w-3" />
                    LIVE
                  </span>
                </div>
                <p className="text-sm leading-relaxed text-white/80 font-normal">
                  Aspirants check verified government exam results, cutoffs and admit cards daily.
                </p>
              </div>

              {/* Glass Card 2: Official Notice Bulletin Card */}
              <div className="rounded-2xl bg-white/10 backdrop-blur-lg border border-white/20 p-5 shadow-2xl">
                {/* Header Row */}
                <div className="flex items-center gap-2.5 mb-3">
                  <div className="h-6 w-6 rounded-md bg-[#3054ff] flex items-center justify-center text-white text-xs font-bold shadow-sm">
                    S
                  </div>
                  <span className="text-sm font-semibold text-white">
                    Staff Selection Commission
                  </span>
                </div>

                {/* Notice text */}
                <p className="text-xs sm:text-[13px] leading-relaxed text-white/85 mb-4">
                  "SSC CGL 2026 Tier-I official merit list &amp; category-wise cutoff marks published."
                </p>

                {/* Footer Link */}
                <Link
                  href="/results"
                  className="flex items-center justify-between pt-3 border-t border-white/15 text-xs font-semibold text-white hover:text-[#b4c0ff] transition-colors"
                >
                  <span>Download Merit List PDF</span>
                  <Download className="h-3.5 w-3.5 text-[#3054ff]" />
                </Link>
              </div>

            </div>
          </div>

        </div>

      </div>

      {/* 3. Small Stats Section at the Bottom of the Hero (Glass Strip) */}
      <div className="relative z-10 border-t border-white/15 bg-black/50 backdrop-blur-md">
        <div className="container-page py-5 sm:py-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 text-center">
            
            {/* Stat 1: 500+ Exam Updates */}
            <div className="flex flex-col items-center justify-center lg:border-r lg:border-white/15 lg:last:border-r-0">
              <span className="font-silkscreen text-2xl sm:text-3xl font-normal text-white tracking-tight">
                500+
              </span>
              <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.16em] text-white/70 mt-1">
                Exam Updates
              </span>
            </div>

            {/* Stat 2: 100% Verified Links */}
            <div className="flex flex-col items-center justify-center lg:border-r lg:border-white/15 lg:last:border-r-0">
              <span className="font-silkscreen text-2xl sm:text-3xl font-normal text-[#F28A2E] tracking-tight">
                100%
              </span>
              <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.16em] text-white/70 mt-1">
                Verified Links
              </span>
            </div>

            {/* Stat 3: All India Coverage */}
            <div className="flex flex-col items-center justify-center lg:border-r lg:border-white/15 lg:last:border-r-0">
              <span className="font-silkscreen text-2xl sm:text-3xl font-normal text-white tracking-tight">
                PAN-IN
              </span>
              <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.16em] text-white/70 mt-1">
                All India Coverage
              </span>
            </div>

            {/* Stat 4: Daily Notifications */}
            <div className="flex flex-col items-center justify-center">
              <span className="font-silkscreen text-2xl sm:text-3xl font-normal text-white tracking-tight">
                DAILY
              </span>
              <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.16em] text-white/70 mt-1">
                Live Notifications
              </span>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
