"use client";

import { useState } from "react";
import Link from "next/link";
import { RefreshCw, CheckCircle2, AlertCircle, ArrowLeft, Zap, ShieldCheck } from "lucide-react";

export default function AdminSyncPage() {
  const [secretKey, setSecretKey] = useState("sync2024secret");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "syncing" | "success" | "error">("idle");
  const [log, setLog] = useState<string[]>([]);

  const addLog = (msg: string) => {
    setLog((prev) => [...prev, `[${new Date().toLocaleTimeString("en-IN")}] ${msg}`]);
  };

  const handleSync = async () => {
    setLoading(true);
    setStatus("syncing");
    setLog([]);

    addLog("🚀 Starting Manual Sync...");

    try {
      // 1. Call trigger-sync API
      addLog("📡 Scraping SarkariExam & updating GitHub data...");
      const res = await fetch(`/api/trigger-sync?secret=${encodeURIComponent(secretKey)}`, {
        method: "GET",
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        throw new Error(data.error || "Failed to trigger sync");
      }

      addLog(`✅ GitHub Updated! Counts: ${JSON.stringify(data.counts)}`);

      // 2. Trigger Vercel Deploy Hook
      addLog("⚡ Triggering Vercel Production Deployment...");
      try {
        await fetch("https://api.vercel.com/v1/integrations/deploy/prj_cqllpAD5gXemlwOlswAzxCj9asDw/tQVf4ENFS7", {
          method: "POST",
        });
        addLog("✅ Vercel Deploy Hook Triggered!");
      } catch (deployErr) {
        addLog("⚠️ Deploy Hook note: Vercel auto-deploying via GitHub push.");
      }

      setStatus("success");
      addLog("🎉 SUCCESS! Fresh data synced. Website updating in ~2 mins.");
    } catch (err: any) {
      setStatus("error");
      addLog(`❌ ERROR: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-4 font-sans flex flex-col items-center justify-center">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <Link href="/admin/dashboard" className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white transition">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <span className="text-xs font-bold px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5" /> Mobile Sync Console
          </span>
        </div>

        {/* Title */}
        <div className="text-center space-y-2">
          <div className="w-16 h-16 bg-gradient-to-tr from-teal-500 to-emerald-400 rounded-2xl mx-auto flex items-center justify-center shadow-lg shadow-teal-500/20">
            <Zap className="w-8 h-8 text-slate-950 stroke-[2.5]" />
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">AI Exam Result</h1>
          <p className="text-xs text-slate-400">1-Tap Sarkari Result Sync for Mobile</p>
        </div>

        {/* Secret Key Input */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-400">Sync Security Secret</label>
          <input
            type="password"
            value={secretKey}
            onChange={(e) => setSecretKey(e.target.value)}
            placeholder="Enter Sync Secret Key"
            className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-sm font-mono text-emerald-400 focus:outline-none focus:border-teal-500"
          />
        </div>

        {/* Big Action Button */}
        <button
          onClick={handleSync}
          disabled={loading}
          className={`w-full py-4 px-6 rounded-2xl font-black text-base flex items-center justify-center gap-3 transition-all duration-200 shadow-xl ${
            loading
              ? "bg-slate-800 text-slate-500 cursor-not-allowed"
              : status === "success"
              ? "bg-emerald-500 text-slate-950 hover:bg-emerald-400 active:scale-[0.98]"
              : "bg-teal-500 text-slate-950 hover:bg-teal-400 active:scale-[0.98] shadow-teal-500/25"
          }`}
        >
          <RefreshCw className={`w-5 h-5 ${loading ? "animate-spin" : ""}`} />
          {loading ? "Syncing Latest Data..." : "SYNC NOW"}
        </button>

        {/* Status Alert */}
        {status === "success" && (
          <div className="p-4 bg-emerald-950/60 border border-emerald-800/60 rounded-2xl flex items-start gap-3 text-emerald-300 text-xs">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-emerald-200">Sync Completed Successfully!</p>
              <p className="mt-0.5 text-emerald-400/80">SarkariExam data scraped and committed. Vercel deployment triggered.</p>
            </div>
          </div>
        )}

        {status === "error" && (
          <div className="p-4 bg-rose-950/60 border border-rose-800/60 rounded-2xl flex items-start gap-3 text-rose-300 text-xs">
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-rose-200">Sync Failed</p>
              <p className="mt-0.5 text-rose-400/80">Please check your Secret Key or Vercel GH_TOKEN settings.</p>
            </div>
          </div>
        )}

        {/* Console Log Window */}
        {log.length > 0 && (
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 text-xs font-mono space-y-1.5 max-h-48 overflow-y-auto">
            <p className="text-[10px] uppercase font-bold tracking-wider text-slate-500 pb-1 border-b border-slate-900">
              Live Console Output
            </p>
            {log.map((line, idx) => (
              <div key={idx} className="text-slate-300 break-words leading-relaxed">
                {line}
              </div>
            ))}
          </div>
        )}

        {/* Footer instructions */}
        <div className="text-center pt-2">
          <p className="text-[11px] text-slate-500 leading-relaxed">
            💡 <strong className="text-slate-400">Android App Tip:</strong> Open <span className="text-teal-400">https://www.aiexamresult.com/admin/sync</span> in Chrome on mobile, tap <span className="text-teal-400">⋮ Menu</span> → <span className="text-teal-400">Add to Home Screen</span> to install as a 1-tap App!
          </p>
        </div>

      </div>
    </main>
  );
}
