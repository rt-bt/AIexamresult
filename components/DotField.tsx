// @ts-nocheck
"use client";

import React, { useEffect, useRef, useId } from "react";

export interface DotFieldProps {
  dotRadius?: number;
  dotSpacing?: number;
  cursorRadius?: number;
  cursorForce?: number;
  bulgeOnly?: boolean;
  bulgeStrength?: number;
  glowRadius?: number;
  sparkle?: boolean;
  waveAmplitude?: number;
  gradientFrom?: string;
  gradientTo?: string;
  glowColor?: string;
  opacity?: number;
  style?: React.CSSProperties;
  className?: string;
  children?: React.ReactNode;
}

export function DotField({
  dotRadius = 1.5,
  dotSpacing = 14,
  cursorRadius = 500,
  cursorForce = 0.1,
  bulgeOnly = true,
  bulgeStrength = 67,
  glowRadius = 160,
  sparkle = false,
  waveAmplitude = 0,
  gradientFrom = "#0D9488",
  gradientTo = "#14B8A6",
  glowColor = "#0D9488",
  opacity = 0.2,
  style,
  className = "",
  children,
}: DotFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const circleRef = useRef<SVGCircleElement | null>(null);
  const glowId = useId();

  const dotsRef = useRef<
    Array<{
      ax: number;
      ay: number;
      sx: number;
      sy: number;
      vx: number;
      vy: number;
      x: number;
      y: number;
    }>
  >([]);

  const mouseRef = useRef({
    x: -9999,
    y: -9999,
    prevX: -9999,
    prevY: -9999,
    speed: 0,
  });

  const rafRef = useRef<number | null>(null);
  const boundsRef = useRef({ w: 0, h: 0, left: 0, top: 0 });
  const speedScaleRef = useRef(0);
  const glowOpacityRef = useRef(0);

  const propsRef = useRef({
    dotRadius,
    dotSpacing,
    cursorRadius,
    cursorForce,
    bulgeOnly,
    bulgeStrength,
    glowRadius,
    sparkle,
    waveAmplitude,
    gradientFrom,
    gradientTo,
    glowColor,
  });

  propsRef.current = {
    dotRadius,
    dotSpacing,
    cursorRadius,
    cursorForce,
    bulgeOnly,
    bulgeStrength,
    glowRadius,
    sparkle,
    waveAmplitude,
    gradientFrom,
    gradientTo,
    glowColor,
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const circle = circleRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let resizeTimer: any = null;
    let gradient: CanvasGradient | null = null;
    let frameCount = 0;
    let isVisible = true;
    let isSleeping = false;
    let lastTime = 0;
    let accumulator = 0;
    const TICK_INTERVAL = 20; // 50 updates/sec for physics

    function initDots(width: number, height: number) {
      const cfg = propsRef.current;
      const step = cfg.dotRadius + cfg.dotSpacing;
      const cols = Math.floor(width / step);
      const rows = Math.floor(height / step);
      const padX = (width % step) / 2;
      const padY = (height % step) / 2;

      const list = new Array(rows * cols);
      let idx = 0;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const posX = padX + c * step + step / 2;
          const posY = padY + r * step + step / 2;
          list[idx++] = {
            ax: posX,
            ay: posY,
            sx: posX,
            sy: posY,
            vx: 0,
            vy: 0,
            x: posX,
            y: posY,
          };
        }
      }
      dotsRef.current = list;
    }

    function resize() {
      if (!canvas || !canvas.parentElement) return;
      const parentRect = canvas.parentElement.getBoundingClientRect();
      const w = Math.max(1, Math.floor(parentRect.width));
      const h = Math.max(1, Math.floor(parentRect.height));

      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      boundsRef.current = {
        w,
        h,
        left: parentRect.left,
        top: parentRect.top,
      };

      gradient = null;
      initDots(w, h);
      wakeUp();
    }

    function onMouseMove(e: MouseEvent) {
      if (!canvas) return;
      const parentRect = canvas.parentElement?.getBoundingClientRect() || canvas.getBoundingClientRect();
      boundsRef.current.left = parentRect.left;
      boundsRef.current.top = parentRect.top;

      mouseRef.current.x = e.clientX - parentRect.left;
      mouseRef.current.y = e.clientY - parentRect.top;
      wakeUp();
    }

    function onTouchMove(e: TouchEvent) {
      if (e.touches.length !== 1 || !canvas) return;
      const t = e.touches[0];
      const parentRect = canvas.parentElement?.getBoundingClientRect() || canvas.getBoundingClientRect();
      boundsRef.current.left = parentRect.left;
      boundsRef.current.top = parentRect.top;

      mouseRef.current.x = t.clientX - parentRect.left;
      mouseRef.current.y = t.clientY - parentRect.top;
      wakeUp();
    }

    function onMouseLeave() {
      mouseRef.current.x = -9999;
      mouseRef.current.y = -9999;
      wakeUp();
    }

    function updateSpeed() {
      const m = mouseRef.current;
      const dx = m.prevX - m.x;
      const dy = m.prevY - m.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      m.speed += (dist - m.speed) * 0.5;
      if (m.speed < 0.001) m.speed = 0;
      m.prevX = m.x;
      m.prevY = m.y;
    }

    function loop(time: number) {
      rafRef.current = requestAnimationFrame(loop);
      frameCount++;

      const dots = dotsRef.current;
      const mouse = mouseRef.current;
      const { w, h } = boundsRef.current;
      const cfg = propsRef.current;
      const dotCount = dots.length;
      const waveTime = frameCount * 0.02;

      accumulator += Math.min(Math.max(time - lastTime, 0), 100);
      lastTime = time;

      while (accumulator >= TICK_INTERVAL) {
        accumulator -= TICK_INTERVAL;
        updateSpeed();
      }

      const targetSpeed = prefersReducedMotion ? 0 : Math.min(mouse.speed / 5, 1);
      speedScaleRef.current += (targetSpeed - speedScaleRef.current) * 0.06;
      if (speedScaleRef.current < 0.001) speedScaleRef.current = 0;
      const speedFactor = speedScaleRef.current;

      glowOpacityRef.current += (speedFactor - glowOpacityRef.current) * 0.08;
      if (glowOpacityRef.current < 0.001) glowOpacityRef.current = 0;

      if (circle) {
        circle.setAttribute("cx", mouse.x.toString());
        circle.setAttribute("cy", mouse.y.toString());
        circle.style.opacity = glowOpacityRef.current.toString();
      }

      ctx.clearRect(0, 0, w, h);

      if (!gradient) {
        gradient = ctx.createLinearGradient(0, 0, w, h);
        gradient.addColorStop(0, cfg.gradientFrom);
        gradient.addColorStop(1, cfg.gradientTo);
      }
      ctx.fillStyle = gradient;

      const curRad = cfg.cursorRadius;
      const curRadSq = curRad * curRad;
      const rad = cfg.dotRadius;
      const bulge = cfg.bulgeOnly;
      const hasWave = !prefersReducedMotion && cfg.waveAmplitude > 0;
      const hasSparkle = !prefersReducedMotion && cfg.sparkle;

      let isResting = !hasWave && !hasSparkle && speedFactor === 0 && glowOpacityRef.current === 0;

      ctx.beginPath();
      for (let i = 0; i < dotCount; i++) {
        const d = dots[i];
        const dx = mouse.x - d.ax;
        const dy = mouse.y - d.ay;
        const distSq = dx * dx + dy * dy;

        if (distSq < curRadSq && speedFactor > 0.01) {
          const dist = Math.sqrt(distSq) || 1;
          const nx = dx / dist;
          const ny = dy / dist;

          if (bulge) {
            const tt = 1 - dist / curRad;
            const te = tt * tt * cfg.bulgeStrength * speedFactor;
            d.sx += (d.ax - nx * te - d.sx) * 0.15;
            d.sy += (d.ay - ny * te - d.sy) * 0.15;
          } else {
            const force = (500 / dist) * (mouse.speed * cfg.cursorForce);
            d.vx -= nx * force;
            d.vy -= ny * force;
          }
        } else if (bulge) {
          d.sx += (d.ax - d.sx) * 0.1;
          d.sy += (d.ay - d.sy) * 0.1;
        }

        if (!bulge) {
          d.vx *= 0.9;
          d.vy *= 0.9;
          d.x = d.ax + d.vx;
          d.y = d.ay + d.vy;
          d.sx += (d.x - d.sx) * 0.1;
          d.sy += (d.y - d.sy) * 0.1;
        }

        if (isResting && (Math.abs(d.sx - d.ax) > 0.05 || Math.abs(d.sy - d.ay) > 0.05)) {
          isResting = false;
        }

        let posX = d.sx;
        let posY = d.sy;

        if (hasWave) {
          posY += Math.sin(d.ax * 0.03 + waveTime) * cfg.waveAmplitude;
          posX += Math.cos(d.ay * 0.03 + waveTime * 0.7) * cfg.waveAmplitude * 0.5;
        }

        const isSparkling = hasSparkle && (((i * 2654435761) ^ (frameCount >> 3)) >>> 0) % 100 < 3;
        const drawRadius = isSparkling ? rad * 1.8 : rad;

        ctx.moveTo(posX + drawRadius, posY);
        ctx.arc(posX, posY, drawRadius, 0, Math.PI * 2);
      }
      ctx.fill();

      if (isResting) {
        isSleeping = true;
        stopLoop();
      }
    }

    function startLoop() {
      if (rafRef.current == null) {
        lastTime = performance.now();
        accumulator = TICK_INTERVAL;
        rafRef.current = requestAnimationFrame(loop);
      }
    }

    function stopLoop() {
      if (rafRef.current != null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    }

    function wakeUp() {
      isSleeping = false;
      if (isVisible) {
        startLoop();
      }
    }

    resize();

    const debouncedResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(resize, 80);
    };

    window.addEventListener("resize", debouncedResize);
    window.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    document.addEventListener("mouseleave", onMouseLeave);

    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
        if (isVisible && !isSleeping) {
          startLoop();
        } else {
          stopLoop();
        }
      },
      { threshold: [0, 0.05] }
    );
    observer.observe(canvas.parentElement || canvas);

    return () => {
      stopLoop();
      clearTimeout(resizeTimer);
      observer.disconnect();
      window.removeEventListener("resize", debouncedResize);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("touchmove", onTouchMove);
      document.removeEventListener("mouseleave", onMouseLeave);
    };
  }, []);

  return (
    <div
      className={className}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        opacity,
        ...style,
      }}
      aria-hidden="true"
    >
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
        }}
      />
      <svg
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
        }}
      >
        <defs>
          <radialGradient id={`dot-field-glow-${glowId}`}>
            <stop offset="0%" stopColor={glowColor} stopOpacity={0.3} />
            <stop offset="100%" stopColor={glowColor} stopOpacity={0} />
          </radialGradient>
        </defs>
        <circle
          ref={circleRef}
          cx="-9999"
          cy="-9999"
          r={glowRadius}
          fill={`url(#dot-field-glow-${glowId})`}
          style={{ opacity: 0, willChange: "opacity" }}
        />
      </svg>
      {children}
    </div>
  );
}

export default DotField;
