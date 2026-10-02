"use client";

import { useTheme } from "@/components/theme-provider";
import { Sun, Moon, Laptop } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

interface ThemeToggleProps {
  className?: string;
}

export function ThemeToggle({ className }: ThemeToggleProps) {
  const { theme, resolvedTheme, setTheme, mounted } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!mounted) {
    return (
      <div
        className={cn(
          "h-8 w-8 rounded-lg border border-slate-200/80 bg-slate-100/50 dark:border-slate-800 dark:bg-slate-900/50",
          className
        )}
      />
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <div ref={containerRef} className="relative">
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className={cn(
          "relative flex h-8 w-8 items-center justify-center rounded-lg border transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500",
          "border-slate-200 bg-white/80 text-slate-700 hover:bg-slate-100 hover:text-slate-900",
          "dark:border-slate-800 dark:bg-slate-900/80 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white",
          className
        )}
        title={`Current theme: ${theme} (${resolvedTheme})`}
        aria-label="Toggle theme"
      >
        <Sun className={cn("h-4 w-4 transition-all duration-200", isDark ? "scale-0 rotate-90 opacity-0" : "scale-100 rotate-0 opacity-100")} />
        <Moon className={cn("absolute h-4 w-4 transition-all duration-200", isDark ? "scale-100 rotate-0 opacity-100 text-teal-400" : "scale-0 -rotate-90 opacity-0")} />
      </button>

      {menuOpen && (
        <div className="absolute right-0 top-full z-50 mt-1.5 w-32 origin-top-right rounded-xl border border-slate-200 bg-white/95 p-1 shadow-lg backdrop-blur-xl animate-fade-up dark:border-slate-800 dark:bg-slate-950/95 dark:shadow-slate-950/50">
          <button
            onClick={() => { setTheme("light"); setMenuOpen(false); }}
            className={cn(
              "flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs font-medium transition",
              theme === "light"
                ? "bg-teal-50 text-teal-700 dark:bg-teal-950/50 dark:text-teal-300"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-slate-200"
            )}
          >
            <Sun className="h-3.5 w-3.5" />
            <span>Light</span>
          </button>
          <button
            onClick={() => { setTheme("dark"); setMenuOpen(false); }}
            className={cn(
              "flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs font-medium transition",
              theme === "dark"
                ? "bg-teal-50 text-teal-700 dark:bg-teal-950/50 dark:text-teal-300"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-slate-200"
            )}
          >
            <Moon className="h-3.5 w-3.5" />
            <span>Dark</span>
          </button>
          <button
            onClick={() => { setTheme("system"); setMenuOpen(false); }}
            className={cn(
              "flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs font-medium transition",
              theme === "system"
                ? "bg-teal-50 text-teal-700 dark:bg-teal-950/50 dark:text-teal-300"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-slate-200"
            )}
          >
            <Laptop className="h-3.5 w-3.5" />
            <span>System</span>
          </button>
        </div>
      )}
    </div>
  );
}
