import Link from "next/link";

// Toolora logo mark: geometric "T" whose crossbar ends in an AI spark,
// on an indigo -> violet squircle with a soft top highlight.
export function LogoMark({ className = "h-9 w-9" }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={`shrink-0 ${className}`} aria-hidden focusable="false">
      <defs>
        <linearGradient id="tl-bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#4f46e5" />
          <stop offset=".55" stopColor="#7c3aed" />
          <stop offset="1" stopColor="#a21caf" />
        </linearGradient>
        <linearGradient id="tl-hl" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity=".28" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="tl-sp" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fde68a" />
          <stop offset="1" stopColor="#f59e0b" />
        </linearGradient>
      </defs>
      <rect width="40" height="40" rx="12" fill="url(#tl-bg)" />
      <path d="M0 12A12 12 0 0 1 12 0h16a12 12 0 0 1 12 12v6H0z" fill="url(#tl-hl)" />
      {/* T */}
      <rect x="8.5" y="10.5" width="15.5" height="5.2" rx="2.6" fill="#fff" />
      <rect x="13.65" y="10.5" width="5.2" height="19.5" rx="2.6" fill="#fff" />
      {/* AI spark */}
      <path d="M29.5 7.6Q30 13.1 35.4 13.6Q30 14.1 29.5 19.6Q29 14.1 23.6 13.6Q29 13.1 29.5 7.6Z" fill="url(#tl-sp)" />
      <circle cx="29.6" cy="26.6" r="1.6" fill="#fff" opacity=".55" />
    </svg>
  );
}

export default function Logo({
  href = "/",
  suffix,
  tone = "dark",
}: {
  href?: string;
  suffix?: string;
  // tone="light" => dark background par (white text)
  tone?: "dark" | "light";
}) {
  const light = tone === "light";
  return (
    <Link href={href} aria-label="Toolora.ai home" className="group flex items-center gap-2.5">
      <LogoMark className="h-9 w-9 transition-transform duration-300 group-hover:-rotate-6" />
      <span
        className={`font-serif text-[1.45rem] font-semibold leading-none tracking-[-0.02em] ${light ? "text-white" : "text-foreground"}`}
      >
        Toolora<span className={light ? "text-amber-400" : "text-amber-600"}>.ai</span>
      </span>
      {suffix && (
        <span className="rounded-md bg-accent-soft px-1.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-accent">
          {suffix}
        </span>
      )}
    </Link>
  );
}
