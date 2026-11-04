import Link from "next/link";

export type Crumb = { label: string; href?: string };

export default function Breadcrumbs({ items, dark = false }: { items: Crumb[]; dark?: boolean }) {
  const all: Crumb[] = [{ label: "Home", href: "/" }, ...items];
  return (
    <nav aria-label="Breadcrumb" className={`mb-6 text-sm ${dark ? "text-ink-muted" : "text-muted"}`}>
      <ol className="flex min-w-0 flex-wrap gap-x-1.5 gap-y-1">
        {all.map((c, i) => (
          <li key={i} className="flex min-w-0 items-center gap-1.5">
            {i > 0 && <span aria-hidden>/</span>}
            {c.href && i < all.length - 1 ? (
              <Link href={c.href} className={dark ? "hover:text-white" : "hover:text-foreground"}>
                {c.label}
              </Link>
            ) : (
              <span aria-current="page" className={`max-w-[14rem] truncate sm:max-w-md ${dark ? "text-white" : "text-foreground"}`}>
                {c.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
