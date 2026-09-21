"use client";

import * as React from "react";
import Link from "next/link";

import { cn } from "@/lib/utils";
import { ClippedCircle } from "@/components/unlumen-ui/primitives/clipped-circle";
import { Tilt, type TiltProps } from "@/components/unlumen-ui/primitives/tilt";

export interface TiltCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description?: string;
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
  success: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300",
  warning: "bg-amber-500/20 text-amber-700 dark:text-amber-300",
};

export function TiltCard({
  title,
  description,
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
      rotationFactor={11}
      {...tiltProps}
      className={cn(
        "relative group overflow-hidden",
        "bg-background border border-border rounded-lg",
        "flex flex-col gap-4",
        "h-48 sm:h-52 md:h-56 w-full",
        "hover:shadow-lg hover:scale-105 transition-all duration-300 ease-out",
        className,
      )}
    >
      <div className="relative z-20 flex flex-row transition-all duration-200 justify-between px-4 sm:px-6 py-4 sm:py-5">
        <div className="flex flex-col gap-1 flex-1 mr-2 min-w-0">
          <h2 className="text-base sm:text-lg tracking-tight leading-snug font-bold text-slate-900 group-hover:text-teal-700 transition-colors line-clamp-2">
            {title}
          </h2>
          {description && (
            <p className="text-slate-500 text-xs sm:text-sm line-clamp-1">{description}</p>
          )}
          {children && <div className="mt-2">{children}</div>}
        </div>

        {price && badgeLabel ? (
          <div className="inline-flex h-fit items-center text-xs sm:text-sm whitespace-nowrap shrink-0 shadow-xs">
            <span className="rounded-l-full bg-slate-100 text-slate-800 h-fit py-1 px-2.5 font-bold">
              {price}
            </span>
            <span
              className={cn(
                "rounded-r-full h-fit py-1 px-2.5 font-bold",
                BADGE_LABEL_CLASSES[badgeVariant],
              )}
            >
              {badgeLabel}
            </span>
          </div>
        ) : price ? (
          <span className="h-fit rounded-full bg-slate-100 text-slate-800 px-3 py-1 text-xs sm:text-sm font-bold whitespace-nowrap shrink-0">
            {price}
          </span>
        ) : null}
      </div>

      {imageSrc && (
        <img
          src={imageSrc}
          alt={imageAlt}
          width={288}
          height={224}
          loading="lazy"
          decoding="async"
          className={cn(
            "absolute z-10 top-28 w-72 -right-10",
            "rotate-[-5deg] border-border border rounded-md",
            "transition-transform duration-300 ease-out",
            "group-hover:-rotate-3 group-hover:-translate-y-1 group-hover:-translate-x-0.5",
          )}
        />
      )}

      <ClippedCircle circleClassName="bg-white" circleSize={800} />
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
