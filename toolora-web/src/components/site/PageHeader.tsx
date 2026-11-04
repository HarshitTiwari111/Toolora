import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Breadcrumbs, { type Crumb } from "../Breadcrumbs";
import CategoryIcon from "../CategoryIcon";
import { tone } from "@/lib/theme";
import { aiCategories } from "@/lib/site";

export const container = "mx-auto w-full max-w-[1600px] px-4 sm:px-6 lg:px-10";

// Decorative layered glass icon (hero banners ke right side).
export function GlassIcon({ icon, toneKey }: { icon: string; toneKey?: string }) {
  const t = tone(toneKey ?? icon);
  return (
    <div aria-hidden className="relative hidden h-36 w-36 shrink-0 lg:block">
      <span className="absolute inset-2 rotate-6 rounded-[2rem] opacity-50 blur-[1px]" style={{ background: `linear-gradient(135deg, ${t.from}, ${t.to})` }} />
      <span className="absolute inset-0 flex items-center justify-center rounded-[2rem] bg-white/[0.07] ring-1 ring-white/15 backdrop-blur-md">
        <span
          className="flex h-20 w-20 items-center justify-center rounded-2xl text-white shadow-[0_10px_30px_-8px_rgba(0,0,0,0.5)]"
          style={{ background: `linear-gradient(135deg, ${t.from}, ${t.to})` }}
        >
          <CategoryIcon slug={icon} className="h-10 w-10" />
        </span>
      </span>
    </div>
  );
}

// Dark hero banner (SaaS/category pages jaisa) — sab listing pages par ek jaisa.
export default function PageHeader({
  crumbs,
  eyebrow,
  title,
  description,
  icon,
  children,
}: {
  crumbs: Crumb[];
  eyebrow?: string;
  title: string;
  description?: React.ReactNode;
  // CategoryIcon key (section ya category) — right side glass icon + glow ka rang.
  icon?: string;
  children?: React.ReactNode;
}) {
  const t = tone(icon);
  return (
    <div className="relative overflow-hidden bg-ink text-white">
      <div aria-hidden className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full blur-[100px]" style={{ background: t.from, opacity: 0.45 }} />
      <div aria-hidden className="pointer-events-none absolute -bottom-40 left-1/4 h-72 w-72 rounded-full blur-[110px]" style={{ background: t.to, opacity: 0.18 }} />
      <div className={`${container} relative flex items-center justify-between gap-8 pb-12 pt-8`}>
        <div className="min-w-0 max-w-3xl">
          <Breadcrumbs items={crumbs} dark />
          {eyebrow && <p className="mb-2 text-xs font-bold uppercase tracking-widest text-label">{eyebrow}</p>}
          <h1 className="font-serif text-4xl font-semibold tracking-tight sm:text-5xl">{title}</h1>
          {description && <div className="mt-4 text-lg leading-relaxed text-ink-muted">{description}</div>}
          {children}
        </div>
        {icon && <GlassIcon icon={icon} />}
      </div>
    </div>
  );
}

export function EmptyState({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-line bg-surface px-6 py-14 text-center">
      <p className="font-semibold">{title}</p>
      <p className="mx-auto mt-1 max-w-md text-sm text-muted">{text}</p>
    </div>
  );
}

// Khaali section par bhi page kaam ka lage: categories aur doosre sections ke links.
export function ExploreInstead({ title = "Nothing published here yet", text }: { title?: string; text: string }) {
  return (
    <div className="space-y-10">
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-line bg-surface p-6 shadow-card sm:p-8">
        <div>
          <p className="font-serif text-2xl font-semibold">{title}</p>
          <p className="mt-1 max-w-xl text-muted">{text}</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link href="/blog/" className="inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-white hover:bg-ink-2">
            Read the blog <ArrowRight className="h-4 w-4" />
          </Link>
          <Link href="/ai-tools/" className="rounded-full border border-line px-5 py-2.5 text-sm font-semibold hover:border-ink">
            Browse AI tools
          </Link>
        </div>
      </div>
      <div>
        <h2 className="mb-5 font-serif text-2xl font-semibold tracking-tight">Explore by category</h2>
        <ul className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5">
          {aiCategories.map((c) => {
            const t = tone(c.slug);
            return (
              <li key={c.slug}>
                <Link href={`/ai-tools/${c.slug}/`} className="flex h-full items-center gap-3 rounded-xl border border-line bg-surface p-4 transition hover:border-accent/50 hover:shadow-card">
                  <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg" style={{ background: t.soft, color: t.ink }}>
                    <CategoryIcon slug={c.slug} className="h-5 w-5" />
                  </span>
                  <span className="text-sm font-bold">{c.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
