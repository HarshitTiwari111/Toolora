import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import ArticleCard, { NumberedList } from "@/components/site/ArticleCard";
import CategoryIcon from "@/components/CategoryIcon";
import GoalPicker, { type Goal } from "@/components/site/GoalPicker";
import SearchForm from "@/components/site/SearchForm";
import { container } from "@/components/site/PageHeader";
import { listArticles, listProducts, type ArticleSummary, type PublicProduct } from "@/lib/content";
import { articleCategory, articleTypeLabels, fmtDate, pricingLabels } from "@/lib/labels";
import { pageMetadata } from "@/lib/seo";
import { aiCategories, saasCategories, siteConfig } from "@/lib/site";
import { tone } from "@/lib/theme";

export const metadata: Metadata = pageMetadata({
  title: `${siteConfig.name} — AI tools reviews, comparisons and guides`,
  description:
    "Research-based reviews, comparisons, alternatives and guides for AI tools and SaaS. Every pricing and feature claim links to its source and shows when it was checked.",
  path: "/",
  absoluteTitle: true,
});

// Hero tiles (reference jaisa 4 per row).
const tiles = [
  { href: "/ai-tools/writing/", label: "AI Writing Tools", icon: "writing" },
  { href: "/ai-tools/coding/", label: "AI Coding Assistants", icon: "coding" },
  { href: "/ai-tools/image-generation/", label: "AI Image Generators", icon: "image-generation" },
  { href: "/ai-tools/video/", label: "AI Video Tools", icon: "video" },
  { href: "/ai-tools/audio/", label: "AI Voice & Audio", icon: "audio" },
  { href: "/ai-tools/productivity/", label: "AI Meeting & Productivity", icon: "productivity" },
  { href: "/ai-tools/marketing/", label: "AI Marketing & Sales", icon: "marketing" },
  { href: "/ai-tools/automation/", label: "AI Agents & Automation", icon: "automation" },
  { href: "/ai-tools/chatbots/", label: "AI Chatbots & Support", icon: "chatbots" },
  { href: "/ai-tools/research/", label: "AI Research Assistants", icon: "research" },
  { href: "/saas/crm/", label: "CRM Software", icon: "crm" },
  { href: "/saas/project-management/", label: "Project Management", icon: "project-management" },
];

const GOALS: { key: string; label: string; emoji: string; cat: string; summary: string }[] = [
  { key: "write", label: "Write content", emoji: "✍️", cat: "writing", summary: "Draft blogs, ads and emails faster — without losing your voice." },
  { key: "video", label: "Make videos", emoji: "🎬", cat: "video", summary: "Create, edit and repurpose video with AI, from scripts to captions." },
  { key: "images", label: "Create images", emoji: "🎨", cat: "image-generation", summary: "Generate visuals, product shots and brand assets with AI." },
  { key: "automate", label: "Automate work", emoji: "⚙️", cat: "automation", summary: "Connect your apps and let AI agents handle repetitive workflows." },
  { key: "market", label: "Market & sell", emoji: "📈", cat: "marketing", summary: "Find leads, personalise outreach and run campaigns with AI help." },
  { key: "support", label: "Support customers", emoji: "💬", cat: "chatbots", summary: "Answer customers 24/7 with AI chat that hands off to humans." },
  { key: "code", label: "Code faster", emoji: "💻", cat: "coding", summary: "Pair-program with AI assistants and ship features in less time." },
  { key: "meetings", label: "Run meetings", emoji: "🗓️", cat: "productivity", summary: "Record, summarise and act on meetings without taking notes." },
];

const METHOD = [
  { n: "01", title: "Official sources", text: "Pricing, plans and features come from the vendor's own pages — linked next to each fact." },
  { n: "02", title: "Dated facts", text: "Every fact shows when we checked it, and pages are queued for regular re-checks." },
  { n: "03", title: "Human approval", text: "AI may help draft; an editor verifies and approves every page before it goes live." },
];

function SectionHead({
  eyebrow,
  title,
  text,
  link,
  center = false,
  dark = false,
}: {
  eyebrow?: string;
  title: string;
  text?: React.ReactNode;
  link?: { href: string; label: string };
  center?: boolean;
  dark?: boolean;
}) {
  return (
    <div className={`mb-10 flex flex-wrap items-end justify-between gap-4 ${center ? "justify-center text-center" : ""}`}>
      <div className={center ? "mx-auto max-w-2xl" : "max-w-2xl"}>
        {eyebrow && <p className={`mb-2 text-xs font-bold uppercase tracking-widest ${dark ? "text-label" : "text-accent"}`}>{eyebrow}</p>}
        <h2 className="font-serif text-3xl font-semibold tracking-tight sm:text-[2.6rem] sm:leading-[1.15]">{title}</h2>
        {text && <p className={`mt-3 ${dark ? "text-ink-muted" : "text-muted"}`}>{text}</p>}
      </div>
      {link && (
        <Link href={link.href} className={`inline-flex items-center gap-1 text-sm font-bold ${dark ? "text-label" : "text-accent"} hover:underline`}>
          {link.label} <ArrowRight className="h-4 w-4" />
        </Link>
      )}
    </div>
  );
}

function countBy(products: PublicProduct[]) {
  const m = new Map<string, number>();
  for (const p of products) for (const c of p.categories) m.set(c, (m.get(c) ?? 0) + 1);
  return m;
}

function buildGoals(articles: ArticleSummary[], aiProducts: PublicProduct[]): Goal[] {
  return GOALS.map((g) => {
    const cat = aiCategories.find((c) => c.slug === g.cat)!;
    return {
      key: g.key,
      label: g.label,
      emoji: g.emoji,
      summary: g.summary,
      hub: { href: `/ai-tools/${g.cat}/`, label: `All ${cat.name} tools` },
      guides: articles
        .filter((a) => a.category === g.cat)
        .slice(0, 3)
        .map((a) => ({ href: a.url, title: a.title, meta: `${articleTypeLabels[a.articleType]} · ${fmtDate(a.updatedAt ?? a.publishedAt) ?? ""}` })),
      tools: aiProducts
        .filter((p) => p.categories.includes(g.cat))
        .slice(0, 3)
        .map((p) => ({ href: p.url, name: p.brandName, meta: pricingLabels[p.pricingModel] })),
    };
  });
}

export default async function Home() {
  const [{ items: all }, { items: aiProducts }, { items: saasProducts }] = await Promise.all([
    listArticles({ limit: 60 }),
    listProducts({ type: "ai" }),
    listProducts({ type: "saas" }),
  ]);
  const latest = all.slice(0, 3);
  const guides = all.filter((a) => a.articleType === "guide" || a.articleType === "alternatives").slice(0, 5);
  const reviews = all.filter((a) => a.articleType === "review" || a.articleType === "compare").slice(0, 5);
  const picks = all.filter((a) => a.articleType !== "guide").slice(0, 6);
  const comparisons = all.filter((a) => a.articleType === "compare").slice(0, 8);
  const aiCounts = countBy(aiProducts);
  const saasCounts = countBy(saasProducts);
  const goals = buildGoals(all, aiProducts);

  return (
    <>
      {/* ---------- Hero ---------- */}
      <section className="relative overflow-hidden bg-ink text-white">
        <div aria-hidden className="pointer-events-none absolute -right-32 -top-40 h-[38rem] w-[38rem] rounded-full bg-accent/25 blur-[120px]" />
        <div aria-hidden className="pointer-events-none absolute -bottom-56 -left-20 h-[30rem] w-[30rem] rounded-full bg-label/10 blur-[110px]" />
        <div className={`${container} relative pb-20 pt-14 sm:pt-20`}>
          <p className="mb-6 inline-flex rounded-full border border-label/50 bg-label/10 px-3 py-1 text-xs font-semibold text-label">
            Independent reviews · AI-first guides · Sourced facts
          </p>
          <h1 className="max-w-4xl font-serif text-[2.6rem] font-semibold leading-[1.05] tracking-tight sm:text-[4.2rem]">
            Find, compare &amp; choose the right AI tools.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-muted">
            Practical reviews, comparisons and guides for AI tools and SaaS — every price and feature linked to its source, with the
            date we checked it.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link href="/ai-tools/" className="inline-flex items-center gap-2 rounded-full bg-label px-6 py-3 font-bold text-ink transition hover:brightness-95">
              Browse AI Tools <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/blog/" className="rounded-full border border-white/70 px-6 py-3 font-semibold transition hover:bg-white hover:text-ink">
              Read the Blog
            </Link>
          </div>

          <ul className="mt-14 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {tiles.map((t) => {
              const c = tone(t.icon);
              return (
                <li key={t.href}>
                  <Link
                    href={t.href}
                    className="group flex h-full flex-col items-center justify-center gap-4 rounded-2xl bg-surface px-4 py-7 text-center text-foreground shadow-lg transition hover:-translate-y-1 hover:shadow-2xl"
                  >
                    <span className="relative inline-flex h-14 w-14 items-center justify-center rounded-2xl" style={{ background: c.soft, color: c.ink }}>
                      <CategoryIcon slug={t.icon} className="h-7 w-7" />
                      <span aria-hidden className="absolute -right-1 -top-1 h-3 w-3 rounded-full bg-label ring-2 ring-white" />
                    </span>
                    <span className="text-[15px] font-bold leading-snug sm:text-base">{t.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* ---------- Latest articles ---------- */}
      <section className="py-20">
        <div className={container}>
          <SectionHead
            center
            title="Latest Articles"
            text={
              <>
                New reviews, comparisons and guides every week. Read{" "}
                <Link href="/blog/" className="font-bold uppercase text-accent hover:underline">
                  our blog
                </Link>{" "}
                to stay up to date with the best AI tools.
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
            <p className="rounded-2xl border border-dashed border-line bg-surface p-10 text-center text-muted">The first articles are being researched and reviewed.</p>
          )}
          {(guides.length > 0 || reviews.length > 0) && (
            <div className="mt-14 grid gap-6 lg:grid-cols-2">
              {guides.length > 0 && <NumberedList title="Latest guides & how-tos" items={guides} />}
              {reviews.length > 0 && <NumberedList title="Latest reviews & comparisons" items={reviews} />}
            </div>
          )}
        </div>
      </section>

      {/* ---------- Goal picker ---------- */}
      <section className="border-y border-line bg-surface py-20">
        <div className={container}>
          <SectionHead eyebrow="Personalised path" title="What are you trying to do?" text="Pick a goal. We'll point you to the right guides, tools and categories." />
          <GoalPicker goals={goals} />
        </div>
      </section>

      {/* ---------- Honest picks ---------- */}
      {picks.length > 0 && (
        <section className="py-20">
          <div className={container}>
            <SectionHead
              eyebrow="Reviews"
              title="Honest picks, no paid rankings"
              text="Transparent criteria, real trade-offs and no invented scores. Prices link to official pages so they're always checkable."
              link={{ href: "/reviews/", label: "All reviews" }}
            />
            <ol className="grid gap-4 md:grid-cols-2">
              {picks.map((a, i) => (
                <li key={a._id}>
                  <Link href={a.url} className="group flex h-full gap-4 rounded-2xl border border-line bg-surface p-5 transition hover:border-accent/50 hover:shadow-card">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-ink font-serif text-lg font-semibold text-label">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="min-w-0">
                      <span className="block font-bold leading-snug group-hover:text-accent">{a.title}</span>
                      {a.excerpt && <span className="mt-1 line-clamp-2 block text-sm text-muted">{a.excerpt}</span>}
                      <span className="mt-2 block text-xs font-semibold uppercase tracking-wide text-accent">
                        {articleTypeLabels[a.articleType]}
                        {articleCategory(a) ? ` · ${articleCategory(a)!.name}` : ""}
                      </span>
                    </span>
                  </Link>
                </li>
              ))}
            </ol>
          </div>
        </section>
      )}

      {/* ---------- Method (dark) ---------- */}
      <section className="bg-ink py-20 text-white">
        <div className={`${container} grid items-center gap-12 lg:grid-cols-[1fr_1.15fr]`}>
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-widest text-label">How we review</p>
            <h2 className="font-serif text-3xl font-semibold tracking-tight sm:text-[2.6rem] sm:leading-[1.15]">Facts you can check, not scores we invented</h2>
            <p className="mt-4 max-w-xl leading-relaxed text-ink-muted">
              Most &ldquo;best AI tools&rdquo; lists recycle vendor claims. We link every price and feature to its official source,
              date it, and say clearly when a page is research-based rather than hands-on tested.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/how-we-review/" className="rounded-full bg-label px-6 py-3 font-bold text-ink transition hover:brightness-95">
                Our method
              </Link>
              <Link href="/editorial-policy/" className="rounded-full border border-white/70 px-6 py-3 font-semibold transition hover:bg-white hover:text-ink">
                Editorial policy
              </Link>
            </div>
          </div>
          <ul className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1 2xl:grid-cols-3">
            {METHOD.map((m) => (
              <li key={m.n} className="rounded-2xl border border-ink-line bg-ink-2 p-6">
                <span className="font-serif text-lg font-semibold text-label">{m.n}</span>
                <h3 className="mt-3 font-bold">{m.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-muted">{m.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ---------- AI directory ---------- */}
      <section className="py-20">
        <div className={container}>
          <SectionHead
            eyebrow="AI tools directory"
            title="Find the right AI tool, fast"
            text="Writing, coding, video, automation and more — with transparent verification dates and no invented ratings."
            link={{ href: "/ai-tools/", label: "Browse all AI tools" }}
          />
          <ul className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5">
            {aiCategories.map((c) => {
              const n = aiCounts.get(c.slug) ?? 0;
              const t = tone(c.slug);
              return (
                <li key={c.slug}>
                  <Link href={`/ai-tools/${c.slug}/`} className="group flex h-full items-center gap-3 rounded-xl border border-line bg-surface p-4 transition hover:border-accent/50 hover:shadow-card">
                    <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg" style={{ background: t.soft, color: t.ink }}>
                      <CategoryIcon slug={c.slug} className="h-5 w-5" />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-sm font-bold">{c.name}</span>
                      <span className="text-xs text-muted">{n ? `${n} tool${n === 1 ? "" : "s"}` : "Coming soon"}</span>
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* ---------- SaaS ---------- */}
      <section className="border-y border-line bg-surface py-20">
        <div className={container}>
          <SectionHead
            eyebrow="SaaS reviews"
            title="Business software, and the AI inside it"
            text="CRMs, project tools, email platforms and more — reviewed with the same no-fake-scores rules."
            link={{ href: "/saas/", label: "All SaaS categories" }}
          />
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {saasCategories.map((c) => {
              const n = saasCounts.get(c.slug) ?? 0;
              const t = tone(c.slug);
              return (
                <li key={c.slug}>
                  <Link href={`/saas/${c.slug}/`} className="group flex h-full flex-col rounded-2xl border border-line bg-background p-6 transition hover:border-accent/50 hover:shadow-card">
                    <span className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl" style={{ background: t.soft, color: t.ink }}>
                      <CategoryIcon slug={c.slug} className="h-6 w-6" />
                    </span>
                    <span className="text-lg font-bold">{c.name}</span>
                    <span className="mt-1 text-sm text-muted">{c.description}</span>
                    <span className="mt-auto flex items-center justify-between pt-5 text-sm">
                      <span className="text-muted">{n ? `${n} product${n === 1 ? "" : "s"}` : "Coming soon"}</span>
                      <ArrowRight className="h-4 w-4 text-accent transition group-hover:translate-x-0.5" />
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* ---------- Comparisons ---------- */}
      {comparisons.length > 0 && (
        <section className="py-20">
          <div className={container}>
            <SectionHead
              eyebrow="Compare"
              title="Side-by-side, no paid winners"
              text="Transparent criteria and factual differences, so you can decide for your situation."
              link={{ href: "/compare/", label: "All comparisons" }}
            />
            <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {comparisons.map((a) => (
                <li key={a._id}>
                  <Link href={a.url} className="block h-full rounded-xl border border-line bg-surface p-4 transition hover:border-accent/50 hover:shadow-card">
                    <span className="block font-bold leading-snug">{a.title}</span>
                    <span className="mt-1 block text-xs text-muted">{articleCategory(a)?.name ?? "Comparison"}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* ---------- CTA band ---------- */}
      <section className="pb-4 pt-4">
        <div className={container}>
          <div className="relative overflow-hidden rounded-3xl bg-label px-6 py-12 text-ink sm:px-12">
            <div aria-hidden className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-white/30 blur-2xl" />
            <div className="relative grid items-center gap-8 lg:grid-cols-[1fr_1fr]">
              <div>
                <h2 className="font-serif text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">Not sure which AI tool fits?</h2>
                <p className="mt-3 max-w-lg text-ink/80">Search by tool name, task or category — or start from a category and compare side by side.</p>
              </div>
              <div className="space-y-3">
                <SearchForm />
                <Link href="/ai-tools/" className="inline-flex items-center gap-1 text-sm font-bold text-ink hover:underline">
                  Or browse all categories <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
