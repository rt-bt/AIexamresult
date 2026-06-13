"use client";

import { useState } from "react";
import { Check, Copy, MessageCircle, Send } from "lucide-react";

const shareItems = [
  {
    label: "WhatsApp",
    icon: MessageCircle,
    color: "text-[#25D366]",
    bg: "bg-[#25D366]/10 hover:bg-[#25D366]/20",
    getUrl: (title: string, url: string) => `https://wa.me/?text=${encodeURIComponent(`${title} - ${url}`)}`,
    external: true,
  },
  {
    label: "Telegram",
    icon: Send,
    color: "text-[#0088cc]",
    bg: "bg-[#0088cc]/10 hover:bg-[#0088cc]/20",
    getUrl: (title: string, url: string) => `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
    external: true,
  },
];

export function ShareButtons({ title, url }: { title: string; url: string }) {
  const [copied, setCopied] = useState(false);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  return (
    <div className="grid grid-cols-3 gap-2">
      {shareItems.map((item) => {
        const Icon = item.icon;
        return (
          <a
            key={item.label}
            href={item.getUrl(title, url)}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex flex-col items-center gap-1 rounded-xl ${item.bg} px-2 py-3 transition-all hover:scale-105`}
          >
            <Icon className={`h-5 w-5 ${item.color}`} />
            <span className="text-[11px] font-semibold text-gray-600">{item.label}</span>
          </a>
        );
      })}
      <button
        onClick={copyLink}
        className="flex flex-col items-center gap-1 rounded-xl bg-gray-100 px-2 py-3 transition-all hover:bg-gray-200 hover:scale-105"
      >
        {copied ? (
          <Check className="h-5 w-5 text-emerald-600" />
        ) : (
          <Copy className="h-5 w-5 text-gray-500" />
        )}
        <span className="text-[11px] font-semibold text-gray-600">{copied ? "Copied!" : "Copy Link"}</span>
      </button>
    </div>
  );
}
