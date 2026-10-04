import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Logo } from "@/components/site/logo";

const footerGroups: Array<[string, string[]]> = [
  ["Quick Links", ["Results", "Latest Vacancy", "Admit Card", "Answer Key"]],
  ["Resources", ["Admissions", "Syllabus", "Scholarships", "Board Results"]],
  ["Support", ["About Us", "Contact Us", "Privacy Policy", "Cookies Policy", "Disclaimer"]]
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
          {footerGroups.map(([title, links]) => (
            <div key={title}>
              <h3 className="font-bold text-white text-sm uppercase tracking-wider font-heading">{title}</h3>
              <div className="mt-4 grid gap-3">
                {links.map((link) => (
                  <Link key={link} href={`/${link.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")}`} className="group flex items-center gap-2 text-sm text-white/75 transition hover:text-[#FFD84D]">
                    <ArrowUpRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5 group-hover:text-[#FFD84D]" />
                    {link}
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
