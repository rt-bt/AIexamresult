"use client";

import { useState } from "react";
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";

type Age = { years: number; months: number; days: number } | null;

export default function AgeCalculatorPage() {
  const [dob, setDob] = useState("");
  const [reference, setReference] = useState(() => new Date().toISOString().split("T")[0]);
  const [age, setAge] = useState<Age>(null);

  function calc() {
    if (!dob || !reference) return;
    const [by, bm, bd] = dob.split("-").map(Number);
    const [ry, rm, rd] = reference.split("-").map(Number);
    if (by > ry || (by === ry && bm > rm) || (by === ry && bm === rm && bd > rd)) return;

    let years = ry - by;
    let months = rm - bm;
    let days = rd - bd;

    if (days < 0) {
      months--;
      const prevMonth = new Date(ry, rm - 1, 0);
      days += prevMonth.getDate();
    }
    if (months < 0) {
      years--;
      months += 12;
    }
    setAge({ years, months, days });
  }

  const totalDays = age ? Math.floor((new Date(reference).getTime() - new Date(dob).getTime()) / (1000 * 60 * 60 * 24)) : 0;

  return (
    <>
      <Header />
      <main className="min-h-[calc(100dvh-4rem)] bg-gradient-to-br from-gray-50 to-teal-50 pb-20 lg:pb-10">
        <div className="container-page py-8 sm:py-12">
          <div className="mx-auto max-w-2xl">
            {/* Header */}
            <div className="mb-8 text-center">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-teal-100 px-3.5 py-1 text-xs font-semibold text-teal-700 mb-3">
                Free Tool
              </span>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">Age Calculator</h1>
              <p className="mt-2 text-gray-500 text-sm sm:text-base">
                Calculate your exact age in years, months, and days
              </p>
            </div>

            {/* Calculator Card */}
            <div className="rounded-2xl bg-white p-6 sm:p-8 shadow-lg border border-gray-100">
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Date of Birth</label>
                  <input
                    type="date"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition-all"
                    max={new Date().toISOString().split("T")[0]}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">As of Date</label>
                  <input
                    type="date"
                    value={reference}
                    onChange={(e) => setReference(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition-all"
                    max={new Date().toISOString().split("T")[0]}
                  />
                </div>

                <button
                  onClick={calc}
                  className="w-full rounded-xl bg-gradient-to-r from-teal-600 to-teal-500 px-6 py-3 text-sm font-semibold text-white shadow-md shadow-teal-200 hover:shadow-lg hover:from-teal-500 hover:to-teal-400 transition-all active:scale-[0.98]"
                >
                  Calculate Age
                </button>
              </div>

              {/* Result */}
              {age && (
                <div className="mt-8 space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { label: "Years", value: age.years },
                      { label: "Months", value: age.months },
                      { label: "Days", value: age.days },
                    ].map((item) => (
                      <div
                        key={item.label}
                        className="rounded-xl bg-gradient-to-br from-teal-50 to-teal-100/50 p-4 text-center border border-teal-200/50"
                      >
                        <div className="text-3xl sm:text-4xl font-bold text-teal-700">{item.value}</div>
                        <div className="mt-1 text-xs font-medium text-teal-600/70 uppercase tracking-wider">{item.label}</div>
                      </div>
                    ))}
                  </div>

                  <div className="rounded-xl bg-gray-50 p-4 border border-gray-100">
                    <div className="text-center">
                      <span className="text-sm text-gray-500">Total days alive</span>
                      <div className="text-2xl font-bold text-gray-800 mt-0.5">{totalDays.toLocaleString()}</div>
                    </div>
                  </div>
                </div>
              )}

              {!dob && !age && (
                <div className="mt-8 rounded-xl bg-amber-50 border border-amber-200 p-4 text-center">
                  <p className="text-sm text-amber-700">Enter your date of birth and click Calculate</p>
                </div>
              )}
            </div>

            {/* Info */}
            <div className="mt-8 rounded-2xl bg-white p-6 shadow-lg border border-gray-100">
              <h2 className="font-semibold text-gray-900 mb-2">How to use</h2>
              <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                <li>Select your <strong>Date of Birth</strong></li>
                <li>Choose the <strong>As of Date</strong> (defaults to today)</li>
                <li>Click <strong>Calculate Age</strong> to see your exact age</li>
                <li>Useful for government exam age eligibility checks</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
