"use client";

import { useEffect, useRef } from "react";

const VIDEO_URL =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260826_041744_63efcd78-bf7d-4039-99e2-2461e8a61903.mp4";

const SENSITIVITY = 0.8;

/**
 * Full-cover video that scrubs forward/backward on horizontal mouse movement.
 * No autoplay — video is paused and seeked manually.
 * Seek-flood prevention: waits for `seeked` event before queuing next seek.
 */
export function VideoScrubBg() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const targetTimeRef = useRef(0);
  const seekingRef = useRef(false);
  const prevXRef = useRef<number | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let idleAnimationId: number;
    let isUserScrubbing = false;
    let idleTimeout: NodeJS.Timeout;

    // Ambient subtle motion when user is not scrubbing mouse
    const startAmbientMotion = () => {
      cancelAnimationFrame(idleAnimationId);
      const step = () => {
        if (!isUserScrubbing && video && !seekingRef.current && video.duration) {
          // Slowly drift forward in ambient motion
          targetTimeRef.current = (targetTimeRef.current + 0.015) % video.duration;
          seekingRef.current = true;
          video.currentTime = targetTimeRef.current;
        }
        idleAnimationId = requestAnimationFrame(step);
      };
      idleAnimationId = requestAnimationFrame(step);
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
      clearTimeout(idleTimeout);

      const timeOffset =
        (delta / window.innerWidth) * SENSITIVITY * video.duration;

      targetTimeRef.current = Math.max(
        0,
        Math.min(video.duration, targetTimeRef.current + timeOffset)
      );

      // Issue seek immediately
      if (!seekingRef.current) {
        seekingRef.current = true;
        video.currentTime = targetTimeRef.current;
      }

      // Resume subtle ambient playback 1.5s after mouse stops
      idleTimeout = setTimeout(() => {
        isUserScrubbing = false;
      }, 1500);
    };

    const handleSeeked = () => {
      const video = videoRef.current;
      if (!video) return;
      if (Math.abs(video.currentTime - targetTimeRef.current) > 0.02) {
        video.currentTime = targetTimeRef.current;
      } else {
        seekingRef.current = false;
      }
    };

    const handleMouseLeave = () => {
      prevXRef.current = null;
      isUserScrubbing = false;
    };

    const handleLoadedMetadata = () => {
      video.play().then(() => {
        video.pause();
        if (targetTimeRef.current === 0) {
          video.currentTime = 0.08;
        }
        startAmbientMotion();
      }).catch(() => {
        video.currentTime = 0.08;
        startAmbientMotion();
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseleave", handleMouseLeave);
    video.addEventListener("seeked", handleSeeked);
    video.addEventListener("loadedmetadata", handleLoadedMetadata);

    if (video.readyState >= 1) {
      handleLoadedMetadata();
    } else {
      video.load();
    }

    return () => {
      cancelAnimationFrame(idleAnimationId);
      clearTimeout(idleTimeout);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
      video.removeEventListener("seeked", handleSeeked);
      video.removeEventListener("loadedmetadata", handleLoadedMetadata);
    };
  }, []);

  return (
    <div className="absolute inset-0 bg-[#061b1e]">
      <video
        ref={videoRef}
        src={VIDEO_URL}
        muted
        playsInline
        preload="auto"
        aria-hidden="true"
        className="absolute inset-0 h-full w-full pointer-events-none"
        style={{
          objectFit: "cover",
          objectPosition: "70% center",
        }}
      />
    </div>
  );
}
