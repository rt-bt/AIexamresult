"use client";

import { useState, useEffect } from "react";
import { Cookie, ShieldCheck, CheckCircle2, RotateCcw, Sliders } from "lucide-react";

export function CookieManager() {
  const [mounted, setMounted] = useState(false);
  const [analytics, setAnalytics] = useState(true);
  const [ads, setAds] = useState(true);
  const [savedMsg, setSavedMsg] = useState("");
  const [currentStatus, setCurrentStatus] = useState<string>("default");

  useEffect(() => {
    setMounted(true);
    const val = localStorage.getItem("aier_cookie_consent");
    if (val === "essential") {
      setAnalytics(false);
      setAds(false);
      setCurrentStatus("essential");
    } else if (val === "all") {
      setAnalytics(true);
      setAds(true);
      setCurrentStatus("all");
    } else {
      setCurrentStatus("default");
    }
  }, []);

  const handleSave = () => {
    const choice = analytics && ads ? "all" : "essential";
    try {
      localStorage.setItem("aier_cookie_consent", choice);
      localStorage.setItem("aier_cookie_consent_date", new Date().toISOString());
      document.cookie = `aier_cookie_consent=${choice};path=/;max-age=31536000;SameSite=Lax`;
    } catch {}
    setCurrentStatus(choice);
    setSavedMsg("Your cookie preferences have been successfully updated.");
    setTimeout(() => setSavedMsg(""), 4000);
  };

  const handleReset = () => {
    try {
      localStorage.removeItem("aier_cookie_consent");
      localStorage.removeItem("aier_cookie_consent_date");
      document.cookie = "aier_cookie_consent=;path=/;max-age=0";
    } catch {}
    setAnalytics(true);
    setAds(true);
    setCurrentStatus("default");
    setSavedMsg("Cookie consent has been reset. The consent banner will reappear on your next reload.");
    setTimeout(() => setSavedMsg(""), 5000);
  };

  if (!mounted) {
    return (
      <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 animate-pulse text-sm text-slate-500">
        Loading cookie management controls...
      </div>
    );
  }

  return (
    <div className="rounded-2xl border-2 border-teal-500/20 bg-gradient-to-br from-white to-teal-50/40 p-5 sm:p-7 shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-teal-100 pb-4">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-teal-600 text-white shadow-sm">
            <Sliders className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900">
              Interactive Cookie Preference Centre
            </h3>
            <p className="text-xs text-slate-500">
              Control which categories of cookies and storage technologies are enabled.
            </p>
          </div>
        </div>

        <div className="inline-flex items-center gap-1.5 self-start sm:self-center px-3 py-1 rounded-full text-xs font-semibold bg-white border border-slate-200 shadow-2xs">
          <span className={`h-2 w-2 rounded-full ${currentStatus === "all" ? "bg-emerald-500" : currentStatus === "essential" ? "bg-amber-500" : "bg-blue-500"}`} />
          <span className="text-slate-700">
            {currentStatus === "all"
              ? "All Cookies Accepted"
              : currentStatus === "essential"
              ? "Strictly Necessary Only"
              : "Default Settings"}
          </span>
        </div>
      </div>

      {savedMsg && (
        <div className="flex items-center gap-2 rounded-xl bg-emerald-50 border border-emerald-200 p-3.5 text-xs font-semibold text-emerald-800">
          <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
          <span>{savedMsg}</span>
        </div>
      )}

      <div className="grid gap-3.5">
        {/* Necessary */}
        <div className="flex items-center justify-between gap-4 rounded-xl bg-white p-4 border border-slate-200 shadow-2xs">
          <div className="space-y-0.5 max-w-lg">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-slate-900">Strictly Necessary Cookies</span>
              <span className="rounded-md bg-teal-50 px-2 py-0.5 text-[10px] font-bold text-teal-700 border border-teal-200">
                Required
              </span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Essential for core functions like security, session routing, CSRF protection, and page navigation. Cannot be switched off.
            </p>
          </div>
          <span className="shrink-0 text-xs font-bold text-teal-600 bg-teal-50/80 px-2.5 py-1 rounded-lg border border-teal-100">
            Always Active
          </span>
        </div>

        {/* Analytics */}
        <div className="flex items-center justify-between gap-4 rounded-xl bg-white p-4 border border-slate-200 shadow-2xs">
          <div className="space-y-0.5 max-w-lg">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-slate-900">Performance & Analytics</span>
              <span className="rounded-md bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-700 border border-blue-200">
                Google Analytics
              </span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Helps us understand visitor traffic, popular exam alerts, and technical bottlenecks so we can improve site speed and reliability.
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer shrink-0">
            <input
              type="checkbox"
              checked={analytics}
              onChange={(e) => setAnalytics(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-600"></div>
          </label>
        </div>

        {/* Advertising */}
        <div className="flex items-center justify-between gap-4 rounded-xl bg-white p-4 border border-slate-200 shadow-2xs">
          <div className="space-y-0.5 max-w-lg">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-slate-900">Advertising & Google AdSense</span>
              <span className="rounded-md bg-purple-50 px-2 py-0.5 text-[10px] font-bold text-purple-700 border border-purple-200">
                ca-pub-2439432844260170
              </span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Used by Google AdSense and certified ad partners to deliver relevant educational, exam-related, and commercial advertisements. Supports free operation of this portal.
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer shrink-0">
            <input
              type="checkbox"
              checked={ads}
              onChange={(e) => setAds(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-600"></div>
          </label>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-200/80">
        <div className="flex items-center gap-2.5">
          <button
            onClick={handleSave}
            className="rounded-xl bg-teal-600 px-5 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-teal-700 active:scale-95 flex items-center gap-1.5"
          >
            <CheckCircle2 className="h-3.5 w-3.5" /> Save Preferences
          </button>
          <button
            onClick={() => {
              setAnalytics(true);
              setAds(true);
              handleSave();
            }}
            className="rounded-xl border border-teal-200 bg-teal-50/50 px-4 py-2.5 text-xs font-semibold text-teal-800 transition hover:bg-teal-100/60 active:scale-95"
          >
            Allow All
          </button>
        </div>

        <button
          onClick={handleReset}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-800 transition py-2"
        >
          <RotateCcw className="h-3 w-3" /> Reset to Default
        </button>
      </div>
    </div>
  );
}
