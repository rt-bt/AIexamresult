"use client";

import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import {
  Radio,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Volume1,
  Search,
  Heart,
  Sparkles,
  RefreshCw,
  Music,
  Share2,
  SlidersHorizontal,
  X,
  ChevronDown,
  RadioTower,
  Headphones,
} from "lucide-react";
import {
  radioStations,
  type RadioStation,
  TOP_FEATURED_SLUGS,
  GENRE_PRESETS,
  matchGenrePreset,
} from "@/lib/radio";
import { cn } from "@/lib/utils";

const ALL_LANGUAGES = [
  "All",
  "Hindi",
  "Punjabi",
  "Tamil",
  "Telugu",
  "Marathi",
  "Gujarati",
  "Bengali",
  "Malayalam",
  "Kannada",
  "Odia",
  "Assamese",
  "Urdu",
  "English",
];

export function RadioClient() {
  const [currentStation, setCurrentStation] = useState<RadioStation | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [volume, setVolume] = useState(0.85);
  const [isMuted, setIsMuted] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPreset, setSelectedPreset] = useState("all");
  const [selectedLanguage, setSelectedLanguage] = useState("All");
  const [favorites, setFavorites] = useState<string[]>([]);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const hlsRef = useRef<any>(null);
  const isUsingFallbackRef = useRef<boolean>(false);

  // Preload HLS.js on client mount for instant live playback
  useEffect(() => {
    if (typeof window !== "undefined" && !(window as any).Hls) {
      const script = document.createElement("script");
      script.src = "https://cdn.jsdelivr.net/npm/hls.js@1.5.8/dist/hls.min.js";
      script.async = true;
      document.head.appendChild(script);
    }
  }, []);

  // Load saved favorites & volume from localStorage
  useEffect(() => {
    try {
      const savedFavs = localStorage.getItem("aier_radio_favorites");
      if (savedFavs) {
        setFavorites(JSON.parse(savedFavs));
      }
      const savedVol = localStorage.getItem("aier_radio_volume");
      if (savedVol) {
        const v = parseFloat(savedVol);
        if (!isNaN(v) && v >= 0 && v <= 1) {
          setVolume(v);
        }
      }
    } catch {}
  }, []);

  const toggleFavorite = useCallback((slug: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setFavorites((prev) => {
      const next = prev.includes(slug) ? prev.filter((id) => id !== slug) : [...prev, slug];
      try {
        localStorage.setItem("aier_radio_favorites", JSON.stringify(next));
      } catch {}
      return next;
    });
  }, []);

  // Teardown HLS on unmount
  useEffect(() => {
    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
  }, []);

  // Update volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
      try {
        (audioRef.current as any).referrerPolicy = "no-referrer";
      } catch {}
    }
  }, [volume, isMuted]);

  // Audio stream loader helper supporting secondary fallback stream URLs
  const loadAndPlayStream = useCallback(
    (station: RadioStation, targetUrl: string, isFallback: boolean = false) => {
      if (!audioRef.current) return;
      const audio = audioRef.current;

      setIsLoading(true);
      setHasError(false);

      // Teardown existing HLS instance
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }

      const isHls = targetUrl.includes(".m3u8");

      const handleStreamError = () => {
        if (!isFallback && station.fallbackStreamUrl) {
          isUsingFallbackRef.current = true;
          loadAndPlayStream(station, station.fallbackStreamUrl, true);
        } else {
          setIsLoading(false);
          setIsPlaying(false);
          setHasError(true);
        }
      };

      // Safari native HLS support check
      if (isHls && !audio.canPlayType("application/vnd.apple.mpegurl")) {
        const initHls = (HlsClass: any) => {
          if (HlsClass.isSupported()) {
            const hls = new HlsClass({
              enableWorker: true,
              lowLatencyMode: true,
              backBufferLength: 60,
            });
            hls.loadSource(targetUrl);
            hls.attachMedia(audio);
            hls.on(HlsClass.Events.MANIFEST_PARSED, () => {
              audio
                .play()
                .then(() => {
                  setIsPlaying(true);
                  setIsLoading(false);
                  setHasError(false);
                })
                .catch(handleStreamError);
            });
            hls.on(HlsClass.Events.ERROR, (_: any, data: any) => {
              if (data.fatal) {
                switch (data.type) {
                  case HlsClass.ErrorTypes.NETWORK_ERROR:
                    hls.startLoad();
                    break;
                  case HlsClass.ErrorTypes.MEDIA_ERROR:
                    hls.recoverMediaError();
                    break;
                  default:
                    hls.destroy();
                    handleStreamError();
                    break;
                }
              }
            });
            hlsRef.current = hls;
          } else {
            audio.src = targetUrl;
            audio
              .play()
              .then(() => {
                setIsPlaying(true);
                setIsLoading(false);
                setHasError(false);
              })
              .catch(handleStreamError);
          }
        };

        if ((window as any).Hls) {
          initHls((window as any).Hls);
        } else {
          const script = document.createElement("script");
          script.src = "https://cdn.jsdelivr.net/npm/hls.js@1.5.8/dist/hls.min.js";
          script.async = true;
          script.onload = () => {
            if ((window as any).Hls) {
              initHls((window as any).Hls);
            } else {
              handleStreamError();
            }
          };
          script.onerror = handleStreamError;
          document.head.appendChild(script);
        }
      } else {
        audio.src = targetUrl;
        audio.load();
        audio
          .play()
          .then(() => {
            setIsPlaying(true);
            setIsLoading(false);
            setHasError(false);
          })
          .catch(handleStreamError);
      }
    },
    []
  );

  // Audio stream loader
  const playStation = useCallback(
    (station: RadioStation) => {
      if (!audioRef.current) return;
      const audio = audioRef.current;

      // If same station is already playing, toggle pause
      if (currentStation?.slug === station.slug) {
        if (isPlaying) {
          audio.pause();
          setIsPlaying(false);
        } else {
          setIsLoading(true);
          setHasError(false);
          audio
            .play()
            .then(() => {
              setIsPlaying(true);
              setIsLoading(false);
            })
            .catch(() => {
              // Try fallback or show error
              if (station.fallbackStreamUrl && !isUsingFallbackRef.current) {
                isUsingFallbackRef.current = true;
                loadAndPlayStream(station, station.fallbackStreamUrl, true);
              } else {
                setIsLoading(false);
                setHasError(true);
              }
            });
        }
        return;
      }

      // Switch to new station
      setCurrentStation(station);
      setIsPlaying(false);
      isUsingFallbackRef.current = false;
      loadAndPlayStream(station, station.streamUrl, false);
    },
    [currentStation, isPlaying, loadAndPlayStream]
  );

  const handleStop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }
    setIsPlaying(false);
    setCurrentStation(null);
  }, []);

  const handleShare = useCallback((station: RadioStation, e: React.MouseEvent) => {
    e.stopPropagation();
    const shareUrl = `${window.location.origin}/radio#${station.slug}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareUrl);
      setCopiedSlug(station.slug);
      setTimeout(() => setCopiedSlug(null), 2000);
    }
  }, []);

  // Filter stations
  const filteredStations = useMemo(() => {
    return radioStations.filter((station) => {
      // Favorites filter
      if (showFavoritesOnly && !favorites.includes(station.slug)) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = station.name.toLowerCase().includes(q);
        const matchesGenre = station.genre.toLowerCase().includes(q);
        const matchesFreq = station.frequency.toLowerCase().includes(q);
        const matchesLang = station.language.toLowerCase().includes(q);
        if (!matchesName && !matchesGenre && !matchesFreq && !matchesLang) {
          return false;
        }
      }
      // Genre preset
      if (!matchGenrePreset(station, selectedPreset)) {
        return false;
      }
      // Language
      if (selectedLanguage !== "All") {
        if (!station.language.toLowerCase().includes(selectedLanguage.toLowerCase())) {
          return false;
        }
      }
      return true;
    });
  }, [searchQuery, selectedPreset, selectedLanguage, showFavoritesOnly, favorites]);

  // Featured stations
  const featuredStations = useMemo(() => {
    return TOP_FEATURED_SLUGS.map((slug) =>
      radioStations.find((s) => s.slug === slug)
    ).filter(Boolean) as RadioStation[];
  }, []);

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#111111]">
      {/* Hidden Audio Engine */}
      <audio
        ref={audioRef}
        playsInline
        onWaiting={() => setIsLoading(true)}
        onPlaying={() => {
          setIsLoading(false);
          setIsPlaying(true);
          setHasError(false);
        }}
        onPause={() => setIsPlaying(false)}
        onError={() => {
          if (currentStation?.fallbackStreamUrl && !isUsingFallbackRef.current) {
            isUsingFallbackRef.current = true;
            loadAndPlayStream(currentStation, currentStation.fallbackStreamUrl, true);
          } else {
            setIsLoading(false);
            setIsPlaying(false);
            setHasError(true);
          }
        }}
        preload="none"
      />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#5B0111] via-[#48000D] to-[#300008] text-white py-12 md:py-16 shadow-lg border-b border-[#FFD84D]/20">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#FFD84D_1px,transparent_1px)] [background-size:16px_16px]" />
        
        <div className="container-page relative z-10 mx-auto px-4 sm:px-6">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-[#FFD84D]/15 border border-[#FFD84D]/40 px-3.5 py-1 text-xs sm:text-sm font-semibold text-[#FFD84D] mb-4 shadow-sm backdrop-blur-md">
              <RadioTower className="h-4 w-4 animate-pulse" />
              <span>Free Live Streaming • 90+ Indian Radio Channels</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black font-heading tracking-tight leading-tight text-white mb-3">
              All India <span className="text-[#FFD84D]">Live Radio</span> Stations
            </h1>

            <p className="text-white/80 text-sm sm:text-base md:text-lg leading-relaxed max-w-2xl mb-6">
              Listen to your favorite Indian FM channels online 24x7: Vividh Bharati, AIR FM Gold,
              Radio Mirchi 98.3, 92.7 Big FM, Red FM, Radio City, AIR Akashvani News, and regional
              stations with zero interruptions.
            </p>

            {/* Quick Stats Banner */}
            <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-white/90">
              <div className="flex items-center gap-1.5 bg-black/30 rounded-lg px-3 py-1.5 border border-white/10">
                <Radio className="h-4 w-4 text-[#FFD84D]" />
                <span className="font-bold text-white">93 Active Channels</span>
              </div>
              <div className="flex items-center gap-1.5 bg-black/30 rounded-lg px-3 py-1.5 border border-white/10">
                <Headphones className="h-4 w-4 text-[#FF5B3E]" />
                <span>Crystal-Clear Audio</span>
              </div>
              <div className="flex items-center gap-1.5 bg-black/30 rounded-lg px-3 py-1.5 border border-white/10">
                <Sparkles className="h-4 w-4 text-[#FFD84D]" />
                <span>100% Free & Unlimited</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Stations Section */}
      <section className="container-page mx-auto px-4 sm:px-6 py-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-[#FF5B3E]" />
            <h2 className="text-lg sm:text-xl font-bold font-heading text-[#111111]">
              Top Popular Stations in India
            </h2>
          </div>
          <span className="text-xs text-stone-500 font-medium">Most Listened</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {featuredStations.slice(0, 12).map((station) => {
            const isCurrent = currentStation?.slug === station.slug;
            const isCurrentPlaying = isCurrent && isPlaying;
            return (
              <button
                key={station.slug}
                onClick={() => playStation(station)}
                className={cn(
                  "group relative flex flex-col items-center text-center p-3 rounded-xl border transition-all duration-200 bg-white hover:shadow-md",
                  isCurrent
                    ? "border-[#5B0111] bg-amber-50/60 ring-2 ring-[#FFD84D] shadow-md"
                    : "border-stone-200 hover:border-stone-300"
                )}
              >
                <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full overflow-hidden mb-2 bg-stone-100 flex items-center justify-center border border-stone-200 shadow-inner">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={station.logo}
                    alt={station.name}
                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                    onError={(e) => {
                      (e.currentTarget as HTMLElement).style.display = "none";
                    }}
                  />
                  <div
                    className={cn(
                      "absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity",
                      isCurrentPlaying ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                    )}
                  >
                    {isCurrentPlaying ? (
                      <div className="flex items-end gap-0.5 h-4">
                        <span className="w-1 bg-[#FFD84D] animate-[bounce_0.6s_ease-in-out_infinite] h-full" />
                        <span className="w-1 bg-[#FFD84D] animate-[bounce_0.8s_ease-in-out_infinite] h-3" />
                        <span className="w-1 bg-[#FFD84D] animate-[bounce_0.5s_ease-in-out_infinite] h-full" />
                      </div>
                    ) : (
                      <Play className="h-6 w-6 text-white fill-white" />
                    )}
                  </div>
                </div>

                <span className="text-xs sm:text-[13px] font-bold line-clamp-1 text-stone-900 group-hover:text-[#5B0111]">
                  {station.name}
                </span>
                <span className="text-[11px] text-stone-500 font-medium line-clamp-1">
                  {station.frequency || station.language}
                </span>

                {isCurrent && (
                  <span className="mt-1 text-[10px] font-bold uppercase tracking-wider text-[#5B0111] bg-[#FFD84D]/40 px-2 py-0.5 rounded-full">
                    {isCurrentPlaying ? "Now Playing" : "Paused"}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </section>

      {/* Main Filter & Browser Section */}
      <section className="container-page mx-auto px-4 sm:px-6 pb-28">
        <div className="bg-white rounded-2xl border border-stone-200/80 shadow-sm p-4 sm:p-6 mb-6">
          {/* Top Search & Filter Bar */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3 mb-5">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search station name, frequency, Hindi, Punjabi, AIR..."
                className="w-full rounded-xl border border-stone-200 bg-stone-50/70 pl-10 pr-9 py-2.5 text-sm text-stone-900 placeholder:text-stone-400 focus:bg-white focus:border-[#5B0111] focus:ring-1 focus:ring-[#5B0111] transition-all outline-none"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Language Dropdown */}
            <div className="flex items-center gap-2">
              <div className="relative">
                <select
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                  className="appearance-none rounded-xl border border-stone-200 bg-stone-50/80 px-4 py-2.5 pr-8 text-xs sm:text-sm font-semibold text-stone-800 hover:bg-stone-100 focus:border-[#5B0111] outline-none cursor-pointer"
                >
                  {ALL_LANGUAGES.map((lang) => (
                    <option key={lang} value={lang}>
                      {lang === "All" ? "🌐 All Languages" : `${lang}`}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
              </div>

              {/* Favorites Button */}
              <button
                onClick={() => setShowFavoritesOnly((prev) => !prev)}
                className={cn(
                  "flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm font-semibold transition-all",
                  showFavoritesOnly
                    ? "bg-rose-50 border-rose-300 text-rose-600 shadow-sm"
                    : "border-stone-200 bg-stone-50/80 text-stone-700 hover:bg-stone-100"
                )}
              >
                <Heart
                  className={cn(
                    "h-4 w-4",
                    showFavoritesOnly ? "fill-rose-500 text-rose-500" : "text-stone-500"
                  )}
                />
                <span className="hidden sm:inline">Favorites</span>
                {favorites.length > 0 && (
                  <span className="ml-0.5 rounded-full bg-rose-200/80 text-rose-800 text-[11px] px-1.5 font-bold">
                    {favorites.length}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Genre Category Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {GENRE_PRESETS.map((preset) => (
              <button
                key={preset.id}
                onClick={() => setSelectedPreset(preset.id)}
                className={cn(
                  "shrink-0 rounded-full px-3.5 py-1.5 text-xs sm:text-sm font-semibold transition-all",
                  selectedPreset === preset.id
                    ? "bg-[#5B0111] text-white shadow-sm"
                    : "bg-stone-100 text-stone-700 hover:bg-stone-200/80"
                )}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        {/* Results Count & Current Filter Info */}
        <div className="flex items-center justify-between mb-4 px-1">
          <p className="text-xs sm:text-sm text-stone-600 font-medium">
            Showing <strong className="text-stone-900">{filteredStations.length}</strong> stations
            {selectedPreset !== "all" && ` in ${GENRE_PRESETS.find((p) => p.id === selectedPreset)?.label}`}
            {selectedLanguage !== "All" && ` • ${selectedLanguage}`}
            {showFavoritesOnly && ` • My Favorites`}
          </p>

          {(selectedPreset !== "all" || selectedLanguage !== "All" || searchQuery || showFavoritesOnly) && (
            <button
              onClick={() => {
                setSelectedPreset("all");
                setSelectedLanguage("All");
                setSearchQuery("");
                setShowFavoritesOnly(false);
              }}
              className="text-xs font-semibold text-[#5B0111] hover:underline"
            >
              Reset Filters
            </button>
          )}
        </div>

        {/* Stations Grid */}
        {filteredStations.length === 0 ? (
          <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center">
            <Radio className="h-12 w-12 text-stone-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-stone-800 mb-1">No radio stations found</h3>
            <p className="text-sm text-stone-500 max-w-sm mx-auto mb-4">
              Try searching with another keyword or resetting the category and language filters.
            </p>
            <button
              onClick={() => {
                setSelectedPreset("all");
                setSelectedLanguage("All");
                setSearchQuery("");
                setShowFavoritesOnly(false);
              }}
              className="inline-flex items-center gap-2 rounded-xl bg-[#5B0111] px-4 py-2 text-xs font-bold text-white hover:bg-[#48000d]"
            >
              <RefreshCw className="h-3.5 w-3.5" /> Show All 93 Stations
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredStations.map((station) => {
              const isCurrent = currentStation?.slug === station.slug;
              const isCurrentPlaying = isCurrent && isPlaying;
              const isFav = favorites.includes(station.slug);

              return (
                <div
                  key={station.slug}
                  onClick={() => playStation(station)}
                  className={cn(
                    "group relative flex items-center gap-3.5 p-3.5 rounded-2xl border bg-white transition-all duration-200 cursor-pointer hover:shadow-md",
                    isCurrent
                      ? "border-[#5B0111] ring-2 ring-[#FFD84D]/70 bg-amber-50/40 shadow-sm"
                      : "border-stone-200/80 hover:border-stone-300"
                  )}
                >
                  {/* Station Logo / Artwork */}
                  <div className="relative w-14 h-14 shrink-0 rounded-xl overflow-hidden bg-stone-100 border border-stone-200/80 flex items-center justify-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={station.logo}
                      alt={station.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.currentTarget as HTMLElement).style.display = "none";
                      }}
                    />
                    <div
                      className={cn(
                        "absolute inset-0 bg-black/45 flex items-center justify-center transition-opacity",
                        isCurrentPlaying ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                      )}
                    >
                      {isCurrentPlaying ? (
                        <div className="flex items-end gap-0.5 h-4">
                          <span className="w-1 bg-[#FFD84D] animate-[bounce_0.6s_ease-in-out_infinite] h-full" />
                          <span className="w-1 bg-[#FFD84D] animate-[bounce_0.8s_ease-in-out_infinite] h-3" />
                          <span className="w-1 bg-[#FFD84D] animate-[bounce_0.5s_ease-in-out_infinite] h-full" />
                        </div>
                      ) : (
                        <Play className="h-6 w-6 text-white fill-white ml-0.5" />
                      )}
                    </div>
                  </div>

                  {/* Station Info */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="rounded bg-[#5B0111]/10 text-[#5B0111] px-1.5 py-0.5 text-[10px] font-bold">
                        {station.frequency}
                      </span>
                      {station.rating > 0 && station.rating <= 20 && (
                        <span className="text-[10px] font-semibold text-amber-600 bg-amber-100/70 px-1.5 py-0.5 rounded">
                          ★ Top #{station.rating}
                        </span>
                      )}
                    </div>

                    <h3 className="text-sm font-bold text-stone-900 group-hover:text-[#5B0111] truncate">
                      {station.name}
                    </h3>

                    <p className="text-[11px] text-stone-500 truncate">
                      {station.genre}
                    </p>

                    <div className="flex items-center gap-1 mt-1 text-[11px] text-stone-600">
                      <span>{station.language}</span>
                    </div>
                  </div>

                  {/* Actions (Favorite & Share) */}
                  <div className="flex flex-col items-center gap-1.5 pl-1 shrink-0">
                    <button
                      onClick={(e) => toggleFavorite(station.slug, e)}
                      title={isFav ? "Remove from favorites" : "Add to favorites"}
                      className="p-1.5 rounded-lg text-stone-400 hover:text-rose-500 hover:bg-rose-50 transition-colors"
                    >
                      <Heart
                        className={cn("h-4 w-4", isFav && "fill-rose-500 text-rose-500")}
                      />
                    </button>
                    <button
                      onClick={(e) => handleShare(station, e)}
                      title="Share station link"
                      className="p-1.5 rounded-lg text-stone-400 hover:text-[#5B0111] hover:bg-stone-100 transition-colors"
                    >
                      <Share2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Floating Bottom Live Player Bar */}
      {currentStation && (
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#FFD84D] shadow-[0_-8px_30px_rgba(0,0,0,0.15)] pb-safe transition-transform duration-300">
          <div className="container-page mx-auto px-4 py-2.5 sm:py-3 flex items-center justify-between gap-3">
            {/* Station Artwork & Meta */}
            <div className="flex items-center gap-3 min-w-0 flex-1 sm:flex-initial">
              <div className="relative w-11 h-11 sm:w-12 sm:h-12 shrink-0 rounded-xl overflow-hidden bg-stone-100 border border-stone-200 shadow-sm">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={currentStation.logo}
                  alt={currentStation.name}
                  className="w-full h-full object-cover"
                />
                {isPlaying && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <div className="flex items-end gap-0.5 h-4">
                      <span className="w-1 bg-[#FFD84D] animate-[bounce_0.6s_ease-in-out_infinite] h-full" />
                      <span className="w-1 bg-[#FFD84D] animate-[bounce_0.8s_ease-in-out_infinite] h-3" />
                      <span className="w-1 bg-[#FFD84D] animate-[bounce_0.5s_ease-in-out_infinite] h-full" />
                    </div>
                  </div>
                )}
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-rose-600">
                    <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping inline-block" />
                    LIVE
                  </span>
                  <span className="text-[11px] font-semibold text-stone-500 hidden sm:inline">
                    • {currentStation.frequency}
                  </span>
                </div>
                <p className="text-xs sm:text-sm font-bold text-stone-900 truncate">
                  {currentStation.name}
                </p>
                <p className="text-[11px] text-stone-500 truncate hidden xs:block">
                  {isLoading
                    ? "Connecting to live stream..."
                    : hasError
                    ? "Stream temporarily reconnecting..."
                    : `${currentStation.genre} (${currentStation.language})`}
                </p>
              </div>
            </div>

            {/* Central Controls */}
            <div className="flex items-center gap-2 sm:gap-3">
              {hasError ? (
                <button
                  onClick={() => playStation(currentStation)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-rose-600 text-white text-xs font-bold shadow-md hover:bg-rose-700 active:scale-95 transition"
                >
                  <RefreshCw className="h-3.5 w-3.5 animate-spin" /> Retry
                </button>
              ) : (
                <button
                  onClick={() => playStation(currentStation)}
                  disabled={isLoading}
                  className={cn(
                    "flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 rounded-full shadow-lg active:scale-95 transition-all",
                    isPlaying
                      ? "bg-[#5B0111] text-[#FFD84D] hover:bg-[#45000c]"
                      : "bg-[#FF5B3E] text-white hover:bg-[#e0482c]"
                  )}
                  aria-label={isPlaying ? "Pause Radio" : "Play Radio"}
                >
                  {isLoading ? (
                    <RefreshCw className="h-5 w-5 animate-spin text-white" />
                  ) : isPlaying ? (
                    <Pause className="h-5 w-5 fill-current" />
                  ) : (
                    <Play className="h-5 w-5 fill-current ml-0.5" />
                  )}
                </button>
              )}

              {/* Favorite Button */}
              <button
                onClick={(e) => toggleFavorite(currentStation.slug, e)}
                className="p-2 text-stone-500 hover:text-rose-500 transition-colors hidden sm:inline-flex"
                title="Favorite this station"
              >
                <Heart
                  className={cn(
                    "h-5 w-5",
                    favorites.includes(currentStation.slug) && "fill-rose-500 text-rose-500"
                  )}
                />
              </button>
            </div>

            {/* Volume & Close Controls */}
            <div className="flex items-center gap-3">
              <div className="hidden md:flex items-center gap-2">
                <button
                  onClick={() => setIsMuted((prev) => !prev)}
                  className="text-stone-500 hover:text-stone-900 transition-colors"
                >
                  {isMuted || volume === 0 ? (
                    <VolumeX className="h-4.5 w-4.5 text-rose-500" />
                  ) : volume < 0.5 ? (
                    <Volume1 className="h-4.5 w-4.5" />
                  ) : (
                    <Volume2 className="h-4.5 w-4.5" />
                  )}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={isMuted ? 0 : volume}
                  onChange={(e) => {
                    const v = parseFloat(e.target.value);
                    setVolume(v);
                    setIsMuted(false);
                    try {
                      localStorage.setItem("aier_radio_volume", v.toString());
                    } catch {}
                  }}
                  className="w-20 h-1.5 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-[#5B0111]"
                />
              </div>

              <button
                onClick={handleStop}
                className="p-2 text-stone-400 hover:text-stone-800 hover:bg-stone-100 rounded-full transition-colors"
                title="Stop & Close Player"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {copiedSlug && (
        <div className="fixed top-20 right-5 z-50 rounded-xl bg-stone-900 text-white px-4 py-2.5 text-xs font-semibold shadow-xl flex items-center gap-2">
          <Share2 className="h-4 w-4 text-[#FFD84D]" />
          Station link copied to clipboard!
        </div>
      )}
    </div>
  );
}
