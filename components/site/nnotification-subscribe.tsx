"use client";

import { useState } from "react";
import { Bell, Mail, CheckCircle, Loader2, ShieldCheck, Sparkles } from "lucide-react";

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
    <section className="bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-900 py-16 sm:py-20">
      <div className="container-page">
        <div className="relative mx-auto max-w-2xl overflow-hidden rounded-2xl border border-indigo-100 bg-white dark:border-indigo-900 dark:bg-slate-800 shadow-xl shadow-indigo-100/40 dark:shadow-indigo-900/20 sm:rounded-3xl">
          <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-indigo-100/50 dark:bg-indigo-900/30 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 h-40 w-40 rounded-full bg-indigo-100/30 dark:bg-indigo-900/20 blur-3xl" />
          <div className="relative px-6 py-8 sm:px-10 sm:py-10">
            <div className="flex items-center gap-4">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-600 shadow-lg shadow-indigo-200 dark:shadow-indigo-900/30">
                <Bell className="h-6 w-6 text-white" />
              </span>
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Get Instant Updates</h2>
                <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">Subscribe for exam results, admit cards and job alerts</p>
              </div>
            </div>

            {status === "success" ? (
              <div className="mt-6 rounded-xl bg-green-50 dark:bg-green-900/30 p-6 text-center sm:p-8">
                <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/50">
                  <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
                </span>
                <p className="mt-3 text-lg font-bold text-green-800 dark:text-green-200">{message}</p>
                <p className="mt-1 text-sm text-green-600 dark:text-green-400">We&apos;ll notify you as soon as new updates are published.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-6 space-y-5">
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    required
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-12 pr-4 text-sm outline-none transition-colors placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100/50 dark:border-slate-700 dark:bg-slate-900 dark:focus:bg-slate-800 dark:focus:ring-indigo-900/50"
                  />
                </div>

                <div>
                  <p className="mb-3 text-sm font-medium text-slate-600 dark:text-slate-300">Notify me about:</p>
                  <div className="flex flex-wrap gap-2.5">
                    {categories.map((cat) => (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => toggleCat(cat.id)}
                        className={`rounded-lg px-4 py-2 text-sm font-semibold transition-all ${
                          cats.includes(cat.id)
                            ? "bg-indigo-600 text-white shadow-sm shadow-indigo-200 dark:shadow-indigo-900/30"
                            : "border border-slate-200 bg-white text-slate-600 hover:border-indigo-200 hover:bg-indigo-50 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-300 dark:hover:border-indigo-600 dark:hover:bg-slate-600"
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
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-indigo-200 dark:shadow-indigo-900/30 transition-all hover:shadow-xl hover:shadow-indigo-200 hover:-translate-y-0.5 active:scale-[0.98] disabled:opacity-60"
                >
                  {status === "loading" ? (
                    <><Loader2 className="h-4 w-4 animate-spin" /> Subscribing...</>
                  ) : (
                    <><Sparkles className="h-4 w-4" /> Subscribe for Updates</>
                  )}
                </button>

                {status === "error" && (
                  <p className="text-sm text-red-600 text-center">{message}</p>
                )}
              </form>
            )}

            <div className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-400">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>No spam. Unsubscribe anytime. Your email is stored securely.</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}