"use client";

import { useEffect, useRef, useState } from "react";

// Linear interpolation helper
const lerp = (start: number, end: number, factor: number) => (1 - factor) * start + factor * end;

// 6 trail points with graduated interpolation factors matching vivalalabia physics
const TRAIL_COUNT = 6;
const LERP_FACTORS = [0.24, 0.16, 0.11, 0.082, 0.066, 0.052];

export function CustomCursor() {
  const [initialized, setInitialized] = useState(false);
  const [hidden, setHidden] = useState(true);
  const [isPointer, setIsPointer] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [isPulsing, setIsPulsing] = useState(false);

  const mainPointRef = useRef<HTMLDivElement>(null);
  const trailRefs = useRef<(HTMLDivElement | null)[]>([]);
  
  const mousePos = useRef<[number, number]>([0, 0]);
  const currentPos = useRef<[number, number]>([0, 0]);
  const trailPositions = useRef<[number, number][]>([]);
  const animFrameId = useRef<number | null>(null);
  const idleTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Only enable on desktop with fine pointer (mouse), disable on touch/mobile
    const isTouch = window.matchMedia("(pointer: coarse)").matches;
    if (isTouch) return;

    // Initialize trail positions
    trailPositions.current = Array.from({ length: TRAIL_COUNT }, () => [0, 0]);

    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current = [e.clientX, e.clientY];
      setHidden(false);
      setInitialized(true);
      setIsPulsing(false);

      if (idleTimer.current) clearTimeout(idleTimer.current);
      idleTimer.current = setTimeout(() => {
        setIsPulsing(true);
      }, 1200);

      // Check if hovering over clickable elements
      const target = e.target as HTMLElement | null;
      if (target) {
        const isClickable = target.closest("a, button, input, select, textarea, [role='button'], [tabindex='0']");
        setIsPointer(!!isClickable);
      }
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);
    const handleMouseLeave = () => setHidden(true);
    const handleMouseEnter = () => setHidden(false);

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);

    // Animation Loop using requestAnimationFrame
    const render = () => {
      const [targetX, targetY] = mousePos.current;

      // Update main cursor position with responsive smoothing
      const [curX, curY] = currentPos.current;
      const nextX = lerp(curX, targetX, 0.72);
      const nextY = lerp(curY, targetY, 0.72);
      currentPos.current = [nextX, nextY];

      if (mainPointRef.current) {
        mainPointRef.current.style.transform = `translate3d(${nextX}px, ${nextY}px, 0)`;
      }

      // Update cascading trail elements with graduated inertia
      trailRefs.current.forEach((el, index) => {
        if (!el) return;
        const [tX, tY] = trailPositions.current[index] || [nextX, nextY];
        const factor = LERP_FACTORS[index];
        const nTX = lerp(tX, targetX, factor);
        const nTY = lerp(tY, targetY, factor);
        trailPositions.current[index] = [nTX, nTY];

        // Velocity stretch effect
        const dx = Math.abs(nTX - targetX);
        const dy = Math.abs(nTY - targetY);
        const speed = Math.min(Math.sqrt(dx * dx + dy * dy), 40);
        const scale = 1 - (speed / 40) * 0.25;

        el.style.transform = `translate3d(${nTX}px, ${nTY}px, 0) scale(${scale})`;
      });

      animFrameId.current = requestAnimationFrame(render);
    };

    animFrameId.current = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
      if (animFrameId.current) cancelAnimationFrame(animFrameId.current);
      if (idleTimer.current) clearTimeout(idleTimer.current);
    };
  }, []);

  if (!initialized) return null;

  return (
    <div
      className={`fixed inset-0 pointer-events-none z-[9999] transition-opacity duration-300 ${
        hidden ? "opacity-0" : "opacity-100"
      }`}
      aria-hidden="true"
    >
      {/* Cascading Tail Points (Vivalalabia graduated trailing effect) */}
      {Array.from({ length: TRAIL_COUNT }).map((_, index) => {
        const opacity = 1 - 0.13 * (index + 1);
        const size = Math.max(4, 9 - index * 0.9);
        return (
          <div
            key={index}
            ref={(el) => {
              trailRefs.current[index] = el;
            }}
            className="absolute top-0 left-0 will-change-transform"
            style={{ opacity }}
          >
            <div
              className="rounded-full bg-[#5B0111] -translate-x-1/2 -translate-y-1/2 shadow-xs transition-colors duration-300"
              style={{
                width: `${size}px`,
                height: `${size}px`,
                backgroundColor: isPointer ? "#FF5B3E" : "#5B0111",
              }}
            />
          </div>
        );
      })}

      {/* Main Cursor Lead Element */}
      <div
        ref={mainPointRef}
        className="absolute top-0 left-0 will-change-transform"
      >
        {/* Subtle Idle Ambient Pulse Ring */}
        {isPulsing && (
          <div className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full border border-[#FF5B3E]/60 animate-ping pointer-events-none" />
        )}

        {/* Outer Interactive Halo on Click/Hover */}
        <div
          className={`absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 rounded-full border transition-all duration-200 pointer-events-none ${
            isClicking
              ? "w-8 h-8 border-[#FF5B3E] bg-[#FF5B3E]/20 scale-90"
              : isPointer
              ? "w-9 h-9 border-[#FFD84D] bg-[#FFD84D]/15 scale-110"
              : "w-5 h-5 border-[#5B0111]/40 scale-100"
          }`}
        />

        {/* Center Primary Needle / Dot */}
        <div
          className={`rounded-full -translate-x-1/2 -translate-y-1/2 transition-all duration-150 ${
            isPointer
              ? "w-2.5 h-2.5 bg-[#FF5B3E] shadow-[0_0_8px_#FF5B3E]"
              : "w-2 h-2 bg-[#5B0111] shadow-[0_0_4px_rgba(91,1,17,0.5)]"
          }`}
        />
      </div>
    </div>
  );
}
