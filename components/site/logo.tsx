import Image from "next/image";

interface LogoProps {
  className?: string;
  showTagline?: boolean;
  dark?: boolean;
}

/**
 * Logo — uses /public/logo.svg (1000×1000 square artwork).
 * No padding — logo fills the entire rounded square, zoom-in effect.
 */
export function Logo({ className = "h-12 w-auto", dark = false }: LogoProps) {
  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center rounded-xl overflow-hidden ${
        dark
          ? "ring-2 ring-white/40 bg-white/15"
          : "ring-1 ring-gray-200 bg-white"
      } ${className}`}
      style={{ aspectRatio: "1 / 1" }}
    >
      <Image
        src="/logo.svg"
        alt="All India Exam Result Logo"
        width={200}
        height={200}
        priority
        className="h-[115%] w-[115%] object-cover scale-[1.12]"
        style={{ display: "block" }}
      />
    </span>
  );
}
