import Link from "next/link";
import { ArrowUpRight, CheckCircle2 } from "lucide-react";
import { Logo } from "@/components/site/logo";

interface FooterLink {
  label: string;
  href: string;
}

interface FooterColumn {
  title: string;
  links: FooterLink[];
}

const footerColumns: FooterColumn[] = [
  {
    title: "Exam Updates",
    links: [
      { label: "Sarkari Results", href: "/results" },
      { label: "Latest Jobs & Vacancies", href: "/latest-jobs" },
      { label: "Admit Cards & Hall Tickets", href: "/admit-card" },
      { label: "Answer Keys & Objections", href: "/answer-key" },
      { label: "Exam Syllabus & Pattern", href: "/syllabus" },
      { label: "Exam Calendar 2026", href: "/exam-calendar" },
    ],
  },
  {
    title: "Aspirant Tools",
    links: [
      { label: "Eligibility Checker", href: "/eligibility-checker" },
      { label: "7th CPC Salary Calculator", href: "/salary-calculator" },
      { label: "Vacancy Trend Analyzer", href: "/vacancy-analyzer" },
      { label: "Application Fee Calculator", href: "/fee-calculator" },
      { label: "Difficulty Meter & Cut-Off", href: "/difficulty-meter" },
      { label: "Online Form Filling Guide", href: "/form-guide" },
    ],
  },
  {
    title: "Major Commissions",
    links: [
      { label: "SSC (CGL, CHSL, GD, MTS)", href: "/exam/ssc-cgl" },
      { label: "UPSC (IAS, NDA, CDS)", href: "/exam/upsc-cse" },
      { label: "Railway Recruitment (RRB)", href: "/exam/rrb-ntpc" },
      { label: "Banking (IBPS, SBI, RBI)", href: "/exam/ibps-po" },
      { label: "Defence & Police Forces", href: "/exam/ssc-gd" },
      { label: "State PSC Portals", href: "/state-map" },
    ],
  },
  {
    title: "Trust & Legal",
    links: [
      { label: "About Our Mission", href: "/about" },
      { label: "Editorial & Data Sources", href: "/disclaimer" },
      { label: "Privacy Policy", href: "/privacy-policy" },
      { label: "Terms of Service", href: "/terms" },
      { label: "Cookie Policy", href: "/cookies-policy" },
      { label: "Contact & Grievance", href: "/contact" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-indigo-100/80 bg-white text-slate-700 dark:border-indigo-950/60 dark:bg-slate-950 dark:text-slate-300 transition-colors">
      {/* 1. Main Macro-Whitespace Grid */}
      <div className="container-page py-16 lg:py-24">
        <div className="grid gap-12 lg:grid-cols-[1.5fr_1fr_1fr_1fr_1fr]">
          
          {/* Brand & Telemetry Column */}
          <div className="flex flex-col">
            <Link href="/" className="flex items-center gap-2.5 group w-max">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl sm:rounded-full border border-indigo-100 bg-white p-1 shadow-2xs group-hover:scale-105 group-hover:border-indigo-300 dark:border-indigo-900/60 dark:bg-slate-900 transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]">
                <Logo className="h-6 w-6 object-contain" />
              </div>
              <div className="flex flex-col leading-none">
                <span className="text-sm font-black tracking-tight text-slate-900 dark:text-white">
                  All India
                </span>
                <span className="mt-0.5 font-mono text-[9px] font-bold tracking-[0.14em] text-indigo-600 dark:text-indigo-400">
                  EXAM RESULT
                </span>
              </div>
            </Link>

            <p className="mt-4 text-xs leading-relaxed text-slate-500 dark:text-slate-400 max-w-sm">
              An independent, high-precision intelligence portal delivering verified government recruitment updates, scorecards, hall tickets, and syllabus structures across India.
            </p>

            {/* Double-Bezel Telemetry Island */}
            <div className="mt-6 rounded-2xl p-1 bg-indigo-50/60 dark:bg-indigo-950/40 ring-1 ring-indigo-100 dark:ring-indigo-900/40 max-w-sm">
              <div className="rounded-[calc(1rem-4px)] bg-white/90 dark:bg-slate-900/90 p-3 shadow-2xs space-y-2">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-amber-500" />
                  </span>
                  <span className="text-[11px] font-semibold text-slate-800 dark:text-slate-200 tracking-tight">
                    Continuous 30-Minute Sync Cycle
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                  <CheckCircle2 className="h-3 w-3 text-indigo-600 dark:text-indigo-400 shrink-0" />
                  <span>Sourced directly from official commission gazettes</span>
                </div>
              </div>
            </div>

            {/* Social Capsules */}
            <div className="mt-6 flex items-center gap-2">
              {[
                { name: "Twitter / X", href: "https://twitter.com", path: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" },
                { name: "Facebook", href: "https://facebook.com", path: "M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" },
                { name: "YouTube", href: "https://youtube.com", path: "M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" },
              ].map((s) => (
                <a
                  key={s.name}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.name}
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-slate-600 hover:border-indigo-300 hover:bg-white hover:text-indigo-600 active:scale-95 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-400 dark:hover:border-indigo-700 dark:hover:text-indigo-400 transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]"
                >
                  <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d={s.path} />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* Categorized Link Columns */}
          {footerColumns.map((col) => (
            <div key={col.title}>
              <h3 className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-900 dark:text-white">
                {col.title}
              </h3>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="group flex items-center justify-between text-xs text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 transition-colors duration-200"
                    >
                      <span className="truncate">{link.label}</span>
                      {/* Button-in-Button Trailing Icon Capsule */}
                      <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]">
                        <ArrowUpRight className="h-2.5 w-2.5 text-current" />
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Transparency & Independent Portal Notice Strip */}
      <div className="border-t border-slate-200/70 bg-slate-50/70 py-4 text-[11px] leading-relaxed text-slate-500 dark:border-slate-800/80 dark:bg-slate-900/40 dark:text-slate-400">
        <div className="container-page">
          <p>
            <strong className="font-semibold text-slate-800 dark:text-slate-200">Statutory Notice:</strong> All India Exam Result is an independent information aggregation platform and has no legal affiliation with the Union Public Service Commission (UPSC), Staff Selection Commission (SSC), Railway Recruitment Boards (RRB), National Testing Agency (NTA), or any Central or State Ministry. All recruitment notices, dates, scorecards, and keys are referenced from official public bulletins. Candidates must authenticate all data with respective official portals.
          </p>
        </div>
      </div>

      {/* 3. Bottom Legal & Precision Copyright Strip */}
      <div className="border-t border-slate-200/70 py-6 text-xs text-slate-400 dark:border-slate-800/80 dark:text-slate-500">
        <div className="container-page flex flex-col items-center justify-between gap-3 sm:flex-row">
          <p className="font-mono text-[11px]">
            &copy; {new Date().getFullYear()} All India Exam Result. Engineered for speed &amp; clarity.
          </p>

          <div className="flex flex-wrap items-center gap-4 text-xs">
            <Link href="/privacy-policy" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
              Privacy
            </Link>
            <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">•</span>
            <Link href="/cookies-policy" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
              Cookies
            </Link>
            <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">•</span>
            <Link href="/terms" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
              Terms
            </Link>
            <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">•</span>
            <Link href="/disclaimer" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
              Disclaimer
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
