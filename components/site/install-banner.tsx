"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";

export function InstallBanner() {
  const [deferredPrompt, setDeferredPrompt] = useState<Event | null>(null);
  const [show, setShow] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    try {
      if (localStorage.getItem("pwa_dismissed") === "true") {
        setDismissed(true);
      }
    } catch {}

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      try {
        if (!dismissed && localStorage.getItem("pwa_dismissed") !== "true") {
          setTimeout(() => setShow(true), 4000);
        }
      } catch {}
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
      try { localStorage.setItem("pwa_dismissed", "true"); } catch {}
    });
  };

  const close = () => {
    setShow(false);
    setDismissed(true);
    try { localStorage.setItem("pwa_dismissed", "true"); } catch {}
  };

  if (!show || dismissed) return null;

  return (
    <div 
      role="status" 
      aria-live="polite" 
      className="fixed inset-x-0 bottom-16 z-50 animate-slide-up lg:bottom-4 lg:left-auto lg:right-4 lg:w-auto"
    >
      <div className="mx-3 flex items-center justify-between gap-3 rounded-xl border border-teal-200/60 bg-white px-4 py-2.5 shadow-lg shadow-slate-900/10">
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-teal-50 text-xs font-bold text-teal-700">AI</span>
          <p className="truncate text-xs font-semibold text-slate-800">Install App</p>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <button onClick={install} className="rounded-lg bg-teal-700 px-3 py-1.5 text-xs font-bold text-white transition hover:bg-teal-800 active:scale-95">Install</button>
          <button onClick={close} aria-label="Dismiss install prompt" className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"><X className="h-3.5 w-3.5" /></button>
        </div>
      </div>
    </div>
  );
}
