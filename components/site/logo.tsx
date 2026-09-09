import Image from "next/image";

interface LogoProps {
  className?: string;
  showTagline?: boolean;
  dark?: boolean;
}

/**
 * Logo — uses /public/logo.svg (1000×1000 square artwork).
 *
 * In the header  → dark=true  → white ring so it pops on teal bg, height ~40px
 * In the footer  → dark=false → natural colors on white bg,  height ~56px
 */
export function Logo({ className = "h-12 w-auto", dark = false }: LogoProps) {
  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center rounded-xl overflow-hidden ${
        dark
          ? "ring-2 ring-white/30 bg-white/10"
          : "ring-1 ring-gray-200 bg-white"
      } ${className}`}
      style={{ aspectRatio: "1 / 1", padding: "3%" }}
    >
      <Image
        src="/logo.svg"
        alt="All India Exam Result Logo"
        width={120}
        height={120}
        priority
        className="h-full w-full object-contain"
        style={{ display: "block" }}
      />
    </span>
  );
}
