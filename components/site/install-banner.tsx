"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";

export function InstallBanner() {
  const [deferredPrompt, setDeferredPrompt] = useState<Event | null>(null);
  const [show, setShow] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      if (!dismissed && !document.cookie.includes("pwa_dismissed=true")) {
        setTimeout(() => setShow(true), 4000);
      }
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, [dismissed]);

  const install = () => {
    if (!deferredPrompt) return;
    (deferredPrompt as any).prompt();
    (deferredPrompt as any).userChoice.then(() => {
      setDeferredPrompt(null);
      setShow(false);
    });
  };

  const close = () => {
    setShow(false);
    setDismissed(true);
    document.cookie = "pwa_dismissed=true;max-age=86400;path=/";
  };

  if (!show) return null;

  return (
    <div className="fixed inset-x-0 bottom-16 z-50 animate-slide-up lg:bottom-4 lg:left-auto lg:right-4 lg:w-auto">
      <div className="mx-3 flex items-center justify-between gap-3 rounded-xl border border-brand/20 bg-white px-4 py-2.5 shadow-lg shadow-brand/5">
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-brand/10 text-[10px] font-black text-brand">AI</span>
          <p className="truncate text-xs font-semibold text-slate-700">Install App</p>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <button onClick={install} className="rounded-lg bg-brand px-3 py-1.5 text-[11px] font-bold text-white transition hover:bg-brand-dark active:scale-95">Install</button>
          <button onClick={close} className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100"><X className="h-3.5 w-3.5" /></button>
        </div>
      </div>
    </div>
  );
}
