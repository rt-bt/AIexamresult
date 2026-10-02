import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        border: "var(--border, #e2e8f0)",
        background: "var(--background, #f8fafc)",
        foreground: "var(--foreground, #0f172a)",
        ink: "#0F172A",
        brand: "#4F46E5", // EdTech Indigo
        "brand-dark": "#4338CA",
        "brand-light": "#6366F1",
        accent: "#D97706", // Academic Amber / Gold
        "accent-dark": "#B45309",
        highlight: "#F59E0B",
        edtech: {
          indigo: "#4F46E5",
          "indigo-dark": "#4338CA",
          "indigo-light": "#6366F1",
          amber: "#D97706",
          gold: "#F59E0B",
          navy: "#0F172A",
        },
        secondary: "#f1f5f9",
        "secondary-dark": "#e2e8f0",
        saffron: "#F59E0B",
        success: "#10B981",
        danger: "#EF4444",
        mist: "#EEF2FF",
        rose: "#E11D48",
        purple: "#7C3AED"
      },
      boxShadow: {
        glow: "0 24px 80px rgba(79, 70, 229, 0.20)",
        panel: "0 20px 70px rgba(15, 23, 42, 0.12)",
        card: "0 4px 20px rgba(79, 70, 229, 0.08)",
        "card-hover": "0 12px 40px rgba(79, 70, 229, 0.18)"
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "system-ui", "sans-serif"]
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
