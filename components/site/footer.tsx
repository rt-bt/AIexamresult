import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Logo } from "@/components/site/logo";

const footerGroups: Array<[string, string[]]> = [
  ["Quick Links", ["Results", "Latest Vacancy", "Admit Card", "Answer Key"]],
  ["Resources", ["Admissions", "Syllabus", "Scholarships", "Board Results"]],
  ["Support", ["About Us", "Contact Us", "Privacy Policy", "Disclaimer"]]
];

export function Footer() {
  return (
    <footer className="border-t border-slate-100 bg-white">
      <div className="h-1.5 bg-gradient-to-r from-brand via-secondary to-accent" />
      <div className="container-page py-14">
        <div className="grid gap-10 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-3">
              <Logo className="h-14 w-14" />
              <div className="flex flex-col leading-tight">
                <span className="text-lg font-black tracking-tight text-gray-900">All India</span>
                <span className="text-[13px] font-bold tracking-widest text-brand">EXAM RESULT</span>
              </div>
            </div>
            <p className="mt-4 max-w-sm text-sm leading-7 text-slate-500">
              A fast, structured multilingual exam information portal for Indian government jobs, results, admit cards and public notices.
            </p>
            <div className="mt-6 flex gap-3">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="grid h-9 w-9 place-items-center rounded-full text-white transition hover:scale-110" style={{ backgroundColor: "#0D9488" }}>
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="grid h-9 w-9 place-items-center rounded-full text-white transition hover:scale-110" style={{ backgroundColor: "#EA580C" }}>
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="grid h-9 w-9 place-items-center rounded-full text-white transition hover:scale-110" style={{ backgroundColor: "#4F46E5" }}>
                <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5" /><circle cx="12" cy="12" r="5" /><circle cx="17.5" cy="6.5" r="1.5" /></svg>
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="grid h-9 w-9 place-items-center rounded-full text-white transition hover:scale-110" style={{ backgroundColor: "#7C3AED" }}>
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" /></svg>
              </a>
            </div>
          </div>
          {footerGroups.map(([title, links]) => (
            <div key={title}>
              <h3 className="font-black text-ink">{title}</h3>
              <div className="mt-4 grid gap-3">
                {links.map((link) => (
                  <Link key={link} href={`/${link.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")}`} className="group flex items-center gap-2 text-sm text-slate-500 transition hover:text-brand">
                    <ArrowUpRight className="h-3 w-3 transition group-hover:translate-x-0.5" />
                    {link}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="border-t border-slate-100 px-4 py-3 text-center text-[10px] leading-5 text-slate-400">
        <div className="container-page">
          <p>Disclaimer: This is an independent information portal. All data is sourced from publicly available government notifications. Users are advised to verify all information from the respective official websites before applying.</p>
        </div>
      </div>
      <div className="border-t border-slate-100 py-6">
        <div className="container-page flex flex-col items-center justify-between gap-4 text-xs text-slate-400 sm:flex-row">
          <p>&copy; {new Date().getFullYear()} All India Exam Result. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="/privacy-policy">Privacy Policy</Link>
            <Link href="/terms">Terms of Service</Link>
            <Link href="/disclaimer">Disclaimer</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
