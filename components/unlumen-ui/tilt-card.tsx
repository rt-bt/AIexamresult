"use client";

import * as React from "react";
import Link from "next/link";

import { cn } from "@/lib/utils";
import { ClippedCircle } from "@/components/unlumen-ui/primitives/clipped-circle";
import { Tilt, type TiltProps } from "@/components/unlumen-ui/primitives/tilt";

export interface TiltCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description?: string;
  category?: string;
  actionText?: string;
  accentColor?: string;
  /** left half of the split badge pill; shown as a simple pill if `badgeLabel` is omitted */
  price?: string;
  /** right half of the split pill, coloured by `badgeVariant` */
  badgeLabel?: string;
  badgeVariant?: "success" | "warning";
  imageSrc?: string;
  imageAlt?: string;
  /** wraps the card in a plain `<a>` tag or Next.js `<Link>` */
  href?: string;
  children?: React.ReactNode;
  tiltProps?: Omit<TiltProps, "children" | "className">;
}

const BADGE_LABEL_CLASSES: Record<
  NonNullable<TiltCardProps["badgeVariant"]>,
  string
> = {
  success: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20",
  warning: "bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/20",
};

export function TiltCard({
  title,
  description,
  category,
  actionText,
  accentColor = "#0D9488",
  price,
  badgeLabel,
  badgeVariant = "success",
  imageSrc,
  imageAlt = "",
  href,
  children,
  tiltProps,
  className,
  ...props
}: TiltCardProps) {
  const inner = (
    <Tilt
      rotationFactor={9}
      {...tiltProps}
      className={cn(
        "relative group overflow-hidden",
        "bg-white border border-slate-200/90 rounded-2xl",
        "flex flex-col justify-between",
        "h-56 sm:h-60 w-full",
        "shadow-xs hover:shadow-xl hover:shadow-teal-900/10 hover:border-teal-500/50 hover:-translate-y-1",
        "transition-all duration-300 ease-out",
        className,
      )}
    >
      {/* Top accent line */}
      <div
        className="absolute top-0 inset-x-0 h-1 z-30 transition-all duration-300 group-hover:h-1.5"
        style={{
          background: `linear-gradient(90deg, ${accentColor}, #14B8A6)`,
        }}
      />

      {/* Top Content: Badges & Headings */}
      <div className="relative z-20 flex flex-col p-5 sm:p-6 pb-2">
        <div className="flex items-center justify-between gap-2 mb-2.5">
          {category ? (
            <span
              className="inline-flex items-center text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full"
              style={{
                backgroundColor: `${accentColor}15`,
                color: accentColor,
              }}
            >
              {category}
            </span>
          ) : (
            <span />
          )}

          {price && badgeLabel ? (
            <div className="inline-flex h-fit items-center text-xs whitespace-nowrap shrink-0 shadow-xs">
              <span className="rounded-l-full bg-slate-900 text-white h-fit py-0.5 px-2.5 font-black text-[11px] tracking-wide">
                {price}
              </span>
              <span
                className={cn(
                  "rounded-r-full text-[11px] h-fit py-0.5 px-2.5 font-bold",
                  BADGE_LABEL_CLASSES[badgeVariant],
                )}
              >
                {badgeLabel}
              </span>
            </div>
          ) : price ? (
            <span className="h-fit rounded-full bg-slate-900 text-white px-2.5 py-0.5 text-[11px] font-black tracking-wide shadow-xs">
              {price}
            </span>
          ) : null}
        </div>

        <h2 className="text-base sm:text-[17px] font-bold text-slate-900 leading-snug tracking-tight group-hover:text-teal-700 transition-colors line-clamp-2">
          {title}
        </h2>

        {description && (
          <p className="mt-1.5 text-xs text-slate-500 font-medium line-clamp-1">
            {description}
          </p>
        )}

        {children && <div className="mt-2">{children}</div>}
      </div>

      {/* Bottom Row: CTA Action link on left */}
      <div className="relative z-20 px-5 sm:px-6 pb-4 sm:pb-5 pt-0 flex items-center justify-between">
        <span className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-700 group-hover:text-teal-800 transition-colors">
          <span>{actionText || "View Details"}</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="transition-transform duration-300 group-hover:translate-x-1"
          >
            <path d="M5 12h14" />
            <path d="m12 5 7 7-7 7" />
          </svg>
        </span>
      </div>

      {/* Floating 3D Artwork Illustration */}
      {imageSrc && (
        <img
          src={imageSrc}
          alt={imageAlt}
          width={288}
          height={224}
          loading="lazy"
          decoding="async"
          className={cn(
            "absolute z-10 bottom-0 -right-6 w-48 sm:w-56 max-w-[50%]",
            "rotate-[-6deg] border border-slate-200/80 rounded-tl-xl shadow-md pointer-events-none",
            "transition-all duration-300 ease-out",
            "group-hover:-rotate-2 group-hover:-translate-y-2 group-hover:scale-105 group-hover:shadow-xl",
          )}
        />
      )}

      {/* Radiant Brand Spotlight Shine (Zero black inversion) */}
      <ClippedCircle
        circleClassName="bg-[radial-gradient(circle,rgba(13,148,136,0.22)_0%,rgba(94,234,212,0.10)_45%,transparent_70%)]"
        circleSize={500}
      />
    </Tilt>
  );

  if (href) {
    const isExternal = href.startsWith("http://") || href.startsWith("https://");
    if (isExternal) {
      return (
        <a
          href={href}
          className="block cursor-pointer"
          {...(props as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
        >
          {inner}
        </a>
      );
    }
    return (
      <Link
        href={href}
        className="block cursor-pointer"
        {...(props as any)}
      >
        {inner}
      </Link>
    );
  }

  return <div {...props}>{inner}</div>;
}
