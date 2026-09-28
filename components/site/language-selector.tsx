"use client";

import { useState } from "react";
import { Languages, Check } from "lucide-react";
import { useLang } from "@/lib/hooks/use-lang";
import { languages, type LangCode } from "@/lib/languages";

export function LanguageSelector() {
  const { lang, setLang } = useLang();
  const [open, setOpen] = useState(false);
  const isDefault = lang === "en";

  const current = languages.find((l) => l.code === lang) || languages[0];

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 rounded-full border border-white/20 px-3 py-1.5 text-xs font-bold text-white transition hover:bg-white/15"
        title="Select language"
      >
        <Languages className="h-3.5 w-3.5" />
        <span className="hidden sm:inline">{current.native}</span>
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="relative z-50 fixed sm:absolute right-0 sm:right-auto top-full mt-2 w-56 origin-top-right rounded-2xl border border-slate-200 bg-white shadow-lg animate-scale-in">
            <div className="p-3">
              <div className="flex items-center justify-between mb-2 px-1">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Language</p>
                {!isDefault && (
                  <button onClick={() => { setLang("en"); setOpen(false); }}
                    className="text-[10px] font-bold text-brand hover:underline">
                    Reset
                  </button>
                )}
              </div>
              <div className="max-h-60 overflow-y-auto space-y-0.5">
                {languages.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => { setLang(l.code); setOpen(false); }}
                    className={`w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition ${
                      lang === l.code
                        ? "bg-brand/10 text-brand"
                        : "text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    <span className="w-8 text-center text-base shrink-0">{l.native.charAt(0)}</span>
                    <span className="truncate">{l.native}</span>
                    {l.code === "en" && (
                      <span className="ml-1 text-[9px] font-bold text-slate-300 uppercase">Default</span>
                    )}
                    <span className="ml-auto text-[10px] text-slate-400 shrink-0">{l.name}</span>
                    {lang === l.code && <Check className="h-3.5 w-3.5 text-brand shrink-0" />}
                  </button>
                ))}
              </div>
              <p className="mt-2 text-[10px] text-slate-400 text-center border-t border-slate-100 pt-2">Default: English</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
