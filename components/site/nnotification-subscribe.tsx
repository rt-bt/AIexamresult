"use client";

import { useState } from "react";
import { Bell, Mail, CheckCircle, Loader2 } from "lucide-react";

const categories = [
  { id: "results", label: "Results" },
  { id: "admit-cards", label: "Admit Cards" },
  { id: "jobs", label: "Job Notifications" },
  { id: "answer-keys", label: "Answer Keys" },
];

export function NotificationSubscribe() {
  const [email, setEmail] = useState("");
  const [cats, setCats] = useState<string[]>(["results", "jobs"]);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setStatus("loading");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, categories: cats }),
      });
      const data = await res.json();
      if (res.ok) {
        setStatus("success");
        setMessage(data.message);
        setEmail("");
      } else {
        setStatus("error");
        setMessage(data.error);
      }
    } catch {
      setStatus("error");
      setMessage("Network error. Try again.");
    }
  }

  function toggleCat(id: string) {
    setCats((prev) => prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]);
  }

  return (
    <section className="bg-gradient-to-b from-white to-[#eef2ff] py-12">
      <div className="container-page">
        <div className="mx-auto max-w-2xl rounded-2xl border border-indigo-100 bg-white p-6 shadow-lg shadow-indigo-5 sm:p-8">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100">
              <Bell className="h-5 w-5 text-indigo-600" />
            </span>
            <div>
              <h2 className="text-lg font-black text-ink">Get Instant Updates</h2>
              <p className="text-sm text-slate-500">Subscribe for exam results, admit cards and job alerts</p>
            </div>
          </div>

          {status === "success" ? (
            <div className="mt-6 rounded-xl bg-green-50 border border-green-200 p-5 text-center">
              <CheckCircle className="mx-auto h-8 w-8 text-green-500" />
              <p className="mt-2 font-semibold text-green-800">{message}</p>
              <p className="mt-1 text-sm text-green-600">We&apos;ll notify you as soon as new updates are published.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-5 space-y-4">
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  required
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
              </div>

              <div>
                <p className="text-xs font-medium text-slate-500 mb-2">Notify me about:</p>
                <div className="flex flex-wrap gap-2">
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => toggleCat(cat.id)}
                      className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                        cats.includes(cat.id)
                          ? "bg-indigo-600 text-white"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={status === "loading"}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 px-6 py-3 text-sm font-bold text-white shadow-md shadow-indigo-200 transition hover:from-indigo-500 hover:to-indigo-400 active:scale-[0.98] disabled:opacity-60"
              >
                {status === "loading" ? (
                  <><Loader2 className="h-4 w-4 animate-spin" /> Subscribing...</>
                ) : (
                  <><Bell className="h-4 w-4" /> Subscribe for Updates</>
                )}
              </button>

              {status === "error" && (
                <p className="text-sm text-red-600 text-center">{message}</p>
              )}
            </form>
          )}

          <p className="mt-4 text-xs text-slate-400 text-center">
            No spam. Unsubscribe anytime. Your email is stored securely.
          </p>
        </div>
      </div>
    </section>
  );
}
