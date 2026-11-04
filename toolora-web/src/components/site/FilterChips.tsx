import Link from "next/link";

// Server-side filter: har chip ek URL hai (?pricing=free). JS ki zaroorat nahi, crawlable bhi nahi chahiye
// isliye rel="nofollow" (PDF: duplicate filter URLs index na hon).
export default function FilterChips({
  label,
  param,
  options,
  current,
  basePath,
  otherParams,
}: {
  label: string;
  param: string;
  options: { value: string; label: string }[];
  current?: string;
  basePath: string;
  otherParams: Record<string, string | undefined>;
}) {
  const href = (value?: string) => {
    const q = new URLSearchParams();
    for (const [k, v] of Object.entries(otherParams)) if (v && k !== param) q.set(k, v);
    if (value) q.set(param, value);
    const s = q.toString();
    return s ? `${basePath}?${s}` : basePath;
  };
  const chip = (active: boolean) =>
    `rounded-full border px-3 py-1.5 text-sm transition ${
      active ? "border-accent bg-accent-soft text-accent" : "border-line bg-surface text-muted hover:text-foreground"
    }`;

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="mr-1 text-xs font-semibold uppercase tracking-wide text-muted">{label}</span>
      <Link href={href()} rel="nofollow" scroll={false} className={chip(!current)}>
        All
      </Link>
      {options.map((o) => (
        <Link key={o.value} href={href(o.value)} rel="nofollow" scroll={false} className={chip(current === o.value)}>
          {o.label}
        </Link>
      ))}
    </div>
  );
}
