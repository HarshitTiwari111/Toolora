import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, BadgeCheck, CalendarCheck, Link2, ShieldCheck } from "lucide-react";
import ArticleCard, { NumberedList } from "@/components/site/ArticleCard";
import CategoryIcon from "@/components/CategoryIcon";
import SearchForm from "@/components/site/SearchForm";
import { container } from "@/components/site/PageHeader";
import { listArticles } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
import { aiCategories, saasCategories, siteConfig } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: `${siteConfig.name} — AI tools reviews, comparisons and guides`,
  description:
    "Research-based reviews, comparisons, alternatives and guides for AI tools and SaaS. Every pricing and feature claim links to its source and shows when it was checked.",
  path: "/",
  absoluteTitle: true,
});

const tiles = [
  ...aiCategories.map((c) => ({ href: `/ai-tools/${c.slug}/`, label: c.name, icon: c.slug })),
  { href: "/saas/", label: "SaaS Software", icon: "project-management" },
  { href: "/compare/", label: "Compare Tools", icon: "analytics" },
];

const principles = [
  { icon: Link2, title: "Every claim has a source", text: "Pricing and features link to the vendor's official page, so you can check them yourself." },
  { icon: CalendarCheck, title: "Dated, not stale", text: "Each fact shows when it was last verified, and pages are queued for regular refreshes." },
  { icon: ShieldCheck, title: "Honest about method", text: "We say clearly when a page is research-based. No invented test results or star ratings." },
  { icon: BadgeCheck, title: "Reviewed by an editor", text: "Nothing is published automatically. A human editor checks every page before it goes live." },
];

function SectionHead({ eyebrow, title, text, center = true }: { eyebrow?: string; title: string; text?: React.ReactNode; center?: boolean }) {
  return (
    <div className={`mb-10 ${center ? "mx-auto max-w-2xl text-center" : ""}`}>
      {eyebrow && <p className="mb-2 text-xs font-bold uppercase tracking-widest text-accent">{eyebrow}</p>}
      <h2 className="font-serif text-3xl font-bold tracking-tight sm:text-4xl">{title}</h2>
      {text && <p className="mt-3 text-muted">{text}</p>}
    </div>
  );
}

export default async function Home() {
  const all = (await listArticles({ limit: 30 })).items;
  const latest = all.slice(0, 3);
  const guides = all.filter((a) => a.articleType === "guide" || a.articleType === "alternatives").slice(0, 5);
  const reviews = all.filter((a) => a.articleType === "review" || a.articleType === "compare").slice(0, 5);

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-ink text-white">
        <div aria-hidden className="pointer-events-none absolute -right-40 -top-40 h-[34rem] w-[34rem] rounded-full bg-accent/30 blur-3xl" />
        <div aria-hidden className="pointer-events-none absolute -bottom-48 left-1/3 h-[28rem] w-[28rem] rounded-full bg-accent-2/20 blur-3xl" />
        <div className={`${container} relative pb-16 pt-14 sm:pt-20`}>
          <p className="mb-6 inline-flex rounded-full border border-label/60 bg-label/10 px-3 py-1 text-xs font-semibold text-label">
            Independent reviews · AI-first guides · Sourced facts
          </p>
          <h1 className="max-w-4xl font-serif text-4xl font-bold leading-[1.08] tracking-tight sm:text-6xl">
            Find the right AI tool — with facts you can check.
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-ink-muted">
            Research-based reviews, comparisons, alternatives and guides for AI tools and SaaS. Every price and feature links to its
            source and shows when we checked it.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link href="/ai-tools/" className="inline-flex items-center gap-2 rounded-full bg-label px-6 py-3 font-bold text-ink transition hover:brightness-95">
              Browse AI tools <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/blog/" className="rounded-full border border-white/70 px-6 py-3 font-semibold transition hover:bg-white hover:text-ink">
              Read the blog
            </Link>
          </div>
          <div className="mt-8 max-w-2xl">
            <SearchForm />
          </div>

          <ul className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
            {tiles.map((t) => (
              <li key={t.href}>
                <Link
                  href={t.href}
                  className="flex h-full flex-col items-center justify-center gap-3 rounded-2xl bg-surface px-4 py-6 text-center text-foreground shadow-card transition hover:-translate-y-0.5 hover:shadow-xl"
                >
                  <span className="text-accent">
                    <CategoryIcon slug={t.icon} className="h-9 w-9" />
                  </span>
                  <span className="text-sm font-bold">{t.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* SaaS */}
      <section className="border-b border-line bg-surface py-16 sm:py-20">
        <div className={container}>
          <SectionHead
            eyebrow="SaaS reviews"
            title="Business software, and the AI inside it"
            text="CRMs, project tools, email platforms and more — reviewed with the same no-fake-scores rules as everything else."
          />
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {saasCategories.map((c) => (
              <li key={c.slug}>
                <Link href={`/saas/${c.slug}/`} className="group flex h-full flex-col rounded-2xl border border-line bg-background p-6 transition hover:border-accent/50 hover:shadow-card">
                  <span className="mb-4 text-accent">
                    <CategoryIcon slug={c.slug} className="h-9 w-9" />
                  </span>
                  <span className="text-lg font-bold">{c.name}</span>
                  <span className="mt-1 text-sm text-muted">{c.description}</span>
                  <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-accent">
                    Browse <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-10 text-center">
            <Link href="/saas/" className="inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 font-semibold text-white transition hover:bg-ink-2">
              All SaaS categories <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Latest articles */}
      <section className="py-16 sm:py-20">
        <div className={container}>
          <SectionHead
            title="Latest Articles"
            text={
              <>
                New reviews, comparisons and guides — read{" "}
                <Link href="/blog/" className="font-bold uppercase text-accent hover:underline">
                  our blog
                </Link>{" "}
                to keep up with the best AI tools.
              </>
            }
          />
          {latest.length ? (
            <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {latest.map((a, i) => (
                <li key={a._id}>
                  <ArticleCard article={a} priority={i === 0} />
                </li>
              ))}
            </ul>
          ) : (
            <p className="rounded-2xl border border-dashed border-line bg-surface p-10 text-center text-muted">
              The first articles are being researched and reviewed.
            </p>
          )}

          {(guides.length > 0 || reviews.length > 0) && (
            <div className="mt-14 grid gap-6 lg:grid-cols-2">
              {guides.length > 0 && <NumberedList title="Latest guides" items={guides} />}
              {reviews.length > 0 && <NumberedList title="Latest reviews & comparisons" items={reviews} />}
            </div>
          )}
        </div>
      </section>

      {/* Trust */}
      <section className="pb-4">
        <div className={container}>
          <div className="rounded-3xl bg-ink p-8 text-white sm:p-12">
            <h2 className="font-serif text-3xl font-bold tracking-tight">How Toolora.ai works</h2>
            <p className="mt-2 max-w-2xl text-ink-muted">Useful first. Here is what you can expect from every page.</p>
            <ul className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {principles.map((p) => (
                <li key={p.title}>
                  <span className="mb-3 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 text-label">
                    <p.icon className="h-5 w-5" />
                  </span>
                  <h3 className="font-bold">{p.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-ink-muted">{p.text}</p>
                </li>
              ))}
            </ul>
            <Link href="/how-we-review/" className="mt-10 inline-flex items-center gap-1 font-semibold text-label hover:underline">
              Read how we review <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
