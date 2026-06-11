import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0F172A",
        brand: "#0D9488",
        "brand-dark": "#0F766E",
        "brand-light": "#14B8A6",
        secondary: "#EA580C",
        "secondary-dark": "#C2410C",
        accent: "#4F46E5",
        "accent-dark": "#4338CA",
        highlight: "#D97706",
        saffron: "#F59E0B",
        success: "#10B981",
        danger: "#EF4444",
        mist: "#F0FDFA",
        rose: "#E11D48",
        purple: "#7C3AED"
      },
      boxShadow: {
        glow: "0 24px 80px rgba(13, 148, 136, 0.18)",
        panel: "0 20px 70px rgba(15, 23, 42, 0.10)",
        card: "0 4px 20px rgba(0, 0, 0, 0.06)",
        "card-hover": "0 12px 40px rgba(13, 148, 136, 0.12)"
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "system-ui", "sans-serif"]
      },
      animation: {
        "fade-up": "fadeUp 0.6s ease-out forwards",
        "fade-in": "fadeIn 0.6s ease-out forwards",
        float: "float 3s ease-in-out infinite",
        marquee: "marquee 120s linear infinite",
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
          "0%": { transform: "translateX(50%)" },
          "100%": { transform: "translateX(-250%)" },
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
