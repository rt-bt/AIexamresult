import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        border: "#DEDEDE",
        background: "#FFFFFF",
        foreground: "#111111",
        ink: "#111111",
        // Reference Design Palette
        "slate-bg": "#464B55",
        "hero-overlay": "#343A46",
        "grey-surface": "#8B8F96",
        "orange-accent": "#F28A2E",
        "orange-hover": "#FF9E42",
        "muted-text": "#D7D9DC",
        brand: "#343A46",
        "brand-dark": "#464B55",
        "brand-light": "#8B8F96",
        accent: "#F28A2E",
        "accent-dark": "#e07a20",
        surface: "#8B8F96",
        "surface-dark": "#464B55",
        highlight: "#F28A2E",
        saffron: "#F28A2E",
        secondary: "#8B8F96",
        "secondary-dark": "#464B55",
        success: "#10B981",
        danger: "#EF4444",
        mist: "#FAFAFA",
        rose: "#F28A2E",
        purple: "#343A46"
      },
      boxShadow: {
        glow: "0 20px 60px rgba(242, 138, 46, 0.15)",
        panel: "0 20px 70px rgba(52, 58, 70, 0.08)",
        card: "0 2px 12px rgba(0, 0, 0, 0.04)",
        "card-hover": "0 8px 30px rgba(0, 0, 0, 0.08)"
      },
      fontFamily: {
        display: ["var(--font-sans)", "system-ui", "sans-serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        heading: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      animation: {
        "fade-up": "fadeUp 0.6s ease-out forwards",
        "fade-in": "fadeIn 0.6s ease-out forwards",
        float: "float 3s ease-in-out infinite",
        marquee: "marquee 90s linear infinite",
        "slide-up": "slideUp 0.3s ease-out",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        marquee: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    }
  },
  plugins: [
    function ({ addUtilities }: { addUtilities: Function }) {
      addUtilities({
        ".pb-safe": { paddingBottom: "env(safe-area-inset-bottom, 0px)" },
        ".mb-safe": { marginBottom: "env(safe-area-inset-bottom, 0px)" },
      });
    },
  ]
};

export default config;
