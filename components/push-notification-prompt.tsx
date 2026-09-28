"use client";

import { useEffect, useState } from "react";
import { Bell, BellOff, X } from "lucide-react";

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = atob(base64);
  return new Uint8Array(rawData.length).map((_, i) => rawData.charCodeAt(i));
}

export function PushNotificationPrompt() {
  const [status, setStatus] = useState<"idle" | "denied" | "subscribed" | "loading">("idle");
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if ("Notification" in window && Notification.permission === "granted") {
      setStatus("subscribed");
    } else if ("Notification" in window && Notification.permission === "denied") {
      setStatus("denied");
    }
  }, []);

  async function subscribe() {
    if (!("Notification" in window) || !("serviceWorker" in navigator)) return;
    setStatus("loading");
    try {
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        setStatus("denied");
        return;
      }
      const reg = await navigator.serviceWorker.register("/sw.js");
      const keyRes = await fetch("/api/push/keys");
      const { publicKey } = await keyRes.json();
      if (!publicKey) throw new Error("No VAPID key");
      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicKey),
      });
      await fetch("/api/push/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(sub.toJSON()),
      });
      setStatus("subscribed");
    } catch {
      setStatus("idle");
    }
  }

  async function unsubscribe() {
    try {
      const reg = await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.getSubscription();
      if (sub) {
        await fetch("/api/push/unsubscribe", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ endpoint: sub.endpoint }),
        });
        await sub.unsubscribe();
      }
      setStatus("idle");
    } catch {}
  }

  if (dismissed || status === "subscribed") return null;

  if (status === "denied") {
    return (
      <div className="fixed bottom-4 right-4 z-50 max-w-xs rounded-xl border border-amber-200 bg-amber-50 p-4 shadow-lg">
        <button onClick={() => setDismissed(true)} className="absolute right-2 top-2 text-amber-400 hover:text-amber-600"><X className="h-4 w-4" /></button>
        <div className="flex items-center gap-2 text-amber-800">
          <BellOff className="h-5 w-5" />
          <p className="text-sm font-medium">Notifications blocked</p>
        </div>
        <p className="mt-1 text-xs text-amber-600">Enable in browser settings to get exam alerts.</p>
      </div>
    );
  }

  if (status === "loading") return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-xs rounded-xl border border-indigo-200 bg-white p-4 shadow-lg">
      <button onClick={() => setDismissed(true)} className="absolute right-2 top-2 text-slate-400 hover:text-slate-600"><X className="h-4 w-4" /></button>
      <div className="flex items-center gap-2">
        <Bell className="h-5 w-5 text-indigo-600" />
        <p className="text-sm font-bold text-ink">Get Exam Alerts</p>
      </div>
      <p className="mt-1 text-xs text-slate-500">Instant notifications for results, admit cards & jobs.</p>
      <button onClick={subscribe} className="mt-3 w-full rounded-lg bg-indigo-600 py-2 text-xs font-bold text-white hover:bg-indigo-700 active:scale-[0.98]">
        Enable Notifications
      </button>
    </div>
  );
}
