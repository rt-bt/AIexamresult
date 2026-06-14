import Link from "next/link";
import { MapPin, ArrowRight } from "lucide-react";

const stateGroups: [string, string[]][] = [
  ["North India", ["Delhi", "Uttar Pradesh", "Punjab", "Haryana", "Uttarakhand", "Himachal Pradesh", "Jammu & Kashmir"]],
  ["East & North-East", ["Bihar", "West Bengal", "Odisha", "Jharkhand", "Assam"]],
  ["West & Central", ["Rajasthan", "Maharashtra", "Gujarat", "Madhya Pradesh", "Chhattisgarh"]],
  ["South India", ["Tamil Nadu", "Karnataka", "Andhra Pradesh", "Telangana", "Kerala"]],
];

export function StateGrid() {
  return (
    <section className="bg-gradient-to-b from-slate-50 to-white py-16">
      <div className="container-page">
        <div className="text-center">
          <span className="inline-flex items-center gap-2 rounded-lg bg-indigo-100 px-3 py-1 text-xs font-bold tracking-wider text-indigo-700 uppercase">State-wise Desk</span>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Find government jobs near you</h2>
          <p className="mx-auto mt-3 max-w-2xl text-base text-slate-500 dark:text-slate-400">Filtered state pages for faster job discovery and clean landing pages.</p>
        </div>
        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {stateGroups.map(([region, states]) => (
            <div key={region}>
              <h3 className="mb-3 flex items-center gap-2 text-xs font-bold tracking-wider text-slate-400 uppercase">
                <span className="h-px flex-1 bg-slate-200" />
                {region}
                <span className="h-px flex-1 bg-slate-200" />
              </h3>
              <div className="space-y-1.5">
                {states.map((state) => {
                  const slug = state.toLowerCase().replace(/\s+/g, "-").replace(/&/g, "and");
                  return (
                    <Link
                      key={state}
                      href={`/state/${slug}`}
                      className="group flex items-center justify-between rounded-xl px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-300 transition-all hover:bg-white hover:shadow-sm hover:shadow-black/[0.02] hover:text-indigo-600 dark:hover:text-indigo-400 dark:hover:bg-slate-800"
                    >
                      <span className="flex items-center gap-3">
                        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-50 text-indigo-500 transition-all group-hover:bg-indigo-100 group-hover:text-indigo-600 dark:bg-slate-800 dark:text-indigo-400 dark:group-hover:bg-slate-700">
                          <MapPin className="h-3.5 w-3.5" />
                        </span>
                        {state}
                      </span>
                      <ArrowRight className="h-3.5 w-3.5 text-slate-300 transition-all group-hover:translate-x-0.5 group-hover:text-indigo-400 dark:text-slate-600" />
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