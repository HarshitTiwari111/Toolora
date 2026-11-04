import Link from "next/link";

// Toolora logo: rounded "T" mark with a small spark (AI), + "Toolora" wordmark + ".ai" badge.
export function LogoMark({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={`shrink-0 ${className}`} aria-hidden focusable="false">
      <defs>
        <linearGradient id="tl-g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#6366f1" />
          <stop offset="1" stopColor="#8b5cf6" />
        </linearGradient>
      </defs>
      <rect width="40" height="40" rx="11" fill="url(#tl-g)" />
      {/* T */}
      <path d="M11 12.5h18a2 2 0 0 1 0 4h-7v12a2 2 0 0 1-4 0v-12h-7a2 2 0 0 1 0-4z" fill="#fff" />
      {/* spark */}
      <path d="M30.5 22.5l1 2.4 2.4 1-2.4 1-1 2.4-1-2.4-2.4-1 2.4-1z" fill="#fcd34d" />
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
  return (
    <Link href={href} aria-label="Toolora.ai home" className="flex items-center gap-2.5">
      <LogoMark />
      <span className={`text-[1.15rem] font-bold tracking-tight ${tone === "light" ? "text-white" : "text-foreground"}`}>
        Toolora
      </span>
      <span className="-ml-1 rounded-md bg-label px-1.5 py-0.5 text-[11px] font-extrabold uppercase leading-none tracking-wide text-ink">
        .ai
      </span>
      {suffix && (
        <span className="rounded-md bg-accent-soft px-1.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-accent">
          {suffix}
        </span>
      )}
    </Link>
  );
}
