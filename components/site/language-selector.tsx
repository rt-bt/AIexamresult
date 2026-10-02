"use client";

import { useState } from "react";
import { Languages, Check } from "lucide-react";
import { useLang } from "@/lib/hooks/use-lang";
import { languages, type LangCode } from "@/lib/languages";
import { cn } from "@/lib/utils";

interface LanguageSelectorProps {
  className?: string;
}

export function LanguageSelector({ className }: LanguageSelectorProps) {
  const { lang, setLang } = useLang();
  const [open, setOpen] = useState(false);
  const isDefault = lang === "en";

  const current = languages.find((l) => l.code === lang) || languages[0];

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className={cn(
          "flex h-8 items-center gap-1.5 rounded-lg border px-2.5 text-xs font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500",
          "border-slate-200 bg-white/80 text-slate-700 hover:bg-slate-100 hover:text-slate-900",
          "dark:border-slate-800 dark:bg-slate-900/80 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white",
          className
        )}
        title="Select language"
        aria-label="Select language"
      >
        <Languages className="h-3.5 w-3.5 text-slate-500 dark:text-slate-400" />
        <span className="hidden sm:inline font-medium">{current.native}</span>
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="fixed sm:absolute right-4 sm:right-0 top-16 sm:top-full z-50 mt-1.5 w-60 origin-top-right rounded-xl border border-slate-200 bg-white/95 p-3 shadow-xl backdrop-blur-xl animate-fade-up dark:border-slate-800 dark:bg-slate-950/95 dark:shadow-slate-950/60">
            <div className="flex items-center justify-between mb-2 px-1">
              <p className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Language</p>
              {!isDefault && (
                <button
                  onClick={() => { setLang("en"); setOpen(false); }}
                  className="text-[10px] font-bold text-teal-600 dark:text-teal-400 hover:underline"
                >
                  Reset
                </button>
              )}
            </div>
            <div className="max-h-60 overflow-y-auto space-y-0.5 pr-0.5">
              {languages.map((l) => (
                <button
                  key={l.code}
                  onClick={() => { setLang(l.code); setOpen(false); }}
                  className={cn(
                    "w-full flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs font-medium transition",
                    lang === l.code
                      ? "bg-teal-50 font-semibold text-teal-700 dark:bg-teal-950/60 dark:text-teal-300"
                      : "text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-900 dark:hover:text-white"
                  )}
                >
                  <span className="w-6 text-center text-sm font-semibold shrink-0 text-slate-500 dark:text-slate-400">{l.native.charAt(0)}</span>
                  <span className="truncate">{l.native}</span>
                  {l.code === "en" && (
                    <span className="ml-1 text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Default</span>
                  )}
                  <span className="ml-auto text-[10px] text-slate-400 dark:text-slate-500 shrink-0 font-mono">{l.name}</span>
                  {lang === l.code && <Check className="h-3.5 w-3.5 text-teal-600 dark:text-teal-400 shrink-0" />}
                </button>
              ))}
            </div>
            <p className="mt-2 text-[10px] text-slate-400 dark:text-slate-500 text-center border-t border-slate-100 dark:border-slate-800/80 pt-2">
              Default: English
            </p>
          </div>
        </>
      )}
    </div>
  );
}
