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
    <section className="relative overflow-hidden bg-gradient-to-b from-slate-50 to-white py-20">
      <div className="absolute left-1/2 top-0 h-px w-32 -translate-x-1/2 bg-gradient-to-r from-transparent via-indigo-400 to-transparent" />
      <div className="container-page">
        <div className="mx-auto max-w-xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-white px-4 py-1.5 text-xs font-bold tracking-wider text-indigo-700 shadow-sm">
            <Compass className="h-3.5 w-3.5" />
            State-wise Desk
          </span>
          <h2 className="mt-5 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Find government jobs near you
          </h2>
          <p className="mt-3 text-base leading-relaxed text-slate-500">
            Filtered state pages for faster job discovery and clean landing pages.
          </p>
        </div>
        <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {stateGroups.map(([region, states]) => (
            <div key={region}>
              <h3 className="mb-4 flex items-center gap-3 text-xs font-bold tracking-widest text-slate-400 uppercase">
                <span className="h-px flex-1 bg-slate-200" />
                <span>{region}</span>
                <span className="h-px flex-1 bg-slate-200" />
              </h3>
              <div className="space-y-1">
                {states.map((state) => {
                  const slug = state.toLowerCase().replace(/\s+/g, "-").replace(/&/g, "and");
                  return (
                    <Link
                      key={state}
                      href={`/state/${slug}`}
                      className="group flex items-center justify-between rounded-xl px-4 py-2.5 text-sm font-medium text-slate-700 transition-all hover:bg-white hover:shadow-sm hover:shadow-black/[0.02] hover:text-indigo-600"
                    >
                      <span className="flex items-center gap-3">
                        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-50 text-indigo-500 transition-all group-hover:bg-indigo-100 group-hover:text-indigo-600">
                          <MapPin className="h-3.5 w-3.5" />
                        </span>
                        {state}
                      </span>
                      <ArrowRight className="h-3.5 w-3.5 text-slate-300 transition-all group-hover:translate-x-0.5 group-hover:text-indigo-400" />
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