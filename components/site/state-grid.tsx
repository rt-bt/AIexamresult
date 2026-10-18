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
    <section className="relative overflow-hidden bg-[#F8FAFC] py-16 sm:py-20 font-sans border-b border-[#E2E8F0]">
      <div className="container-page">
        <div className="mx-auto max-w-xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#E2E8F0] bg-white px-3.5 py-1 text-xs font-bold uppercase tracking-[0.16em] text-[#343A46] shadow-xs font-heading">
            <Compass className="h-3.5 w-3.5 text-[#F28A2E]" />
            State-wise Desk
          </span>
          <h2 className="mt-4 text-2xl sm:text-3xl font-bold tracking-tight text-[#172033] font-heading">
            Find government jobs near you
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-[#8B8F96]">
            Targeted state portals for faster local recruitment notifications and state board results.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {stateGroups.map(([region, states]) => (
            <div
              key={region}
              className="rounded-xl border border-[#E2E8F0] bg-white p-4 shadow-xs transition-all duration-200 hover:border-[#8B8F96]/50 hover:shadow-md"
            >
              <h3 className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#343A46] font-heading px-1">
                <span className="h-1.5 w-1.5 rounded-full bg-[#F28A2E]" />
                <span>{region}</span>
                <span className="h-px flex-1 bg-[#E2E8F0]" />
              </h3>
              <div className="space-y-1">
                {states.map((state) => {
                  const slug = state.toLowerCase().replace(/\s+/g, "-").replace(/&/g, "and");
                  return (
                    <Link
                      key={state}
                      href={`/state/${slug}`}
                      className="group flex items-center justify-between rounded-lg px-3 py-2 text-xs sm:text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 hover:text-[#F28A2E]"
                    >
                      <span className="flex items-center gap-2">
                        <span className="flex h-6 w-6 items-center justify-center rounded bg-slate-100 text-[#343A46] group-hover:bg-[#F28A2E]/10 group-hover:text-[#F28A2E] transition-colors">
                          <MapPin className="h-3 w-3" />
                        </span>
                        {state}
                      </span>
                      <ArrowRight className="h-3.5 w-3.5 text-slate-300 transition-transform group-hover:translate-x-0.5 group-hover:text-[#F28A2E]" />
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