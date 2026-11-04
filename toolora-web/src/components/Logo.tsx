import Link from "next/link";

export function LogoMark({ className = "h-8 w-8 text-sm" }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={`inline-flex shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-accent to-accent-2 font-bold text-white ${className}`}
    >
      T
    </span>
  );
}

export default function Logo({ href = "/", suffix }: { href?: string; suffix?: string }) {
  return (
    <Link href={href} className="flex items-center gap-2.5 text-lg font-bold tracking-tight">
      <LogoMark />
      <span>
        Toolora<span className="text-accent">.ai</span>
      </span>
      {suffix && (
        <span className="rounded-md bg-accent-soft px-1.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-accent">
          {suffix}
        </span>
      )}
    </Link>
  );
}
