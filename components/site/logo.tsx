export function Logo({ className = "h-12 w-auto", showTagline = true, dark = false }: { className?: string; showTagline?: boolean; dark?: boolean }) {
  const c = dark ? "#FFFFFF" : "#0D9488";
  const c2 = dark ? "rgba(255,255,255,0.6)" : "#0F766E";
  const accent = "#EA580C";
  const muted = dark ? "rgba(255,255,255,0.5)" : "#64748B";

  return (
    <svg className={className} viewBox="0 0 280 60" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="2" y="2" width="44" height="44" rx="9" fill={c} opacity="0.1" />
      <rect x="2" y="2" width="44" height="44" rx="9" stroke={c} strokeWidth="1.5" />
      <path d="M12 38 L24 8 L36 38" stroke={accent} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      <line x1="14.5" y1="30" x2="33.5" y2="30" stroke={accent} strokeWidth="2.5" strokeLinecap="round" />
      <path d="M20 12 L24 6 L28 12" fill={c} />
      <rect x="22.5" y="12" width="3" height="3" rx="0.7" fill={c} />
      <path d="M21 16 Q24 18 27 16" stroke={c} strokeWidth="1.2" strokeLinecap="round" fill="none" />

      <text x="54" y="24" fontFamily="Inter, system-ui, sans-serif" fontWeight="900" fontSize="26" letterSpacing="3" fill={c}>AIER</text>
      <text x="54" y="40" fontFamily="Inter, system-ui, sans-serif" fontWeight="700" fontSize="11" letterSpacing="2" fill={c2}>ALL INDIA EXAM RESULT</text>
      <text x="54" y="52" fontFamily="Inter, system-ui, sans-serif" fontWeight="800" fontSize="12" letterSpacing="1.5" fill={accent}>RESULT</text>
      <text x={dark ? "112" : "110"} y="52" fontFamily="Inter, system-ui, sans-serif" fontWeight="500" fontSize="11" fill={muted} letterSpacing="0.5"> &amp; JOB UPDATES</text>
    </svg>
  );
}
