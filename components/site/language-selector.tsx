"use client";

import { useState } from "react";
import { Languages, Globe, Check } from "lucide-react";
import { useLang } from "@/lib/hooks/use-lang";
import { languages, type LangCode } from "@/lib/languages";

export function LanguageSelector() {
  const { lang, setLang, detectedLang } = useLang();
  const [open, setOpen] = useState(false);

  const current = languages.find((l) => l.code === lang) || languages[0];
  const suggested = detectedLang ? languages.find((l) => l.code === detectedLang) : null;

  const options = suggested && suggested.code !== lang
    ? [current, suggested, ...languages.filter((l) => l.code !== current.code && l.code !== suggested.code)]
    : languages.filter((l) => l.code !== "en").sort((a, b) => (a.code === "hi" ? -1 : b.code === "hi" ? 1 : 0));

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 rounded-full border border-white/20 px-3 py-1.5 text-xs font-bold text-white transition hover:bg-white/15"
        title="Select language"
      >
        <Languages className="h-3.5 w-3.5" />
        <span className="hidden sm:inline">{current.native}</span>
        {suggested && suggested.code !== lang && (
          <span className="hidden sm:inline flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#EA580C]/20 text-[#F97316] text-[10px] font-bold">
            <Globe className="h-2.5 w-2.5" /> Suggested: {suggested.native}
          </span>
        )}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="relative z-50 fixed right-4 top-full mt-2 w-56 origin-top-right rounded-2xl border border-slate-200 bg-white shadow-lg animate-scale-in">
            <div className="p-2">
              {suggested && suggested.code !== lang && (
                <div className="mb-2 rounded-xl bg-gradient-to-r from-[#EA580C]/10 to-[#F97316]/10 p-3">
                  <p className="text-xs font-semibold text-[#EA580C] flex items-center gap-1">
                    <Globe className="h-3 w-3" /> Detected: {suggested.states[0] || "Your region"}
                  </p>
                  <p className="text-xs text-slate-600 mt-1">Switch to {suggested.native}?</p>
                  <button
                    onClick={() => { setLang(suggested.code); setOpen(false); }}
                    className="mt-2 w-full flex items-center justify-center gap-1.5 rounded-lg bg-[#EA580C] px-3 py-1.5 text-xs font-bold text-white transition hover:bg-[#EA580C]/90"
                  >
                    {suggested.code === lang ? <Check className="h-3 w-3" /> : <Globe className="h-3 w-3" />}
                    {suggested.code === lang ? "Selected" : `Switch to ${suggested.native}`}
                  </button>
                </div>
              )}

              <div className="max-h-60 overflow-y-auto">
                {options.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => { setLang(l.code); setOpen(false); }}
                    className={`w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition ${
                      lang === l.code
                        ? "bg-[#0D9488]/10 text-[#0D9488]"
                        : "text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    <span className="w-8 text-center text-base">{l.native.charAt(0)}</span>
                    <span>{l.native}</span>
                    <span className="ml-auto text-[10px] text-slate-400">{l.name}</span>
                    {lang === l.code && <Check className="h-4 w-4 text-[#0D9488]" />}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
