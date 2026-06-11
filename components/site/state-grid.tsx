import Link from "next/link";
import { MapPin } from "lucide-react";

const states = ["Uttar Pradesh", "Bihar", "Rajasthan", "Maharashtra", "Madhya Pradesh", "Delhi", "West Bengal", "Tamil Nadu", "Karnataka", "Gujarat", "Odisha", "Jharkhand", "Andhra Pradesh", "Telangana", "Kerala", "Assam", "Chhattisgarh", "Himachal Pradesh", "Jammu & Kashmir", "Punjab", "Haryana", "Uttarakhand"];

export function StateGrid() {
  return (
    <section className="py-10">
      <div className="container-page">
        <div className="mb-8 text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-indigo-50 px-4 py-1.5 text-sm font-bold text-[#4F46E5] ring-1 ring-indigo-100">State-wise desk</span>
          <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-800">Find government jobs near you</h2>
          <p className="mx-auto mt-2 max-w-xl text-slate-500">Filtered state pages for faster job discovery and clean landing pages.</p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {states.map((state) => {
            const slug = state.toLowerCase().replace(/\s+/g, "-");
            return (
              <Link key={state} href={`/state/${slug}`} className="group flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-4 font-bold text-slate-700 shadow-sm transition-all active:scale-[0.97] hover:-translate-y-0.5 hover:border-[#0D9488]/30 hover:shadow-lg hover:shadow-[#0D9488]/5">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#0D9488]/10 text-[#0D9488] transition group-hover:bg-[#0D9488] group-hover:text-white">
                  <MapPin className="h-4 w-4" />
                </span>
                {state}
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
