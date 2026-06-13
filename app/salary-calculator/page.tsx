"use client";

import { useState } from "react";
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { IndianRupee, Calculator, TrendingUp, Building, Home, Plus } from "lucide-react";

const payScales = [
  { name: "Level 1 (SSC MTS / Group D)", basic: 18000, da: 53, hra: { X: 24, Y: 16, Z: 8 } },
  { name: "Level 2 (SSC GD / Clerk)", basic: 19900, da: 53, hra: { X: 24, Y: 16, Z: 8 } },
  { name: "Level 3 (SSC CHSL / IBPS Clerk)", basic: 21700, da: 53, hra: { X: 24, Y: 16, Z: 8 } },
  { name: "Level 4 (SSC CGL / IBPS PO)", basic: 25500, da: 53, hra: { X: 24, Y: 16, Z: 8 } },
  { name: "Level 5 (SSC CGL / RRB NTPC)", basic: 29200, da: 53, hra: { X: 24, Y: 16, Z: 8 } },
  { name: "Level 6 (SSC CGL / SBI PO)", basic: 35400, da: 53, hra: { X: 24, Y: 16, Z: 8 } },
  { name: "Level 7 (AAI JE / Asst)", basic: 44900, da: 53, hra: { X: 24, Y: 16, Z: 8 } },
  { name: "Level 8 (UPSC / IRS)", basic: 47600, da: 53, hra: { X: 24, Y: 16, Z: 8 } },
  { name: "Level 10 (IAS / IPS Entry)", basic: 56100, da: 53, hra: { X: 24, Y: 16, Z: 8 } },
  { name: "Level 12 (IAS Senior Scale)", basic: 78800, da: 53, hra: { X: 24, Y: 16, Z: 8 } },
  { name: "Level 14 (IAS Selection Grade)", basic: 144200, da: 53, hra: { X: 24, Y: 16, Z: 8 } },
];

const CITY_TYPES = ["X (Metro)", "Y (City)", "Z (Town)"];

export default function SalaryCalculatorPage() {
  const [selectedLevel, setSelectedLevel] = useState(0);
  const [cityType, setCityType] = useState("X (Metro)");

  const level = payScales[selectedLevel];
  const cityKey = cityType.charAt(0) as "X" | "Y" | "Z";
  const hraPct = level.hra[cityKey];
  const daAmount = Math.round(level.basic * level.da / 100);
  const hraAmount = Math.round(level.basic * hraPct / 100);
  const gross = level.basic + daAmount + hraAmount;
  const pf = Math.round(level.basic * 12 / 100);
  const inHand = gross - pf;
  const annual = inHand * 12;

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-br from-gray-50 to-teal-50 pb-20">
        <div className="container-page py-8 sm:py-12">
          <div className="mx-auto max-w-3xl">
            <div className="mb-8 text-center">
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">Salary Calculator</h1>
              <p className="mt-2 text-gray-500 text-sm">Basic pay + DA + HRA + allowances ke basis par approximate in-hand salary dekhein</p>
            </div>

            <div className="rounded-2xl bg-white border border-gray-100 p-6 shadow-lg">
              <div className="space-y-5">
                <div>
                  <label className="text-sm font-bold text-gray-700 mb-2 flex items-center gap-1.5"><TrendingUp className="h-4 w-4 text-brand" /> Pay Level</label>
                  <select value={selectedLevel} onChange={(e) => setSelectedLevel(Number(e.target.value))}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm outline-none focus:border-brand">
                    {payScales.map((p, i) => <option key={i} value={i}>{p.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-bold text-gray-700 mb-2 flex items-center gap-1.5"><Building className="h-4 w-4 text-brand" /> City Type</label>
                  <div className="flex gap-2">
                    {CITY_TYPES.map((c) => (
                      <button key={c} onClick={() => setCityType(c)}
                        className={`flex-1 rounded-xl border px-4 py-2.5 text-sm font-semibold transition ${
                          cityType === c ? "bg-brand text-white border-brand" : "bg-white text-gray-600 border-gray-200 hover:border-brand/30"
                        }`}>{c}</button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Results */}
              <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { label: "Basic Pay", value: `₹${level.basic.toLocaleString()}`, icon: IndianRupee, color: "text-brand" },
                  { label: "DA (${level.da}%)", value: `₹${daAmount.toLocaleString()}`, icon: TrendingUp, color: "text-orange-500" },
                  { label: "HRA (${hraPct}%)", value: `₹${hraAmount.toLocaleString()}`, icon: Home, color: "text-purple-500" },
                  { label: "PF Deduction", value: `-₹${pf.toLocaleString()}`, icon: Calculator, color: "text-red-500" },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.label} className="rounded-xl bg-gray-50 p-3 text-center">
                      <Icon className={`mx-auto h-5 w-5 ${item.color}`} />
                      <p className="text-xs text-gray-400 mt-1">{item.label}</p>
                      <p className="text-sm font-bold text-gray-800 mt-0.5">{item.value}</p>
                    </div>
                  );
                })}
              </div>

              {/* Total */}
              <div className="mt-5 rounded-xl bg-gradient-to-r from-brand to-emerald-700 p-5 text-white text-center shadow-lg">
                <p className="text-sm text-white/70">Estimated In-Hand Salary</p>
                <p className="text-3xl font-black mt-1">₹{inHand.toLocaleString()}/month</p>
                <p className="text-xs text-white/60 mt-1">≈ ₹{annual.toLocaleString()}/year</p>
              </div>

              <p className="mt-3 text-xs text-gray-400 text-center">*This is an approximate calculation. Actual salary may vary based on allowances, deductions & location.</p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
