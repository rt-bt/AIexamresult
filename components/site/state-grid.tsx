import Link from "next/link";
import { MapPin, ArrowRight, Compass } from "lucide-react";

const stateGroups: [string, string[]][] = [
  ["North India", ["Delhi", "Uttar Pradesh", "Punjab", "Haryana", "Uttarakhand", "Himachal Pradesh", "Jammu & Kashmir"]],
  ["East & North-East", ["Bihar", "West Bengal", "Odisha", "Jharkhand", "Assam"]],
  ["West & Central", ["Rajasthan", "Maharashtra", "Gujarat", "Madhya Pradesh", "Chhattisgarh"]],
  ["South India", ["Tamil Nadu", "Karnataka", "Andhra Pradesh", "Telangana", "Kerala"]],
];

export function StateGrid() {
  return (
    <section className="relative overflow-hidden bg-white py-20 font-sans">
      <div className="absolute left-1/2 top-0 h-px w-32 -translate-x-1/2 bg-gradient-to-r from-transparent via-[#FFD84D] to-transparent" />
      <div className="container-page">
        <div className="mx-auto max-w-xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#DEDEDE] bg-neutral-50 px-4 py-1.5 text-xs font-bold tracking-wider text-[#111111] shadow-sm font-heading">
            <Compass className="h-3.5 w-3.5 text-[#FF5B3E]" />
            State-wise Desk
          </span>
          <h2 className="mt-5 text-3xl font-bold tracking-tight text-[#111111] sm:text-4xl font-heading">
            Find government jobs near you
          </h2>
          <p className="mt-3 text-base leading-relaxed text-neutral-500 font-sans">
            Filtered state pages for faster job discovery and clean landing pages.
          </p>
        </div>
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {stateGroups.map(([region, states]) => (
            <div key={region} className="rounded-2xl border border-[#DEDEDE] bg-[#FAFAFA]/70 p-4 transition-all duration-300 hover:border-[#111111]/30 hover:bg-white hover:shadow-lg">
              <h3 className="mb-3.5 flex items-center gap-2.5 text-[13px] font-bold text-[#111111] font-heading px-1">
                <span className="h-1.5 w-1.5 rounded-full bg-[#FF5B3E]" />
                <span>{region}</span>
                <span className="h-px flex-1 bg-[#DEDEDE]" />
              </h3>
              <div className="space-y-1">
                {states.map((state) => {
                  const slug = state.toLowerCase().replace(/\s+/g, "-").replace(/&/g, "and");
                  return (
                    <Link
                      key={state}
                      href={`/state/${slug}`}
                      className="group flex items-center justify-between rounded-xl px-3.5 py-2.5 text-[14.5px] font-medium text-neutral-800 transition-all duration-200 hover:bg-white hover:shadow-xs hover:text-[#FF5B3E] font-sans"
                    >
                      <span className="flex items-center gap-2.5">
                        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-neutral-100 text-[#111111] transition-all group-hover:bg-[#FFD84D] group-hover:text-[#111111]">
                          <MapPin className="h-3.5 w-3.5" />
                        </span>
                        {state}
                      </span>
                      <ArrowRight className="h-3.5 w-3.5 text-neutral-300 transition-all group-hover:translate-x-0.5 group-hover:text-[#FF5B3E]" />
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}