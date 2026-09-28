"use client";

import { useState } from "react";
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { IndianRupee, Calculator } from "lucide-react";
import { cn } from "@/lib/utils";

const exams = [
  { name: "SSC CGL", gen: 100, obc: 0, sc: 0, st: 0, female: 0 },
  { name: "SSC CHSL", gen: 100, obc: 0, sc: 0, st: 0, female: 0 },
  { name: "SSC MTS", gen: 100, obc: 0, sc: 0, st: 0, female: 0 },
  { name: "RRB NTPC", gen: 500, obc: 250, sc: 125, st: 125, female: 0 },
  { name: "RRB Group D", gen: 500, obc: 250, sc: 125, st: 125, female: 0 },
  { name: "IBPS PO", gen: 850, obc: 425, sc: 175, st: 175, female: 175 },
  { name: "IBPS Clerk", gen: 850, obc: 425, sc: 175, st: 175, female: 175 },
  { name: "SBI PO", gen: 750, obc: 375, sc: 125, st: 125, female: 0 },
  { name: "UPSC CSE", gen: 100, obc: 0, sc: 0, st: 0, female: 0 },
  { name: "CTET", gen: 1000, obc: 500, sc: 500, st: 500, female: 500 },
];

export default function FeeCalculatorPage() {
  const [exam, setExam] = useState("SSC CGL");
  const [cat, setCat] = useState("General");
  const [gender, setGender] = useState("Male");

  const e = exams.find((x) => x.name === exam);
  const baseFee = e ? (cat === "General" ? e.gen : cat === "OBC" ? e.obc : cat === "SC" ? e.sc : cat === "ST" ? e.st : e.gen) : 0;
  const femaleDiscount = gender === "Female" && e?.female !== undefined ? baseFee - e.female : 0;
  const fee = gender === "Female" ? (e?.female ?? baseFee) : baseFee;

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-br from-gray-50 to-teal-50 pb-20">
        <div className="container-page py-8 sm:py-12">
          <div className="mx-auto max-w-2xl">
            <div className="mb-8 text-center">
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">Fee Calculator</h1>
              <p className="mt-2 text-gray-500 text-sm">Category & gender ke hisaab se application fee dekhein</p>
            </div>

            <div className="rounded-2xl bg-white border border-gray-100 p-6 shadow-lg space-y-5">
              <div>
                <label className="text-sm font-bold text-gray-700 mb-2 flex items-center gap-1.5"><Calculator className="h-4 w-4 text-brand" /> Select Exam</label>
                <select value={exam} onChange={(e) => setExam(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm outline-none focus:border-brand">
                  {exams.map((x) => <option key={x.name}>{x.name}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-bold text-gray-700 mb-2">Category</label>
                  <div className="flex flex-wrap gap-1.5">
                    {["General", "OBC", "SC", "ST"].map((c) => (
                      <button key={c} onClick={() => setCat(c)}
                        className={cn("rounded-full px-3 py-1.5 text-xs font-semibold border transition",
                          cat === c ? "bg-brand text-white border-brand" : "bg-white text-gray-600 border-gray-200"
                        )}>{c}</button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-bold text-gray-700 mb-2">Gender</label>
                  <div className="flex gap-2">
                    {["Male", "Female"].map((g) => (
                      <button key={g} onClick={() => setGender(g)}
                        className={cn("flex-1 rounded-xl px-4 py-2.5 text-sm font-semibold border transition",
                          gender === g ? "bg-brand text-white border-brand" : "bg-white text-gray-600 border-gray-200"
                        )}>{g}</button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-5 rounded-xl bg-gradient-to-r from-brand to-emerald-700 p-6 text-white text-center shadow-lg">
              <IndianRupee className="mx-auto h-8 w-8 text-white/70" />
              <p className="text-sm text-white/70 mt-1">Application Fee</p>
              <p className="text-4xl font-black mt-1">₹{fee.toLocaleString()}</p>
              {gender === "Female" && femaleDiscount > 0 && (
                <p className="text-xs text-white/60 mt-1">Female concession applied (₹{femaleDiscount} discount)</p>
              )}
              {fee === 0 && <p className="text-xs text-white/60 mt-1">Free for your category</p>}
            </div>

            <p className="mt-3 text-xs text-gray-400 text-center">*Fees are approximate. Check official notification for exact amount.</p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
