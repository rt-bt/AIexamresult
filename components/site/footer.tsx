import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Logo } from "@/components/site/logo";

const footerGroups = [
  {
    title: "Quick Links",
    links: [
      { label: "Results", href: "/results" },
      { label: "Latest Vacancy", href: "/latest-jobs" },
      { label: "Admit Card", href: "/admit-card" },
      { label: "Answer Key", href: "/answer-key" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Admissions", href: "/admissions" },
      { label: "Syllabus", href: "/syllabus" },
      { label: "Scholarships", href: "/scholarships" },
      { label: "Board Results", href: "/board-results" },
      { label: "Live Radio", href: "/radio" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "About Us", href: "/about-us" },
      { label: "Contact Us", href: "/contact-us" },
      { label: "Privacy Policy", href: "/privacy-policy" },
      { label: "Cookies Policy", href: "/cookies-policy" },
      { label: "Disclaimer", href: "/disclaimer" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="relative bg-[#343A46] text-[#D7D9DC] border-t border-white/[0.22] font-sans">
      <div className="container-page py-14">
        <div className="grid gap-10 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-3">
              <Logo className="h-12 w-12" dark />
              <div className="flex flex-col leading-tight">
                <span className="text-base font-bold tracking-tight text-white font-heading">
                  All India
                </span>
                <span className="text-[11px] font-bold uppercase tracking-widest text-[#F28A2E]">
                  EXAM RESULT
                </span>
              </div>
            </div>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-[#D7D9DC]/80 font-normal">
              A fast, structured multilingual exam information portal for Indian government jobs, results, admit cards and public notices.
            </p>
          </div>
          {footerGroups.map((group) => (
            <div key={group.title}>
              <h3 className="font-bold text-white text-xs uppercase tracking-[0.16em] font-heading">
                {group.title}
              </h3>
              <div className="mt-4 grid gap-2.5">
                {group.links.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    className="group flex items-center gap-1.5 text-xs sm:text-[13px] text-[#D7D9DC] transition-colors hover:text-[#F28A2E]"
                  >
                    <ArrowUpRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5 group-hover:text-[#F28A2E] opacity-70" />
                    <span>{item.label}</span>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="border-t border-white/[0.14] px-4 py-4 text-center text-xs leading-relaxed text-[#D7D9DC]/60">
        <div className="container-page">
          <p>
            Disclaimer: This is an independent information portal. All data is sourced from publicly available government notifications. Users are advised to verify all information from the respective official websites before applying.
          </p>
        </div>
      </div>
      <div className="border-t border-white/[0.14] py-6 bg-[#2E333D]">
        <div className="container-page flex flex-col items-center justify-between gap-4 text-xs text-[#D7D9DC]/70 sm:flex-row">
          <p>&copy; {new Date().getFullYear()} All India Exam Result. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="/privacy-policy" className="hover:text-white transition">Privacy Policy</Link>
            <Link href="/cookies-policy" className="hover:text-white transition">Cookies Policy</Link>
            <Link href="/terms" className="hover:text-white transition">Terms of Service</Link>
            <Link href="/disclaimer" className="hover:text-white transition">Disclaimer</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
