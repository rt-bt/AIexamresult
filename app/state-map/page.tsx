"use client";

import { useState } from "react";
import Link from "next/link";
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { MapPin, ChevronRight, Search, Filter } from "lucide-react";
import { cn } from "@/lib/utils";

const states = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa",
  "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala",
  "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland",
  "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana",
  "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
  "Delhi", "Jammu & Kashmir",
];

const stateColors: Record<string, string> = {
  "Andhra Pradesh": "bg-red-100 text-red-700 border-red-200",
  "Arunachal Pradesh": "bg-orange-100 text-orange-700 border-orange-200",
  "Assam": "bg-amber-100 text-amber-700 border-amber-200",
  "Bihar": "bg-yellow-100 text-yellow-700 border-yellow-200",
  "Chhattisgarh": "bg-lime-100 text-lime-700 border-lime-200",
  "Goa": "bg-green-100 text-green-700 border-green-200",
  "Gujarat": "bg-emerald-100 text-emerald-700 border-emerald-200",
  "Haryana": "bg-teal-100 text-teal-700 border-teal-200",
  "Himachal Pradesh": "bg-cyan-100 text-cyan-700 border-cyan-200",
  "Jharkhand": "bg-sky-100 text-sky-700 border-sky-200",
  "Karnataka": "bg-blue-100 text-blue-700 border-blue-200",
  "Kerala": "bg-indigo-100 text-indigo-700 border-indigo-200",
  "Madhya Pradesh": "bg-violet-100 text-violet-700 border-violet-200",
  "Maharashtra": "bg-purple-100 text-purple-700 border-purple-200",
  "Manipur": "bg-fuchsia-100 text-fuchsia-700 border-fuchsia-200",
  "Meghalaya": "bg-pink-100 text-pink-700 border-pink-200",
  "Mizoram": "bg-rose-100 text-rose-700 border-rose-200",
  "Nagaland": "bg-red-100 text-red-700 border-red-200",
  "Odisha": "bg-orange-100 text-orange-700 border-orange-200",
  "Punjab": "bg-amber-100 text-amber-700 border-amber-200",
  "Rajasthan": "bg-yellow-100 text-yellow-700 border-yellow-200",
  "Sikkim": "bg-lime-100 text-lime-700 border-lime-200",
  "Tamil Nadu": "bg-green-100 text-green-700 border-green-200",
  "Telangana": "bg-emerald-100 text-emerald-700 border-emerald-200",
  "Tripura": "bg-teal-100 text-teal-700 border-teal-200",
  "Uttar Pradesh": "bg-cyan-100 text-cyan-700 border-cyan-200",
  "Uttarakhand": "bg-sky-100 text-sky-700 border-sky-200",
  "West Bengal": "bg-blue-100 text-blue-700 border-blue-200",
  "Delhi": "bg-indigo-100 text-indigo-700 border-indigo-200",
  "Jammu & Kashmir": "bg-violet-100 text-violet-700 border-violet-200",
};

const stateLinks: Record<string, { label: string; href: string }[]> = {
  "Uttar Pradesh": [
    { label: "UP Board Results", href: "/search?q=UP+Board" },
    { label: "UPPSC Jobs", href: "/search?q=UPPSC" },
    { label: "UP Police", href: "/search?q=UP+Police" },
    { label: "UPTET", href: "/search?q=UPTET" },
  ],
  "Bihar": [
    { label: "Bihar Board Results", href: "/search?q=Bihar+Board" },
    { label: "BPSC Jobs", href: "/search?q=BPSC" },
    { label: "Bihar Police", href: "/search?q=Bihar+Police" },
    { label: "Bihar Teacher", href: "/search?q=Bihar+Teacher" },
  ],
  "Maharashtra": [
    { label: "Maharashtra Board", href: "/search?q=Maharashtra+Board" },
    { label: "MPSC Jobs", href: "/search?q=MPSC" },
    { label: "Maharashtra Police", href: "/search?q=Maharashtra+Police" },
  ],
  "Rajasthan": [
    { label: "RBSE Board", href: "/search?q=RBSE" },
    { label: "RPSC Jobs", href: "/search?q=RPSC" },
    { label: "REET", href: "/search?q=REET" },
    { label: "Rajasthan Police", href: "/search?q=Rajasthan+Police" },
  ],
  "Delhi": [
    { label: "CBSE Board", href: "/search?q=CBSE" },
    { label: "SSC Jobs", href: "/search?q=SSC" },
    { label: "Delhi Govt Jobs", href: "/search?q=Delhi+Government" },
  ],
  "Tamil Nadu": [
    { label: "TN Board", href: "/search?q=Tamil+Nadu+Board" },
    { label: "TNPSC Jobs", href: "/search?q=TNPSC" },
    { label: "TN Police", href: "/search?q=Tamil+Nadu+Police" },
  ],
  "Karnataka": [
    { label: "Karnataka Board", href: "/search?q=Karnataka+Board" },
    { label: "KPSC Jobs", href: "/search?q=KPSC" },
    { label: "Karnataka Police", href: "/search?q=Karnataka+Police" },
  ],
  "Gujarat": [
    { label: "Gujarat Board", href: "/search?q=Gujarat+Board" },
    { label: "GPSC Jobs", href: "/search?q=GPSC" },
    { label: "Gujarat Police", href: "/search?q=Gujarat+Police" },
  ],
  "Madhya Pradesh": [
    { label: "MP Board", href: "/search?q=MP+Board" },
    { label: "MPPSC Jobs", href: "/search?q=MPPSC" },
    { label: "MP Police", href: "/search?q=MP+Police" },
  ],
  "West Bengal": [
    { label: "WB Board", href: "/search?q=West+Bengal+Board" },
    { label: "WBPSC Jobs", href: "/search?q=WBPSC" },
    { label: "WB Police", href: "/search?q=West+Bengal+Police" },
  ],
  "Punjab": [
    { label: "Punjab Board", href: "/search?q=Punjab+Board" },
    { label: "PPSC Jobs", href: "/search?q=PPSC" },
    { label: "Punjab Police", href: "/search?q=Punjab+Police" },
  ],
  "Haryana": [
    { label: "Haryana Board", href: "/search?q=Haryana+Board" },
    { label: "HPSC Jobs", href: "/search?q=HPSC" },
    { label: "Haryana Police", href: "/search?q=Haryana+Police" },
    { label: "HSSC", href: "/search?q=HSSC" },
  ],
};

export default function StateMapPage() {
  const [active, setActive] = useState<string | null>(null);

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-br from-gray-50 to-teal-50 pb-20 lg:pb-10">
        <div className="container-page py-8 sm:py-12">
          <div className="mx-auto max-w-5xl">
            <div className="mb-8 text-center">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-teal-100 px-3.5 py-1 text-xs font-semibold text-teal-700 mb-3">
                <MapPin className="h-3 w-3" /> India Map
              </span>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">State-Wise Results & Jobs</h1>
              <p className="mt-2 text-gray-500 text-sm">Click on a state to see board results, government jobs & exams</p>
            </div>

            {/* State Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
              {states.map((state) => (
                <button
                  key={state}
                  onClick={() => setActive(active === state ? null : state)}
                  className={cn(
                    "rounded-xl border px-3 py-3 text-center text-sm font-semibold transition-all",
                    active === state
                      ? "bg-brand text-white border-brand shadow-lg shadow-brand/20 scale-105"
                      : (stateColors[state] || "bg-white text-gray-600 border-gray-100 hover:border-gray-200 hover:shadow-sm")
                  )}
                >
                  <MapPin className={cn("mx-auto h-4 w-4 mb-1", active === state ? "text-white" : "text-brand/60")} />
                  {state}
                </button>
              ))}
            </div>

            {/* State Detail */}
            {active && (
              <div className="mt-8 rounded-2xl bg-white border border-gray-100 shadow-lg overflow-hidden">
                <div className={cn("px-6 py-4", active === "Uttar Pradesh" ? "bg-cyan-500" : active === "Bihar" ? "bg-yellow-500" : "bg-brand")}>
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    {active}
                  </h2>
                  <p className="text-sm text-white/70">Government exams, results & jobs</p>
                </div>
                <div className="p-6">
                  {stateLinks[active] ? (
                    <div className="grid gap-3 sm:grid-cols-2">
                      {stateLinks[active].map((link) => (
                        <Link
                          key={link.href}
                          href={link.href}
                          className="flex items-center justify-between gap-3 rounded-xl border border-gray-100 bg-white px-4 py-3.5 shadow-sm transition hover:border-brand/20 hover:shadow-md group"
                        >
                          <span className="text-sm font-semibold text-gray-700 group-hover:text-brand">{link.label}</span>
                          <ChevronRight className="h-4 w-4 shrink-0 text-gray-300 group-hover:text-brand" />
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <Link
                      href={`/search?q=${encodeURIComponent(active)}`}
                      className="inline-flex items-center gap-2 rounded-xl bg-brand px-5 py-3 text-sm font-bold text-white shadow-md transition hover:bg-brand/90"
                    >
                      Search all {active} exams <ChevronRight className="h-4 w-4" />
                    </Link>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
