"use client";

import { useState } from "react";
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { AlertTriangle, CalendarDays, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

const objections = [
  { exam: "SSC CGL 2025", lastDate: "July 15, 2026", fee: "₹100/question", portal: "ssc.nic.in", status: "Open" },
  { exam: "SSC CHSL 2024", lastDate: "Jan 20, 2026", fee: "₹100/question", portal: "ssc.nic.in", status: "Closed" },
  { exam: "RRB NTPC 2024", lastDate: "Feb 10, 2026", fee: "Free", portal: "rrbapply.gov.in", status: "Closed" },
  { exam: "IBPS PO 2025", lastDate: "Dec 30, 2025", fee: "₹200/question", portal: "ibps.in", status: "Closed" },
  { exam: "UPSC CSE 2025", lastDate: "Pending", fee: "TBD", portal: "upsc.gov.in", status: "Pending" },
  { exam: "CTET 2026", lastDate: "Pending", fee: "₹100/question", portal: "ctet.nic.in", status: "Pending" },
];

const process = [
  { step: "1", title: "Download Answer Key", desc: "Visit official website & download the provisional answer key PDF." },
  { step: "2", title: "Check Your Answers", desc: "Match your marked answers with the official answer key." },
  { step: "3", title: "Identify Discrepancies", desc: "Note questions where your answer differs from official key." },
  { step: "4", title: "Login to Objection Portal", desc: "Use your application number & password to login." },
  { step: "5", title: "Submit with Evidence", desc: "Select question & submit with supporting proof (textbook reference, PDF)." },
  { step: "6", title: "Pay Fee (if any)", desc: "Pay per-question objection fee online." },
  { step: "7", title: "Download Receipt", desc: "Save confirmation for future reference." },
];

export default function ObjectionTrackerPage() {
  const statusColors: Record<string, string> = { Open: "bg-emerald-100 text-emerald-700", Closed: "bg-red-100 text-red-700", Pending: "bg-amber-100 text-amber-700" };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-br from-gray-50 to-teal-50 pb-20">
        <div className="container-page py-8 sm:py-12">
          <div className="mx-auto max-w-3xl">
            <div className="mb-8 text-center">
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">Objection Tracker</h1>
              <p className="mt-2 text-gray-500 text-sm">Answer key objection dates, process & portal links</p>
            </div>

            {/* Status Table */}
            <div className="rounded-2xl bg-white border border-gray-100 p-6 shadow-lg overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-400 text-xs uppercase border-b border-gray-100">
                    <th className="pb-3 font-bold">Exam</th>
                    <th className="pb-3 font-bold">Last Date</th>
                    <th className="pb-3 font-bold">Fee</th>
                    <th className="pb-3 font-bold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {objections.map((o) => (
                    <tr key={o.exam} className="border-b border-gray-50">
                      <td className="py-3 font-semibold text-gray-800">{o.exam}</td>
                      <td className="py-3 text-gray-500">{o.lastDate}</td>
                      <td className="py-3 text-gray-500">{o.fee}</td>
                      <td className="py-3"><span className={cn("rounded-full px-2.5 py-0.5 text-xs font-bold", statusColors[o.status])}>{o.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Process */}
            <div className="mt-6 rounded-2xl bg-white border border-gray-100 p-6 shadow-lg">
              <h2 className="text-sm font-bold text-gray-800 mb-4 flex items-center gap-1.5"><AlertTriangle className="h-4 w-4 text-brand" /> How to Raise Objection</h2>
              <div className="space-y-3">
                {process.map((p) => (
                  <div key={p.step} className="flex gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand/10 text-xs font-bold text-brand">{p.step}</span>
                    <div>
                      <p className="text-sm font-bold text-gray-700">{p.title}</p>
                      <p className="text-xs text-gray-400">{p.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 rounded-xl bg-amber-50 border border-amber-100 p-4">
              <p className="text-xs text-amber-700">💡 Keep scanned copy of reference books / PDFs ready before submitting objections.</p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
