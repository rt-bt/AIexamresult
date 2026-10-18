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
    <section className="bg-white py-14 font-sans border-b border-[#DEDEDE]">
      <div className="container-page">
        <div className="mx-auto max-w-2xl rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] p-6 shadow-sm sm:p-8">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#343A46] text-[#F28A2E] shadow-sm">
              <Bell className="h-5 w-5" />
            </span>
            <div>
              <h2 className="text-lg font-bold text-[#172033] font-heading">Get Instant Updates</h2>
              <p className="text-xs sm:text-sm text-[#8B8F96] font-sans">Subscribe for instant exam results, admit cards and job alerts</p>
            </div>
          </div>

          {status === "success" ? (
            <div className="mt-6 rounded-xl bg-emerald-50 border border-emerald-200 p-5 text-center">
              <CheckCircle className="mx-auto h-8 w-8 text-emerald-600" />
              <p className="mt-2 font-bold text-emerald-900 font-heading">{message}</p>
              <p className="mt-1 text-xs text-emerald-700">We&apos;ll notify you as soon as new updates are published.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  required
                  className="w-full rounded-xl border border-[#E2E8F0] bg-white py-3 pl-10 pr-4 text-sm font-medium text-[#172033] outline-none transition focus:border-[#F28A2E] focus:ring-1 focus:ring-[#F28A2E]"
                />
              </div>

              <div>
                <p className="text-xs font-bold text-[#172033] mb-2 font-heading">Notify me about:</p>
                <div className="flex flex-wrap gap-2">
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => toggleCat(cat.id)}
                      className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                        cats.includes(cat.id)
                          ? "bg-[#343A46] text-[#F28A2E] shadow-sm"
                          : "bg-white border border-[#E2E8F0] text-[#172033] hover:border-[#343A46]"
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
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#F28A2E] hover:bg-[#FF9E42] px-6 py-3 text-sm font-bold text-white shadow-md shadow-black/10 transition active:scale-[0.98] disabled:opacity-60 font-heading"
              >
                {status === "loading" ? (
                  <><Loader2 className="h-4 w-4 animate-spin" /> Subscribing...</>
                ) : (
                  <><Bell className="h-4 w-4 text-white" /> Subscribe for Free Updates</>
                )}
              </button>

              {status === "error" && (
                <p className="text-xs text-red-600 text-center font-medium">{message}</p>
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
