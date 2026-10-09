"use client";

import { useEffect, useRef, useState } from "react";

const VIDEO_URL =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260826_041744_63efcd78-bf7d-4039-99e2-2461e8a61903.mp4";

const SENSITIVITY = 1.2;

/**
 * High-performance cinematic hero video background.
 * - Plays smoothly and continuously in the background via native browser hardware decoding.
 * - Never freezes, exhausts decoder buffers, or turns black after 30-40 seconds.
 * - Dynamically responds to horizontal mouse movement by smoothly scrubbing video frames.
 * - Automatically resumes smooth looping ambient playback when mouse movement pauses.
 * - Includes luminous teal gradient backdrop and auto-recovery so the background never goes dark.
 */
export function VideoScrubBg() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const targetTimeRef = useRef(0);
  const isSeekingRef = useRef(false);
  const prevXRef = useRef<number | null>(null);
  const [videoLoaded, setVideoLoaded] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let isUserScrubbing = false;
    let resumeTimeout: NodeJS.Timeout;
    let rafScrubId: number | null = null;
    let pendingSeekTime: number | null = null;

    // Set cinematic slow playback rate for serene ambient motion
    video.playbackRate = 0.75;

    // Safe play helper
    const playSafe = () => {
      if (video.paused && !isUserScrubbing) {
        video.play().catch(() => {});
      }
    };

    // Safe seek helper - clamps between [0.08, duration - 0.15] to prevent black end-frame
    const performSeek = () => {
      if (pendingSeekTime === null || !video || !video.duration || isNaN(video.duration)) {
        rafScrubId = null;
        return;
      }
      const duration = video.duration;
      const safeTime = Math.max(0.08, Math.min(duration - 0.15, pendingSeekTime));
      pendingSeekTime = null;

      if (!isSeekingRef.current) {
        isSeekingRef.current = true;
        targetTimeRef.current = safeTime;
        video.currentTime = safeTime;
      }
      rafScrubId = null;
    };

    const handleMouseMove = (e: MouseEvent) => {
      const currentX = e.clientX;

      if (prevXRef.current === null) {
        prevXRef.current = currentX;
        return;
      }

      const delta = currentX - prevXRef.current;
      prevXRef.current = currentX;

      if (!video.duration || isNaN(video.duration)) return;

      isUserScrubbing = true;
      clearTimeout(resumeTimeout);

      // Pause continuous playback during user scrub
      if (!video.paused) {
        video.pause();
      }

      // Calculate new target scrub time
      const timeOffset = (delta / window.innerWidth) * SENSITIVITY * video.duration;
      const newTarget = Math.max(
        0.08,
        Math.min(video.duration - 0.15, (video.currentTime || targetTimeRef.current) + timeOffset)
      );

      pendingSeekTime = newTarget;

      // Throttle seek calls with requestAnimationFrame
      if (rafScrubId === null) {
        rafScrubId = requestAnimationFrame(performSeek);
      }

      // Resume native smooth ambient playback 600ms after mouse stops moving
      resumeTimeout = setTimeout(() => {
        isUserScrubbing = false;
        playSafe();
      }, 600);
    };

    const handleSeeked = () => {
      isSeekingRef.current = false;
      // If there is still a pending seek waiting, perform it
      if (pendingSeekTime !== null && rafScrubId === null) {
        rafScrubId = requestAnimationFrame(performSeek);
      }
    };

    const handleMouseLeave = () => {
      prevXRef.current = null;
      isUserScrubbing = false;
      clearTimeout(resumeTimeout);
      playSafe();
    };

    // Seamless loop: when video reaches near the end, loop cleanly to beginning
    const handleTimeUpdate = () => {
      if (!isUserScrubbing && video.duration && !video.paused) {
        // Wrap slightly before duration to prevent any black frame flicker
        if (video.currentTime >= video.duration - 0.12) {
          video.currentTime = 0.08;
        }
      }
    };

    const handleEnded = () => {
      if (!isUserScrubbing) {
        video.currentTime = 0.08;
        playSafe();
      }
    };

    const handleLoadedData = () => {
      setVideoLoaded(true);
      playSafe();
    };

    const handleError = () => {
      // Auto-recover on decode error
      try {
        video.load();
        playSafe();
      } catch {}
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("mouseleave", handleMouseLeave);
    video.addEventListener("seeked", handleSeeked);
    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("ended", handleEnded);
    video.addEventListener("loadeddata", handleLoadedData);
    video.addEventListener("error", handleError);

    if (video.readyState >= 2) {
      setVideoLoaded(true);
      playSafe();
    }

    return () => {
      clearTimeout(resumeTimeout);
      if (rafScrubId !== null) cancelAnimationFrame(rafScrubId);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
      video.removeEventListener("seeked", handleSeeked);
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("ended", handleEnded);
      video.removeEventListener("loadeddata", handleLoadedData);
      video.removeEventListener("error", handleError);
    };
  }, []);

  return (
    <div
      className="absolute inset-0 overflow-hidden bg-[#061b1e]"
      style={{
        background:
          "radial-gradient(ellipse 85% 70% at 75% 45%, #0f464d 0%, #082a2e 45%, #041618 80%, #020b0c 100%)",
      }}
    >
      {/* Cinematic ambient glow beneath video */}
      <div
        className="absolute inset-0 opacity-70 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at 70% 35%, rgba(63, 168, 165, 0.28) 0%, rgba(14, 135, 125, 0.12) 40%, transparent 70%)",
        }}
      />

      <video
        ref={videoRef}
        src={VIDEO_URL}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        aria-hidden="true"
        className={`absolute inset-0 h-full w-full pointer-events-none transition-opacity duration-700 ease-out ${
          videoLoaded ? "opacity-100" : "opacity-0"
        }`}
        style={{
          objectFit: "cover",
          objectPosition: "70% center",
        }}
      />
    </div>
  );
}
