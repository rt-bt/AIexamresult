import React from "react";
import {
  GraduationCap,
  Bell,
  Trophy,
  Briefcase,
  IdCard,
  BadgeCheck,
  ClipboardList,
} from "lucide-react";
import styles from "./HeroBackground.module.css";

/**
 * Lightweight, GPU-accelerated animated hero background
 *
 * Replaces heavy video background with:
 * 1. Base: Soft shifting gradient (Deep Navy #0B1F3A -> Teal #0D9488)
 * 2. Dot-grid overlay: Subtle 7% opacity radial dots
 * 3. Glow orbs: 3 slowly drifting blurred orbs (Teal, Blue, Cyan; 2 on mobile)
 * 4. Floating icons: 7 semi-transparent exam/career symbols (4 on mobile, 7 on desktop)
 * 5. Dark vignette: Preserves WCAG AA text and CTA button contrast
 * 6. Accessibility: Full prefers-reduced-motion support
 */
export function HeroBackground() {
  return (
    <div
      className={`${styles.container} absolute inset-0 overflow-hidden pointer-events-none z-0`}
      aria-hidden="true"
    >
      {/* 1. Base Animated Gradient Layer */}
      <div className={styles.baseGradient} />

      {/* 2. Technical Dot-Grid Pattern Overlay */}
      <div className={styles.dotGrid} />

      {/* 3. Drifting Glow Orbs */}
      <div className={`${styles.orb} ${styles.orbTeal}`} />
      <div className={`${styles.orb} ${styles.orbBlue}`} />
      <div className={`${styles.orb} ${styles.orbCyan}`} />

      {/* 4. Exam & Job Floating Vector Symbols */}
      {/* Mobile + Desktop (4 icons) */}
      <div className={`${styles.floatingIcon} ${styles.icon1}`}>
        <GraduationCap className="w-8 h-8 sm:w-9 sm:h-9" strokeWidth={1.6} />
      </div>

      <div className={`${styles.floatingIcon} ${styles.icon2}`}>
        <Bell className="w-7 h-7 sm:w-8 sm:h-8" strokeWidth={1.6} />
      </div>

      <div className={`${styles.floatingIcon} ${styles.icon3}`}>
        <Trophy className="w-8 h-8 sm:w-10 sm:h-10" strokeWidth={1.6} />
      </div>

      <div className={`${styles.floatingIcon} ${styles.icon4}`}>
        <Briefcase className="w-7 h-7 sm:w-8 sm:h-8" strokeWidth={1.6} />
      </div>

      {/* Desktop Only Icons (3 additional icons, hidden < 768px) */}
      <div
        className={`${styles.floatingIcon} ${styles.icon5} ${styles.desktopOnlyIcon}`}
      >
        <IdCard className="w-8 h-8 sm:w-9 sm:h-9" strokeWidth={1.6} />
      </div>

      <div
        className={`${styles.floatingIcon} ${styles.icon6} ${styles.desktopOnlyIcon}`}
      >
        <BadgeCheck className="w-8 h-8 sm:w-9 sm:h-9" strokeWidth={1.6} />
      </div>

      <div
        className={`${styles.floatingIcon} ${styles.icon7} ${styles.desktopOnlyIcon}`}
      >
        <ClipboardList className="w-7 h-7 sm:w-8 sm:h-8" strokeWidth={1.6} />
      </div>

      {/* 5. Vignette & Bottom Fade Layer for High Contrast */}
      <div className={styles.vignette} />
      <div className={styles.bottomFade} />
    </div>
  );
}

export default HeroBackground;
