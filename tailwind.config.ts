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
        // Space Grotesk & DM Sans Brand Kit Palette
        brand: "#111111",
        "brand-dark": "#000000",
        "brand-light": "#222222",
        accent: "#FF5B3E",
        "accent-dark": "#e0482d",
        surface: "#FFD84D",
        "surface-dark": "#e5be38",
        highlight: "#FF5B3E",
        saffron: "#FFD84D",
        secondary: "#FFD84D",
        "secondary-dark": "#e5be38",
        success: "#10B981",
        danger: "#FF5B3E",
        mist: "#FAFAFA",
        rose: "#FF5B3E",
        purple: "#111111"
      },
      boxShadow: {
        glow: "0 24px 80px rgba(255, 91, 62, 0.18)",
        panel: "0 20px 70px rgba(17, 17, 17, 0.08)",
        card: "0 4px 20px rgba(0, 0, 0, 0.04)",
        "card-hover": "0 12px 40px rgba(0, 0, 0, 0.08)"
      },
      fontFamily: {
        display: ["var(--font-space-grotesk)", "system-ui", "sans-serif"],
        sans: ["var(--font-dm-sans)", "system-ui", "sans-serif"],
        heading: ["var(--font-space-grotesk)", "system-ui", "sans-serif"],
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
