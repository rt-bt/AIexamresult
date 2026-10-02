import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        border: "var(--border, #e4e4e7)",
        background: "var(--background, #fafafa)",
        foreground: "var(--foreground, #09090b)",
        ink: "#09090B",
        brand: "#18181B",
        "brand-dark": "#09090B",
        "brand-light": "#27272A",
        obsidian: {
          DEFAULT: "#09090B",
          deep: "#050507",
          card: "#121215",
          border: "#27272A",
          muted: "#18181B",
        },
        secondary: "#f4f4f5",
        "secondary-dark": "#27272a",
        accent: "#18181B",
        "accent-dark": "#09090B",
        highlight: "#71717A",
        saffron: "#F59E0B",
        success: "#10B981",
        danger: "#EF4444",
        mist: "#F4F4F5",
        rose: "#E11D48",
        purple: "#7C3AED"
      },
      boxShadow: {
        glow: "0 24px 80px rgba(0, 0, 0, 0.35)",
        panel: "0 20px 70px rgba(0, 0, 0, 0.40)",
        card: "0 4px 20px rgba(0, 0, 0, 0.08)",
        "card-hover": "0 12px 40px rgba(0, 0, 0, 0.25)"
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
