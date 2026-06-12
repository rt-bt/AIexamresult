"use client";

import { useState } from "react";
import { Languages, Check } from "lucide-react";
import { useLang } from "@/lib/hooks/use-lang";
import { languages, type LangCode } from "@/lib/languages";

export function LanguageSelector() {
  const { lang, setLang } = useLang();
  const [open, setOpen] = useState(false);

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
          <div className="relative z-50 fixed right-4 top-full mt-2 w-56 origin-top-right rounded-2xl border border-slate-200 bg-white shadow-lg animate-scale-in">
            <div className="p-2">
              <div className="max-h-60 overflow-y-auto">
                {languages.map((l) => (
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
