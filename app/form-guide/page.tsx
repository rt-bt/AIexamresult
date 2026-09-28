"use client";

import { useState } from "react";
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { CheckCircle, FileText, Upload, Camera, ClipboardList, CreditCard, Download, Send } from "lucide-react";
import { cn } from "@/lib/utils";

const steps = [
  { icon: FileText, title: "1. Notification Check", desc: "Read full notification PDF. Check eligibility, age, fee, dates." },
  { icon: Camera, title: "2. Photo & Signature Ready", desc: "Photo: ≤200KB, ≤512x512px. Signature: ≤100KB, ≤300x100px. White background." },
  { icon: Upload, title: "3. Documents Scanned", desc: "Keep scanned copies ready: 10th/12th marksheet, graduation degree, ID proof (Aadhaar/PAN), caste certificate, domicile." },
  { icon: ClipboardList, title: "4. Fill Online Form", desc: "Visit official portal. Fill personal, education, address details carefully. Preview before submit." },
  { icon: CreditCard, title: "5. Pay Application Fee", desc: "Pay via debit/credit card, net banking, or UPI. Keep transaction ID." },
  { icon: Camera, title: "6. Upload Documents", desc: "Upload photo, signature, scanned docs in specified format & size." },
  { icon: Send, title: "7. Final Submit", desc: "Click final submit. Take printout of confirmation page with application number." },
  { icon: Download, title: "8. Download Admit Card", desc: "Admit card releases 2-3 weeks before exam. Download & verify all details." },
];

export default function FormGuidePage() {
  const [active, setActive] = useState(0);

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-br from-gray-50 to-teal-50 pb-20">
        <div className="container-page py-8 sm:py-12">
          <div className="mx-auto max-w-3xl">
            <div className="mb-8 text-center">
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">Form Filling Guide</h1>
              <p className="mt-2 text-gray-500 text-sm">Step-by-step guide for filling government job application forms</p>
            </div>

            {/* Progress */}
            <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
              {steps.map((s, i) => (
                <button key={i} onClick={() => setActive(i)}
                  className={cn("shrink-0 rounded-full px-3 py-1.5 text-xs font-bold border transition",
                    i === active ? "bg-brand text-white border-brand" : i < active ? "bg-emerald-50 text-emerald-600 border-emerald-200" : "bg-white text-gray-400 border-gray-200"
                  )}>
                  {i < active ? <CheckCircle className="inline h-3 w-3 mr-0.5" /> : null}
                  Step {i + 1}
                </button>
              ))}
            </div>

            {/* Active Step */}
            <div className="rounded-2xl bg-white border border-gray-100 p-6 shadow-lg">
              {(() => {
                const s = steps[active];
                const Icon = s.icon;
                return (
                  <div className="text-center">
                    <Icon className="mx-auto h-12 w-12 text-brand mb-3" />
                    <h2 className="text-xl font-bold text-gray-800">{s.title}</h2>
                    <p className="text-sm text-gray-500 mt-2 leading-relaxed max-w-lg mx-auto">{s.desc}</p>
                  </div>
                );
              })()}
              <div className="flex justify-between mt-6">
                <button disabled={active === 0} onClick={() => setActive(Math.max(0, active - 1))}
                  className={cn("rounded-xl px-5 py-2 text-sm font-bold border transition", active === 0 ? "border-gray-100 text-gray-300" : "border-gray-200 text-gray-600 hover:border-brand/30")}>Previous</button>
                <button onClick={() => setActive(Math.min(steps.length - 1, active + 1))}
                  className={cn("rounded-xl px-5 py-2 text-sm font-bold transition",
                    active === steps.length - 1 ? "bg-emerald-100 text-emerald-600" : "bg-brand text-white hover:bg-brand/90")}>
                  {active === steps.length - 1 ? "✅ Done" : "Next Step →"}
                </button>
              </div>
            </div>

            {/* Tips */}
            <div className="mt-4 rounded-xl bg-amber-50 border border-amber-100 p-4">
              <p className="text-xs font-bold text-amber-700 mb-1">💡 Pro Tips</p>
              <ul className="text-xs text-amber-600 space-y-1">
                <li>• Use latest Chrome/Firefox for best form experience</li>
                <li>• Keep a stable internet connection during submission</li>
                <li>{" "}• Don&apos;t wait for last day — avoid server rush</li>
                <li>• Save application number & password immediately</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
