"use client";

import { Sparkles } from "lucide-react";
import { useState } from "react";

export default function AiGeneratorPage() {
  const [prompt, setPrompt] = useState("");

  return (
    <main className="min-h-screen bg-slate-50 p-4">
      <div className="mx-auto max-w-6xl">
        <div className="rounded-[2rem] bg-ink p-6 text-white">
          <Sparkles className="h-9 w-9 text-saffron" />
          <h1 className="mt-4 text-4xl font-black">AI Post Generator</h1>
          <p className="mt-2 text-slate-300">Generate human-written exam posts in English and Hindi with SEO title, meta description, FAQs, tags and JSON-LD.</p>
        </div>
        <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_360px]">
          <section className="rounded-2xl border border-slate-200 bg-white p-5">
            <label className="font-black text-ink">Notification or raw details</label>
            <textarea value={prompt} onChange={(event) => setPrompt(event.target.value)} className="mt-3 min-h-72 w-full rounded-2xl border border-slate-200 p-4 outline-none focus:border-brand" placeholder="Paste official notification details here..." />
            <div className="mt-4 flex flex-wrap gap-3">
              {["Generate with AI", "Humanize Content", "SEO Optimize", "Generate Hindi + English"].map((action) => (
                <button key={action} className="rounded-full bg-brand px-4 py-2 text-sm font-black text-white transition hover:bg-blue-700">{action}</button>
              ))}
            </div>
          </section>
          <aside className="rounded-2xl border border-slate-200 bg-white p-5">
            <h2 className="text-xl font-black text-ink">Output checklist</h2>
            {["SEO title", "Meta description", "Slug", "FAQ accordion", "Tags", "Schema markup", "Important links"].map((item) => (
              <label key={item} className="mt-4 flex items-center gap-3 text-sm font-bold text-slate-700">
                <input type="checkbox" defaultChecked className="h-4 w-4 accent-brand" /> {item}
              </label>
            ))}
          </aside>
        </div>
      </div>
    </main>
  );
}
