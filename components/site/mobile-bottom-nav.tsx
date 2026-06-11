"use client";

import { Home, Search, Bookmark, MapPin, Grid3X3 } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { label: "Home", href: "/", icon: Home },
  { label: "Search", href: "/search", icon: Search },
  { label: "Bookmarks", href: "/bookmarks", icon: Bookmark },
  { label: "States", href: "/state", icon: MapPin },
  { label: "All", href: "/results", icon: Grid3X3 },
];

export function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-slate-200 bg-white/80 pb-safe backdrop-blur-xl animate-slide-up lg:hidden">
      <div className="flex items-center justify-around py-1">
        {tabs.map(({ label, href, icon: Icon }) => {
          const active = pathname === href || (href !== "/" && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center gap-0.5 rounded-xl px-3 py-1.5 text-[10px] font-semibold transition active:scale-90 ${
                active ? "text-brand" : "text-slate-400"
              }`}
            >
              <div className={`rounded-lg p-1.5 transition-all ${active ? "bg-brand/10 scale-110" : ""}`}>
                <Icon className={`h-5 w-5 ${active ? "text-brand" : "text-slate-400"}`} />
              </div>
              <span>{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
