import Image from "next/image";

interface LogoProps {
  className?: string;
  showTagline?: boolean;
  dark?: boolean;
}

export function Logo({ className = "h-12 w-auto" }: LogoProps) {
  return (
    <Image
      src="/logo.svg"
      alt="All India Exam Result Logo"
      width={200}
      height={200}
      priority
      className={`object-contain ${className}`}
    />
  );
}

