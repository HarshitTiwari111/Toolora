import Link from "next/link";
import { BadgeCheck, CalendarCheck, ExternalLink, FlaskConical, Info, Link2, UserCheck } from "lucide-react";
import type { PublicArticle, PublicProduct } from "@/lib/content";
import { cleanArticleHtml } from "@/lib/sanitize";
import { areaBase, categoryName, fmtDate, platformName, pricingLabels } from "@/lib/labels";

const profileUrl = (p: PublicProduct) => p.url ?? `${areaBase(p.productType)}/${p.slug}/`;
import Breadcrumbs from "../Breadcrumbs";
import BrandMark from "./BrandMark";
import { container } from "./PageHeader";

function ProductCta({ p, compact = false }: { p: PublicProduct; compact?: boolean }) {
  const affiliate = Boolean(p.affiliateUrl);
  return (
    <a
      href={affiliate ? p.affiliateUrl : p.officialUrl}
      target="_blank"
      rel={affiliate ? "sponsored nofollow noopener noreferrer" : "noopener noreferrer"}
      className={`inline-flex items-center justify-center gap-1.5 rounded-lg bg-accent font-medium text-white transition hover:opacity-90 ${
        compact ? "px-3 py-1.5 text-xs" : "px-4 py-2 text-sm"
      }`}
    >
      Visit {p.brandName} <ExternalLink className="h-3.5 w-3.5" />
    </a>
  );
}

// Compare article: dono products side by side (PDF: dated, sourced facts).
function CompareTable({ products }: { products: PublicProduct[] }) {
  const rows: { label: string; value: (p: PublicProduct) => React.ReactNode }[] = [
    { label: "Pricing model", value: (p) => pricingLabels[p.pricingModel] },
    { label: "Platforms", value: (p) => p.platforms.map(platformName).join(", ") || "—" },
    { label: "Categories", value: (p) => p.categories.map((c) => categoryName(p.productType, c)).join(", ") || "—" },
    { label: "Facts verified", value: (p) => fmtDate(p.lastVerifiedAt) ?? "Not yet" },
    { label: "Full profile", value: (p) => <Link href={profileUrl(p)} className="text-accent hover:underline">View profile</Link> },
    { label: "", value: (p) => <ProductCta p={p} compact /> },
  ];
  return (
    <div className="not-prose my-8 overflow-x-auto rounded-2xl border border-line bg-surface shadow-card">
      <table className="w-full min-w-[520px] text-sm">
        <thead>
          <tr className="bg-surface-2/60">
            <th scope="col" className="w-40 px-4 py-4 text-left text-xs uppercase tracking-wide text-muted">At a glance</th>
            {products.map((p) => (
              <th key={p._id} scope="col" className="px-4 py-4 text-left">
                <span className="flex items-center gap-2.5">
                  <BrandMark name={p.brandName} />
                  <span className="font-semibold">{p.brandName}</span>
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className="border-t border-line">
              <th scope="row" className="px-4 py-3 text-left font-medium text-muted">{r.label}</th>
              {products.map((p) => (
                <td key={p._id} className="px-4 py-3">{r.value(p)}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function ArticleView({
  article: a,
  sectionLabel,
  sectionHref,
  pageType,
}: {
  article: PublicArticle;
  sectionLabel: string;
  sectionHref: string;
  pageType: string;
}) {
  const products = a.products.filter(Boolean);
  // Products ki categories ke hub links (unique).
  const hubs = [
    ...new Map(
      products.flatMap((p) =>
        p.categories.map((c) => {
          const href = `${areaBase(p.productType)}/${c}/`;
          return [href, { href, name: categoryName(p.productType, c) }] as const;
        }),
      ),
    ).values(),
  ];
  const html = cleanArticleHtml(a.body);
  const handsOn = a.reviewMethod === "hands_on";
  const updated = fmtDate(a.updatedAt);
  const published = fmtDate(a.publishedAt);

  return (
    <article>
      <header className="hero-glow border-b border-line">
        <div className={`${container} pb-10 pt-8`}>
          <Breadcrumbs items={[{ label: sectionLabel, href: sectionHref }, { label: a.title }]} />
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-accent">{pageType}</p>
          <h1 className="max-w-4xl text-3xl font-bold leading-tight tracking-tight sm:text-5xl">{a.title}</h1>
          {a.excerpt && <p className="mt-4 max-w-3xl text-lg leading-relaxed text-muted">{a.excerpt}</p>}
          <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted">
            {a.author && <li>By <span className="font-medium text-foreground">{a.author}</span></li>}
            {a.reviewer && (
              <li className="inline-flex items-center gap-1.5">
                <UserCheck className="h-4 w-4" /> Reviewed by <span className="font-medium text-foreground">{a.reviewer}</span>
              </li>
            )}
            {updated && (
              <li className="inline-flex items-center gap-1.5">
                <CalendarCheck className="h-4 w-4" /> Updated <time dateTime={a.updatedAt}>{updated}</time>
              </li>
            )}
            <li className="inline-flex items-center gap-1.5">
              {handsOn ? <FlaskConical className="h-4 w-4" /> : <BadgeCheck className="h-4 w-4" />}
              {handsOn ? "Hands-on tested" : "Research-based overview"}
            </li>
          </ul>
        </div>
      </header>

      <div className={`${container} grid gap-10 py-12 lg:grid-cols-[minmax(0,1fr)_340px]`}>
        <div className="min-w-0">
          {a.disclosure && (
            <p className="mb-8 flex gap-3 rounded-2xl border border-line bg-surface p-4 text-sm text-muted">
              <Info className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
              <span>
                {a.disclosure}{" "}
                <Link href="/affiliate-disclosure/" className="underline underline-offset-2">Learn more</Link>
              </span>
            </p>
          )}

          {a.articleType === "compare" && products.length >= 2 && <CompareTable products={products} />}

          <div className="article-body" dangerouslySetInnerHTML={{ __html: html }} />

          {a.faq.length > 0 && (
            <section className="mt-12">
              <h2 className="mb-4 text-2xl font-bold tracking-tight">FAQ</h2>
              <div className="space-y-3">
                {a.faq.map((f) => (
                  <details key={f.question} className="group rounded-2xl border border-line bg-surface p-5 shadow-card">
                    <summary className="cursor-pointer list-none font-semibold marker:hidden">
                      {f.question}
                    </summary>
                    <p className="mt-3 text-muted">{f.answer}</p>
                  </details>
                ))}
              </div>
            </section>
          )}

          <section className="mt-12 rounded-2xl border border-line bg-surface p-6 shadow-card">
            <h2 className="mb-1 flex items-center gap-2 text-xl font-bold tracking-tight">
              <Link2 className="h-5 w-5 text-accent" /> Sources
            </h2>
            <p className="mb-4 text-sm text-muted">Facts on this page were checked against these sources on the dates shown.</p>
            <ol className="space-y-2 text-sm">
              {a.sources.map((s, i) => (
                <li key={s.url + i} className="flex flex-wrap items-baseline gap-x-2">
                  <span className="text-muted">{i + 1}.</span>
                  <a href={s.url} target="_blank" rel="noopener noreferrer" className="break-all text-accent hover:underline">
                    {s.title || s.url}
                  </a>
                  {s.checkedAt && <span className="text-xs text-muted">checked {fmtDate(s.checkedAt)}</span>}
                </li>
              ))}
            </ol>
          </section>

          <section className="mt-6 rounded-2xl border border-line bg-surface-2/50 p-6 text-sm text-muted">
            <h2 className="mb-2 font-semibold text-foreground">Methodology</h2>
            <p>
              {handsOn
                ? "Our team used this product and combined that experience with the official documentation listed above."
                : "This is a research-based overview built from official product pages and documentation. We did not test the product hands-on and do not assign ratings."}{" "}
              {published && `First published ${published}.`} {updated && `Last updated ${updated}.`}
            </p>
            <p className="mt-2">
              <Link href="/how-we-review/" className="text-accent hover:underline">How we review</Link> ·{" "}
              <Link href="/corrections/" className="text-accent hover:underline">Report a correction</Link>
            </p>
          </section>
        </div>

        {products.length > 0 && (
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-2xl border border-line bg-surface p-5 shadow-card">
              <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-muted">Products in this article</h2>
              <ul className="space-y-4">
                {products.map((p) => (
                  <li key={p._id} className="rounded-xl border border-line p-4">
                    <Link href={profileUrl(p)} className="flex items-center gap-3">
                      <BrandMark name={p.brandName} />
                      <span className="min-w-0">
                        <span className="block font-semibold hover:text-accent">{p.brandName}</span>
                        <span className="text-xs text-muted">
                          {pricingLabels[p.pricingModel]} · {p.categories.map((c) => categoryName(p.productType, c)).join(", ")}
                        </span>
                      </span>
                    </Link>
                    <div className="mt-3 flex items-center justify-between gap-2">
                      <Link href={profileUrl(p)} className="text-xs text-accent hover:underline">
                        Full profile
                      </Link>
                      <ProductCta p={p} compact />
                    </div>
                  </li>
                ))}
              </ul>
              {products.some((p) => p.affiliateUrl) && (
                <p className="mt-4 text-xs text-muted">Some buttons are affiliate links.</p>
              )}
            </div>
            {/* PDF section 8: har review/comparison se category hub tak contextual link. */}
            {hubs.length > 0 && (
              <div className="mt-6 rounded-2xl border border-line bg-surface p-5 shadow-card">
                <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted">Explore the category</h2>
                <ul className="space-y-1">
                  {hubs.map((h) => (
                    <li key={h.href}>
                      <Link href={h.href} className="flex items-center justify-between rounded-lg px-2.5 py-2 text-sm font-medium transition hover:bg-surface-2">
                        All {h.name.toLowerCase()} tools <span aria-hidden className="text-accent">→</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </aside>
        )}
      </div>
    </article>
  );
}
