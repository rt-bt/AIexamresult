"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

export function ShareButtons({ title, url }: { title: string; url: string }) {
  const [copied, setCopied] = useState(false);

  const whatsapp = `https://wa.me/?text=${encodeURIComponent(`${title} - ${url}`)}`;
  const telegram = `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  return (
    <div className="mt-3 flex flex-wrap gap-2">
      <a href={whatsapp} target="_blank" rel="noopener noreferrer" className="rounded-full bg-[#25D366] px-4 py-2 text-sm font-black text-white transition hover:bg-[#1DA851]">
        WhatsApp
      </a>
      <a href={telegram} target="_blank" rel="noopener noreferrer" className="rounded-full bg-[#0088cc] px-4 py-2 text-sm font-black text-white transition hover:bg-[#0077b5]">
        Telegram
      </a>
      <button onClick={copyLink} className="inline-flex items-center gap-1.5 rounded-full bg-brand px-4 py-2 text-sm font-black text-white transition hover:bg-[#0F766E]">
        {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
        {copied ? "Copied!" : "Copy Link"}
      </button>
    </div>
  );
}
