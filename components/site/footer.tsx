import Link from "next/link";
import { ArrowUpRight, ShieldCheck, RefreshCw, CheckCircle2, ChevronUp } from "lucide-react";
import { Logo } from "@/components/site/logo";

interface FooterLink {
  label: string;
  href: string;
  external?: boolean;
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
    <footer className="border-t border-slate-200/80 bg-white text-slate-700 dark:border-slate-800/80 dark:bg-slate-950 dark:text-slate-300 transition-colors">
      {/* 1. Main Grid */}
      <div className="container-page py-12 lg:py-16">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr_1fr_1fr_1fr]">
          {/* Brand & Mission Column */}
          <div className="flex flex-col">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white p-1 shadow-2xs group-hover:border-teal-500/40 dark:border-slate-800 dark:bg-slate-900 transition">
                <Logo className="h-7 w-7 object-contain" />
              </div>
              <div className="flex flex-col leading-none">
                <span className="text-sm font-black tracking-tight text-slate-900 dark:text-white">
                  All India
                </span>
                <span className="mt-0.5 font-mono text-[10px] font-bold tracking-wider text-teal-600 dark:text-teal-400">
                  EXAM RESULT
                </span>
              </div>
            </Link>

            <p className="mt-3.5 text-xs leading-relaxed text-slate-500 dark:text-slate-400 max-w-sm">
              High-performance, distraction-free intelligence portal for Indian government recruitment notifications, hall tickets, answer keys, and public examinations.
            </p>

            {/* Sync Telemetry Badge */}
            <div className="mt-5 space-y-2">
              <div className="inline-flex items-center gap-2 rounded-lg border border-teal-500/20 bg-teal-50/60 px-3 py-1.5 text-[11px] font-medium text-teal-800 dark:border-teal-500/30 dark:bg-teal-950/40 dark:text-teal-300">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-teal-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-teal-500" />
                </span>
                <span>Automated sync every 30m</span>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] text-slate-400 dark:text-slate-500 font-mono">
                <CheckCircle2 className="h-3 w-3 text-teal-600 dark:text-teal-400" />
                <span>Aggregated from verified official gazettes</span>
              </div>
            </div>

            {/* Social Icons in Minimalist Squares */}
            <div className="mt-6 flex items-center gap-2">
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter / X"
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300 hover:bg-white hover:text-slate-900 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400 dark:hover:border-slate-700 dark:hover:bg-slate-800 dark:hover:text-white transition"
              >
                <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300 hover:bg-white hover:text-slate-900 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400 dark:hover:border-slate-700 dark:hover:bg-slate-800 dark:hover:text-white transition"
              >
                <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300 hover:bg-white hover:text-slate-900 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400 dark:hover:border-slate-700 dark:hover:bg-slate-800 dark:hover:text-white transition"
              >
                <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" /></svg>
              </a>
            </div>
          </div>

          {/* Categorized Link Columns */}
          {footerColumns.map((col) => (
            <div key={col.title}>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                {col.title}
              </h3>
              <ul className="mt-3.5 space-y-2">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="group flex items-center gap-1 text-xs text-slate-500 hover:text-teal-600 dark:text-slate-400 dark:hover:text-teal-400 transition"
                    >
                      <span>{link.label}</span>
                      <ArrowUpRight className="h-3 w-3 opacity-0 -translate-y-0.5 translate-x-0.5 transition group-hover:opacity-100" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Official Disclaimer Strip */}
      <div className="border-t border-slate-200/80 bg-slate-50/50 py-4 text-[11px] leading-relaxed text-slate-500 dark:border-slate-800/80 dark:bg-slate-900/40 dark:text-slate-400">
        <div className="container-page">
          <p>
            <strong className="font-semibold text-slate-700 dark:text-slate-300">Mandatory Notice:</strong> All India Exam Result is an independent information aggregator and is not affiliated with the Union Public Service Commission (UPSC), Staff Selection Commission (SSC), Indian Railways, or any central/state government ministry. All exam schedules, results, answer keys, and notices are compiled from public official portals. Candidates must verify all details on official government portals before applying or taking action.
          </p>
        </div>
      </div>

      {/* 3. Bottom Bar: Copyright & Legal */}
      <div className="border-t border-slate-200/80 py-5 text-xs text-slate-400 dark:border-slate-800/80 dark:text-slate-500">
        <div className="container-page flex flex-col items-center justify-between gap-3 sm:flex-row">
          <p>
            &copy; {new Date().getFullYear()} All India Exam Result. All rights reserved.
          </p>

          <div className="flex flex-wrap items-center gap-4 text-xs">
            <Link href="/privacy-policy" className="hover:text-slate-700 dark:hover:text-slate-300 transition">
              Privacy
            </Link>
            <span aria-hidden="true">•</span>
            <Link href="/cookies-policy" className="hover:text-slate-700 dark:hover:text-slate-300 transition">
              Cookies
            </Link>
            <span aria-hidden="true">•</span>
            <Link href="/terms" className="hover:text-slate-700 dark:hover:text-slate-300 transition">
              Terms
            </Link>
            <span aria-hidden="true">•</span>
            <Link href="/disclaimer" className="hover:text-slate-700 dark:hover:text-slate-300 transition">
              Disclaimer
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
