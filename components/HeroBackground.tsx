import React from "react";
import styles from "./HeroBackground.module.css";

/**
 * HeroBackground
 *
 * Lightweight, GPU-accelerated animated hero background
 * 1. Base: Soft mesh gradient (Deep Navy #0B1F3A to Teal #0D9488 with Cyan #06B6D4)
 * 2. Dot-Grid: ~6% opacity technical radial-dots
 * 3. Glow Orbs: 3 blurred drifting orbs (Teal, Cyan, Blue; reduced to 2 on mobile)
 * 4. Contrast: Dark vignette + bottom fade for WCAG AA readability
 * 5. Accessibility: Full prefers-reduced-motion support
 */
export function HeroBackground() {
  return (
    <div
      className={`${styles.container} absolute inset-0 overflow-hidden pointer-events-none z-0`}
      aria-hidden="true"
    >
      {/* 1. Base Mesh Gradient */}
      <div className={styles.baseGradient} />

      {/* 2. Technical Dot Grid Pattern */}
      <div className={styles.dotGrid} />

      {/* 3. Drifting Glow Orbs */}
      <div className={`${styles.orb} ${styles.orbTeal}`} />
      <div className={`${styles.orb} ${styles.orbCyan}`} />
      <div className={`${styles.orb} ${styles.orbNavy}`} />

      {/* 4. Vignette and Bottom Transition Fade */}
      <div className={styles.vignette} />
      <div className={styles.bottomFade} />
    </div>
  );
}

export default HeroBackground;
