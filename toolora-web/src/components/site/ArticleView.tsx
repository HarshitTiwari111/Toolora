import Link from "next/link";
import { BadgeCheck, ExternalLink, FlaskConical, Info } from "lucide-react";
import type { ArticleSummary, PublicArticle, PublicProduct } from "@/lib/content";
import { cleanArticleHtml, withHeadingIds } from "@/lib/sanitize";
import { areaBase, articleCategory, articleTypeLabels, categoryName, fmtDate, initials, platformName, pricingLabels, readingMinutes } from "@/lib/labels";
import Breadcrumbs, { type Crumb } from "../Breadcrumbs";
import ArticleCard, { Cover, NumberedList } from "./ArticleCard";
import BrandMark from "./BrandMark";
// Reference jaisa: header, cover, body aur sidebar ek hi centered column me.
const wrap = "mx-auto w-full max-w-[1228px] px-4 sm:px-6";

const profileUrl = (p: PublicProduct) => p.url ?? `${areaBase(p.productType)}/${p.slug}/`;

function ProductCta({ p, compact = false }: { p: PublicProduct; compact?: boolean }) {
  const affiliate = Boolean(p.affiliateUrl);
  return (
    <a
      href={affiliate ? p.affiliateUrl : p.officialUrl}
      target="_blank"
      // PDF section 8: affiliate links sponsored mark hon.
      rel={affiliate ? "sponsored nofollow noopener noreferrer" : "noopener noreferrer"}
      className={`inline-flex items-center justify-center gap-1.5 rounded-lg bg-accent font-medium text-white transition hover:opacity-90 ${
        compact ? "px-3 py-1.5 text-xs" : "px-4 py-2 text-sm"
      }`}
    >
      Visit {p.brandName} <ExternalLink className="h-3.5 w-3.5" />
    </a>
  );
}

// Compare article: products side by side (PDF: dated, sourced facts).
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
    <div className="my-8 overflow-x-auto rounded-2xl border border-line bg-surface shadow-card">
      <table className="w-full min-w-[520px] text-sm">
        <thead>
          <tr className="bg-surface-2">
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
  related,
  latest,
}: {
  article: PublicArticle;
  sectionLabel: string;
  sectionHref: string;
  pageType: string;
  related: ArticleSummary[];
  latest: ArticleSummary[];
}) {
  const products = a.products.filter(Boolean);
  const { html, toc } = withHeadingIds(cleanArticleHtml(a.body));
  const handsOn = a.reviewMethod === "hands_on";
  const updated = fmtDate(a.updatedAt);
  const published = fmtDate(a.publishedAt);
  const minutes = readingMinutes(a.body);
  const cat = articleCategory(a);
  const author = a.author || "Toolora Editorial Team";

  // Breadcrumb: Home / Section / Category / Title (reference jaisa)
  const crumbs: Crumb[] = [
    { label: sectionLabel, href: sectionHref },
    ...(cat ? [{ label: cat.name, href: cat.href }] : []),
    { label: a.title },
  ];

  // Category hubs (PDF section 8: review se category hub tak contextual link).
  const hubs = [
    ...new Map(
      [
        ...(cat ? [[cat.href, { href: cat.href, name: cat.name }] as const] : []),
        ...products.flatMap((p) =>
          p.categories.map((c) => {
            const href = `${areaBase(p.productType)}/${c}/`;
            return [href, { href, name: categoryName(p.productType, c) }] as const;
          }),
        ),
      ],
    ).values(),
  ];
  const latestOthers = latest.filter((x) => x._id !== a._id).slice(0, 5);
  const tags = [cat?.name, articleTypeLabels[a.articleType], ...products.map((p) => p.brandName)].filter(Boolean) as string[];

  return (
    <article>
      {/* ---------- Header (centered, reference jaisa) ---------- */}
      <header className="border-b border-line bg-surface">
        <div className="mx-auto max-w-4xl px-4 pb-10 pt-8 sm:px-6">
          <Breadcrumbs items={crumbs} />
          <p className="mb-3 text-xs font-bold uppercase tracking-widest text-accent">{cat ? cat.name : sectionLabel}</p>
          <h1 className="font-serif text-[2.1rem] font-semibold leading-[1.12] tracking-tight sm:text-5xl">{a.title}</h1>
          {a.excerpt && <p className="mt-4 text-lg leading-relaxed text-muted">{a.excerpt}</p>}
          <p className="mt-6 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted">
            <span>
              By <span className="font-semibold text-foreground">{author}</span>
            </span>
            <span aria-hidden>·</span>
            {published && (
              <>
                <span>
                  Published <time dateTime={a.publishedAt ?? undefined}>{published}</time>
                </span>
                <span aria-hidden>·</span>
              </>
            )}
            {updated && updated !== published && (
              <>
                <span>
                  Updated <time dateTime={a.updatedAt}>{updated}</time>
                </span>
                <span aria-hidden>·</span>
              </>
            )}
            <span>{minutes} min read</span>
            <span aria-hidden>·</span>
            <span className="inline-flex items-center gap-1">
              {handsOn ? <FlaskConical className="h-3.5 w-3.5" /> : <BadgeCheck className="h-3.5 w-3.5" />}
              {handsOn ? "Hands-on tested" : "Research-based"}
            </span>
          </p>
        </div>
      </header>

      {/* ---------- Cover ---------- */}
      <figure className="mx-auto max-w-5xl px-4 pt-8 sm:px-6">
        <Cover article={a} className="aspect-[16/9] rounded-2xl" sizes="(min-width: 1024px) 976px, 100vw" priority big />
        {a.coverImageUrl && a.coverImageCredit && <figcaption className="mt-2 text-right text-xs text-muted">{a.coverImageCredit}</figcaption>}
      </figure>

      {/* ---------- Body + sidebar ---------- */}
      <div className={`${wrap} grid gap-10 py-10 lg:grid-cols-[minmax(0,1fr)_300px] xl:gap-12`}>
        <div className="min-w-0">
          {a.disclosure && (
            <p className="mb-8 flex max-w-[840px] gap-2.5 rounded-xl border border-line bg-surface px-4 py-3 text-sm text-muted">
              <Info className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
              <span>
                {a.disclosure}{" "}
                <Link href="/affiliate-disclosure/" className="underline underline-offset-2">Learn more</Link>
              </span>
            </p>
          )}

          {a.articleType === "compare" && products.length >= 2 && (
            <div className="max-w-[840px]">
              <CompareTable products={products} />
            </div>
          )}

          <div className="article-body" dangerouslySetInnerHTML={{ __html: html }} />

          <div className="max-w-[840px]">
            {a.faq.length > 0 && (
              <section className="mt-14">
                <h2 className="mb-4 font-serif text-2xl font-semibold tracking-tight">Frequently asked questions</h2>
                <div className="divide-y divide-line overflow-hidden rounded-2xl border border-line bg-surface">
                  {a.faq.map((f) => (
                    <details key={f.question} className="group px-5 py-4">
                      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold [&::-webkit-details-marker]:hidden">
                        {f.question}
                        <span aria-hidden className="text-xl leading-none text-accent transition group-open:rotate-45">+</span>
                      </summary>
                      <p className="mt-3 text-muted">{f.answer}</p>
                    </details>
                  ))}
                </div>
              </section>
            )}

            <section className="mt-12">
              <h2 className="mb-3 font-serif text-2xl font-semibold tracking-tight">Sources &amp; references</h2>
              <ol className="list-decimal space-y-1.5 pl-5 text-sm">
                {a.sources.map((s, i) => (
                  <li key={s.url + i}>
                    <a href={s.url} target="_blank" rel="noopener noreferrer" className="break-all text-accent underline underline-offset-2 hover:no-underline">
                      {s.title || s.url}
                    </a>
                    {s.checkedAt && <span className="text-muted"> (accessed {fmtDate(s.checkedAt)})</span>}
                  </li>
                ))}
              </ol>
            </section>

            <section className="mt-8 rounded-2xl border border-line bg-surface p-5 text-sm">
              <h2 className="mb-2 font-bold">How we made this guide</h2>
              <p className="text-muted">
                {handsOn
                  ? "Our team used this product and combined that experience with the official documentation listed above."
                  : "Research-based overview built from official product pages and documentation. We did not test the product hands-on and do not assign ratings."}
              </p>
              <p className="mt-2">
                <span className="font-semibold">Last reviewed:</span> {updated ?? published}
                {a.reviewer && (
                  <>
                    {" "}· <span className="font-semibold">Reviewed by:</span> {a.reviewer}
                  </>
                )}
              </p>
              <p className="mt-1 text-muted">
                Spotted an error?{" "}
                <Link href="/corrections/" className="text-accent underline underline-offset-2">Request a correction</Link>.{" "}
                <Link href="/how-we-review/" className="text-accent underline underline-offset-2">How we review</Link>
              </p>
            </section>

            {tags.length > 0 && (
              <ul className="mt-6 flex flex-wrap gap-2">
                {tags.map((t) => (
                  <li key={t} className="rounded-full border border-line bg-surface px-3 py-1 text-xs font-medium">#{t.replace(/\s+/g, "")}</li>
                ))}
              </ul>
            )}

            <section className="mt-8 flex gap-4 rounded-2xl border border-line bg-surface p-5">
              <span aria-hidden className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-label font-bold text-ink">
                {initials(author)}
              </span>
              <div className="text-sm">
                <p className="font-bold">{author}</p>
                <p className="text-muted">{a.author ? "Author" : "Editors & researchers"}</p>
                <p className="mt-2 text-muted">
                  Our editorial team researches and fact-checks every article against official sources. Pages are reviewed by an editor
                  before publishing and re-checked on a schedule.
                </p>
              </div>
            </section>
          </div>
        </div>

        <aside className="space-y-6 lg:sticky lg:top-28 lg:self-start">
          {toc.length > 1 && (
            <nav aria-label="On this page" className="rounded-2xl border border-line bg-surface p-5">
              <h2 className="mb-3 text-xs font-extrabold uppercase tracking-widest">On this page</h2>
              <ol className="space-y-1.5 text-sm">
                {toc.map((t) => (
                  <li key={t.id}>
                    <a href={`#${t.id}`} className="block text-muted transition hover:text-accent">
                      {t.text}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
          )}

          {latestOthers.length > 0 && <NumberedList title="Latest articles" items={latestOthers} />}

          {products.length > 0 && (
            <div className="rounded-2xl border border-line bg-surface p-5">
              <h2 className="mb-4 text-xs font-extrabold uppercase tracking-widest">Tools in this article</h2>
              <ul className="space-y-4">
                {products.map((p) => (
                  <li key={p._id} className="rounded-xl border border-line p-4">
                    <Link href={profileUrl(p)} className="flex items-center gap-3">
                      <BrandMark name={p.brandName} />
                      <span className="min-w-0">
                        <span className="block font-semibold hover:text-accent">{p.brandName}</span>
                        <span className="text-xs text-muted">{pricingLabels[p.pricingModel]}</span>
                      </span>
                    </Link>
                    <div className="mt-3 flex items-center justify-between gap-2">
                      <Link href={profileUrl(p)} className="text-xs text-accent hover:underline">Full profile</Link>
                      <ProductCta p={p} compact />
                    </div>
                  </li>
                ))}
              </ul>
              {products.some((p) => p.affiliateUrl) && <p className="mt-4 text-xs text-muted">Some buttons are affiliate links.</p>}
            </div>
          )}

          {hubs.length > 0 && (
            <div className="rounded-2xl border border-line bg-surface p-5">
              <h2 className="mb-3 text-xs font-extrabold uppercase tracking-widest">Explore the category</h2>
              <ul className="space-y-1">
                {hubs.map((h) => (
                  <li key={h.href}>
                    <Link href={h.href} className="flex items-center justify-between rounded-lg px-2.5 py-2 text-sm font-medium transition hover:bg-surface-2">
                      All {h.name} tools <span aria-hidden className="text-accent">→</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </aside>
      </div>

      {related.length > 0 && (
        <section className="border-t border-line bg-surface py-14">
          <div className={wrap}>
            <h2 className="mb-8 font-serif text-3xl font-semibold tracking-tight">Related guides</h2>
            <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {related.map((r) => (
                <li key={r._id}>
                  <ArticleCard article={r} />
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
    </article>
  );
}
