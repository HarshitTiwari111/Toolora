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
  counts,
  stacked = false,
}: {
  label: string;
  param: string;
  options: { value: string; label: string }[];
  current?: string;
  basePath: string;
  otherParams: Record<string, string | undefined>;
  // value -> kitne tools (sidebar me chhota number)
  counts?: Record<string, number>;
  // Sidebar: label upar, chips neeche
  stacked?: boolean;
}) {
  const href = (value?: string) => {
    const q = new URLSearchParams();
    for (const [k, v] of Object.entries(otherParams)) if (v && k !== param) q.set(k, v);
    if (value) q.set(param, value);
    const s = q.toString();
    return s ? `${basePath}?${s}` : basePath;
  };
  const chip = (active: boolean) =>
    `inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm transition ${
      active ? "border-accent bg-accent text-white shadow-sm" : "border-line bg-surface text-muted hover:border-accent/50 hover:text-foreground"
    }`;
  const badge = (active: boolean) => `rounded-full px-1.5 text-[11px] font-semibold ${active ? "bg-white/25 text-white" : "bg-surface-2 text-muted"}`;

  return (
    <div className={stacked ? "space-y-2.5" : "flex flex-wrap items-center gap-2"}>
      <span className={`block text-xs font-bold uppercase tracking-widest ${stacked ? "text-foreground" : "mr-1 text-muted"}`}>{label}</span>
      <div className="flex flex-wrap gap-2">
        <Link href={href()} rel="nofollow" scroll={false} className={chip(!current)}>
          All
        </Link>
        {options.map((o) => {
          const active = current === o.value;
          return (
            <Link key={o.value} href={href(o.value)} rel="nofollow" scroll={false} className={chip(active)}>
              {o.label}
              {counts?.[o.value] !== undefined && <span className={badge(active)}>{counts[o.value]}</span>}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
