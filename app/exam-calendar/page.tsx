import * as fs from "fs";
import * as path from "path";
import Link from "next/link";
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { CalendarDays, ChevronRight } from "lucide-react";

type CalendarEvent = {
  title: string;
  slug: string;
  dateLabel: string;
  dateStr: string;
  category: string;
};

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function extractDate(text: string): string | null {
  const m = text.match(/(\d{1,2})\s+(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+(\d{4})/i);
  if (m) return `${m[1]} ${m[2]} ${m[3]}`;
  const m2 = text.match(/(\d{1,2})-(\d{1,2})-(\d{4})/);
  if (m2) return `${m2[1]} ${MONTHS[parseInt(m2[2]) - 1]} ${m2[3]}`;
  return null;
}

function categorizeDate(text: string): string {
  const lower = text.toLowerCase();
  if (lower.includes("apply start") || lower.includes("application start")) return "Apply Start";
  if (lower.includes("last date") || lower.includes("apply last")) return "Last Date";
  if (lower.includes("exam date") || lower.includes("examination")) return "Exam Date";
  if (lower.includes("admit card")) return "Admit Card";
  if (lower.includes("result")) return "Result";
  if (lower.includes("answer key")) return "Answer Key";
  if (lower.includes("correction")) return "Correction";
  return "Other";
}

export default function ExamCalendarPage() {
  const postsDir = path.join(process.cwd(), "data", "posts");
  let files: string[] = [];
  try { files = fs.readdirSync(postsDir).filter((f) => f.endsWith(".json")); } catch {}

  const events: CalendarEvent[] = [];

  for (const file of files) {
    try {
      const raw = fs.readFileSync(path.join(postsDir, file), "utf-8");
      const post = JSON.parse(raw);
      const dates = post.importantDates || [];
      for (const d of dates) {
        const parsed = extractDate(d);
        if (parsed) {
          events.push({
            title: post.title,
            slug: post.slug,
            dateLabel: categorizeDate(d),
            dateStr: parsed,
            category: post.category || "Uncategorized",
          });
        }
      }
    } catch {}
  }

  // Sort by date
  events.sort((a, b) => {
    const da = new Date(a.dateStr).getTime();
    const db = new Date(b.dateStr).getTime();
    return da - db;
  });

  // Group by month-year
  const grouped: Record<string, CalendarEvent[]> = {};
  for (const e of events) {
    const d = new Date(e.dateStr);
    if (isNaN(d.getTime())) continue;
    const key = `${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(e);
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-br from-gray-50 to-teal-50 pb-20 lg:pb-10">
        <div className="container-page py-8 sm:py-12">
          <div className="mx-auto max-w-5xl">
            {/* Header */}
            <div className="mb-8 text-center">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-teal-100 px-3.5 py-1 text-xs font-semibold text-teal-700 mb-3">
                <CalendarDays className="h-3 w-3" /> Exam Calendar 2026
              </span>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">Exam Calendar</h1>
              <p className="mt-2 text-gray-500 text-sm sm:text-base">
                Track important dates for government exams — application start, last date, exam date, result
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
              {[
                { label: "Total Events", value: events.length },
                { label: "Upcoming", value: events.filter((e) => new Date(e.dateStr) >= new Date()).length },
                { label: "Last Dates", value: events.filter((e) => e.dateLabel === "Last Date").length },
                { label: "Results", value: events.filter((e) => e.dateLabel === "Result").length },
              ].map((s) => (
                <div key={s.label} className="rounded-xl bg-white border border-gray-100 p-4 text-center shadow-sm">
                  <div className="text-2xl font-bold text-teal-700">{s.value}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{s.label}</div>
                </div>
              ))}
            </div>

            {/* Monthly view */}
            {Object.entries(grouped).map(([monthYear, monthEvents]) => (
              <div key={monthYear} className="mb-8 rounded-2xl bg-white border border-gray-100 shadow-sm overflow-hidden">
                <div className="bg-gradient-to-r from-teal-600 to-teal-500 px-6 py-4">
                  <h2 className="text-xl font-bold text-white">{monthYear}</h2>
                  <p className="text-sm text-teal-100">{monthEvents.length} event{monthEvents.length > 1 ? "s" : ""}</p>
                </div>
                <div className="divide-y divide-gray-50">
                  {monthEvents.map((event, i) => {
                    const badgeColor =
                      event.dateLabel === "Last Date" ? "bg-red-100 text-red-700" :
                      event.dateLabel === "Result" ? "bg-green-100 text-green-700" :
                      event.dateLabel === "Exam Date" ? "bg-orange-100 text-orange-700" :
                      event.dateLabel === "Admit Card" ? "bg-purple-100 text-purple-700" :
                      "bg-gray-100 text-gray-600";

                    return (
                      <Link
                        key={i}
                        href={`/post/${event.slug}`}
                        className="flex items-start gap-4 px-6 py-4 transition hover:bg-gray-50 group"
                      >
                        <div className="shrink-0 text-center">
                          <div className="text-lg font-bold text-gray-800 leading-none">{event.dateStr.split(" ")[0]}</div>
                          <div className="text-xs font-medium text-gray-400">{event.dateStr.split(" ")[1]} {event.dateStr.split(" ")[2]}</div>
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="text-sm font-semibold text-gray-800 group-hover:text-teal-600 transition-colors line-clamp-2">{event.title}</h3>
                          <span className={`mt-1.5 inline-block rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${badgeColor}`}>
                            {event.dateLabel}
                          </span>
                        </div>
                        <ChevronRight className="mt-1 h-4 w-4 shrink-0 text-gray-300 group-hover:text-teal-500 transition-colors" />
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}

            {Object.keys(grouped).length === 0 && (
              <div className="rounded-2xl bg-white border border-gray-100 p-12 text-center shadow-sm">
                <CalendarDays className="mx-auto h-10 w-10 text-gray-300" />
                <p className="mt-4 text-gray-500">No exam dates found yet. Data will populate after next scrape.</p>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
