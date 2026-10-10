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
    <footer className="relative bg-[#5B0111] text-white/80 border-t border-[#40000b] font-sans">
      <div className="h-0.5 bg-gradient-to-r from-[#FFD84D] via-[#FF5B3E] to-[#FFD84D]" />
      <div className="container-page py-14">
        <div className="grid gap-10 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-3">
              <Logo className="h-20 w-20" dark />
              <div className="flex flex-col leading-tight">
                <span className="text-lg font-bold tracking-tight text-white font-heading">All India</span>
                <span className="text-[12px] font-bold tracking-widest text-[#FFD84D]">EXAM RESULT</span>
              </div>
            </div>
            <p className="mt-4 max-w-sm text-sm leading-7 text-white/70 font-sans">
              A fast, structured multilingual exam information portal for Indian government jobs, results, admit cards and public notices.
            </p>
          </div>
          {footerGroups.map((group) => (
            <div key={group.title}>
              <h3 className="font-bold text-white text-sm uppercase tracking-wider font-heading">{group.title}</h3>
              <div className="mt-4 grid gap-3">
                {group.links.map((item) => (
                  <Link key={item.label} href={item.href} className="group flex items-center gap-2 text-sm text-white/75 transition hover:text-[#FFD84D]">
                    <ArrowUpRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5 group-hover:text-[#FFD84D]" />
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="border-t border-black/20 px-4 py-4 text-center text-xs leading-relaxed text-white/50">
        <div className="container-page">
          <p>Disclaimer: This is an independent information portal. All data is sourced from publicly available government notifications. Users are advised to verify all information from the respective official websites before applying.</p>
        </div>
      </div>
      <div className="border-t border-black/20 py-6">
        <div className="container-page flex flex-col items-center justify-between gap-4 text-xs text-white/60 sm:flex-row">
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
