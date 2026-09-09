"use client";

import { useEffect, useRef } from "react";

declare global {
  interface Window {
    adsbygoogle?: Array<Record<string, unknown>>;
  }
}

interface AdUnitProps {
  slot?: string;
  format?: "auto" | "horizontal" | "rectangle" | "fluid" | "in-article";
  className?: string;
  responsive?: boolean;
}

export function AdUnit({
  slot = "default",
  format = "auto",
  className = "",
  responsive = true,
}: AdUnitProps) {
  const adRef = useRef<HTMLModElement>(null);
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    try {
      if (typeof window !== "undefined") {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
        initialized.current = true;
      }
    } catch {
      // Ignore adsbygoogle push errors (e.g. adblocker)
    }
  }, []);

  const minHeight = format === "rectangle" ? "260px" : format === "horizontal" ? "90px" : "120px";

  return (
    <div className={`my-4 flex flex-col items-center justify-center overflow-hidden rounded-xl border border-slate-100 bg-slate-50/60 p-2 text-center ${className}`}>
      <span className="mb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
        Advertisement
      </span>
      <div className="w-full overflow-hidden flex justify-center" style={{ minHeight }}>
        <ins
          ref={adRef}
          className="adsbygoogle"
          style={{ display: "block", width: "100%" }}
          data-ad-client="ca-pub-2439432844260170"
          data-ad-slot={slot !== "default" ? slot : undefined}
          data-ad-format={format === "rectangle" ? "rectangle" : format === "horizontal" ? "horizontal" : format === "in-article" ? "fluid" : "auto"}
          data-full-width-responsive={responsive ? "true" : "false"}
        />
      </div>
    </div>
  );
}
