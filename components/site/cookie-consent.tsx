"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Cookie, X } from "lucide-react";

export type CookieConsentChoice = "all" | "essential" | "declined";

export function CookieConsent() {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [analyticsAllowed, setAnalyticsAllowed] = useState(true);
  const [adsAllowed, setAdsAllowed] = useState(true);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("aier_cookie_consent");
    if (!saved) {
      const timer = setTimeout(() => {
        setVisible(true);
      }, 1500);
      return () => clearTimeout(timer);
    } else {
      if (saved === "essential") {
        setAnalyticsAllowed(false);
        setAdsAllowed(false);
      }
    }

    const openHandler = () => {
      setVisible(true);
      setShowSettingsModal(true);
    };

    window.addEventListener("aier_open_cookie_settings", openHandler);
    return () => window.removeEventListener("aier_open_cookie_settings", openHandler);
  }, []);

  const saveConsent = (choice: CookieConsentChoice) => {
    try {
      localStorage.setItem("aier_cookie_consent", choice);
      localStorage.setItem("aier_cookie_consent_date", new Date().toISOString());
      document.cookie = `aier_cookie_consent=${choice};path=/;max-age=31536000;SameSite=Lax`;
    } catch {}
    setVisible(false);
    setShowSettingsModal(false);
  };

  const handleAcceptAll = () => {
    setAnalyticsAllowed(true);
    setAdsAllowed(true);
    saveConsent("all");
  };

  const handleEssentialOnly = () => {
    setAnalyticsAllowed(false);
    setAdsAllowed(false);
    saveConsent("essential");
  };

  const handleSaveCustom = () => {
    const choice = analyticsAllowed && adsAllowed ? "all" : "essential";
    saveConsent(choice);
  };

  if (!mounted || !visible) return null;

  return (
    <aside
      aria-label="Cookie Consent Banner"
      className="fixed bottom-4 left-3 right-3 sm:bottom-6 sm:left-6 sm:right-auto sm:max-w-md z-[60] animate-in fade-in slide-in-from-bottom-5 duration-300"
    >
      <div className="rounded-2xl border border-slate-200 bg-white/95 backdrop-blur-md p-4 sm:p-5 shadow-2xl shadow-slate-900/15 text-slate-800">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-teal-50 text-teal-600 border border-teal-100">
              <Cookie className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Cookie & Privacy Preferences</h3>
              <p className="text-[11px] text-slate-500 font-medium">All India Exam Result</p>
            </div>
          </div>
          <button
            onClick={() => handleEssentialOnly()}
            className="rounded-lg p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
            aria-label="Dismiss cookie notice"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {!showSettingsModal ? (
          <>
            <p className="mt-3 text-xs leading-relaxed text-slate-600">
              We use cookies to enhance your browsing experience, measure site traffic, and deliver relevant advertisements via Google AdSense. You can accept all cookies or choose essential cookies only.
            </p>
            <div className="mt-2 text-[11px] text-slate-500">
              Read our{" "}
              <Link href="/cookies-policy" className="font-semibold text-teal-600 underline hover:text-teal-700">
                Cookies Policy
              </Link>{" "}
              and{" "}
              <Link href="/privacy-policy" className="font-semibold text-teal-600 underline hover:text-teal-700">
                Privacy Policy
              </Link>.
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-2 pt-1 border-t border-slate-100">
              <button
                onClick={handleAcceptAll}
                className="flex-1 rounded-xl bg-teal-600 px-3.5 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-teal-700 active:scale-95"
              >
                Accept All
              </button>
              <button
                onClick={handleEssentialOnly}
                className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-100 active:scale-95"
              >
                Essential Only
              </button>
              <button
                onClick={() => setShowSettingsModal(true)}
                className="rounded-xl px-2.5 py-2 text-xs font-medium text-slate-500 underline transition hover:text-slate-800"
              >
                Customize
              </button>
            </div>
          </>
        ) : (
          <div className="mt-3 space-y-3">
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between rounded-xl bg-slate-50 p-2.5 border border-slate-100">
                <div>
                  <span className="font-bold text-slate-800">Necessary Cookies</span>
                  <p className="text-[10px] text-slate-500">Required for security, navigation & session management.</p>
                </div>
                <span className="text-[10px] font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200">
                  Always Active
                </span>
              </div>

              <div className="flex items-center justify-between rounded-xl bg-slate-50 p-2.5 border border-slate-100">
                <div>
                  <span className="font-bold text-slate-800">Analytics & Performance</span>
                  <p className="text-[10px] text-slate-500">Anonymized statistics (Google Analytics).</p>
                </div>
                <input
                  type="checkbox"
                  checked={analyticsAllowed}
                  onChange={(e) => setAnalyticsAllowed(e.target.checked)}
                  className="h-4 w-4 rounded text-teal-600 focus:ring-teal-500 cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between rounded-xl bg-slate-50 p-2.5 border border-slate-100">
                <div>
                  <span className="font-bold text-slate-800">Advertising & AdSense</span>
                  <p className="text-[10px] text-slate-500">Google AdSense personalized/contextual ads.</p>
                </div>
                <input
                  type="checkbox"
                  checked={adsAllowed}
                  onChange={(e) => setAdsAllowed(e.target.checked)}
                  className="h-4 w-4 rounded text-teal-600 focus:ring-teal-500 cursor-pointer"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={handleSaveCustom}
                className="flex-1 rounded-xl bg-teal-600 px-3 py-2 text-xs font-bold text-white transition hover:bg-teal-700"
              >
                Save Preferences
              </button>
              <button
                onClick={() => setShowSettingsModal(false)}
                className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-50"
              >
                Back
              </button>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
