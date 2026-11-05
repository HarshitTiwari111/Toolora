import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowRight, CalendarCheck, ExternalLink, FileText, Info, ShieldCheck } from "lucide-react";
import CategoryGrid from "./CategoryGrid";
import ProductCard from "./site/ProductCard";
import BrandMark from "./site/BrandMark";
import FilterChips from "./site/FilterChips";
import PageHeader, { EmptyState, container } from "./site/PageHeader";
import { findProduct, getProductOr404, listArticles, listProducts, type ProductDetail } from "@/lib/content";
import ArticleCard, { FeaturedCard } from "./site/ArticleCard";
import ToolListCard from "./site/ToolListCard";
import JsonLd from "./site/JsonLd";
import { breadcrumbJsonLd, itemListJsonLd, pageMetadata, softwareJsonLd } from "@/lib/seo";
import {
  articleTypeLabels, areaBase, categoryName, factLabel, fmtDate, platformLabels, platformName, pricingLabels,
} from "@/lib/labels";
import { aiCategories, saasCategories } from "@/lib/site";

type Area = "ai" | "saas";
export type DirFilters = { pricing?: string; platform?: string; useCase?: string };

const areas = {
  ai: { label: "AI Tools", categories: aiCategories, title: "AI tools directory" },
  saas: { label: "SaaS", categories: saasCategories, title: "SaaS directory" },
};

const pricingOptions = ["free", "freemium", "paid"].map((v) => ({ value: v, label: pricingLabels[v] }));
const platformOptions = Object.entries(platformLabels).map(([value, label]) => ({ value, label }));

type Opt = { value: string; label: string };

// PDF section 1 filters: category (URL), pricing, platform, use case.
// Ek API call: scope (area + category) ke saare products, phir filters yahin lagte hain.
async function loadProducts(area: Area, category: string | undefined, raw: DirFilters) {
  const { items: all } = await listProducts({ type: area, category });

  // Use cases products se hi bante hain (sabse common 12).
  const counts = new Map<string, { label: string; n: number }>();
  for (const p of all)
    for (const u of p.useCases) {
      const key = u.trim().toLowerCase();
      if (key) counts.set(key, { label: counts.get(key)?.label ?? u.trim(), n: (counts.get(key)?.n ?? 0) + 1 });
    }
  const useCaseOptions: Opt[] = [...counts]
    .sort((a, b) => b[1].n - a[1].n || a[0].localeCompare(b[0]))
    .slice(0, 12)
    .map(([value, v]) => ({ value, label: v.label }));

  const filters: DirFilters = {
    pricing: pricingOptions.some((o) => o.value === raw.pricing) ? raw.pricing : undefined,
    platform: platformOptions.some((o) => o.value === raw.platform) ? raw.platform : undefined,
    useCase: useCaseOptions.some((o) => o.value === raw.useCase) ? raw.useCase : undefined,
  };
  const items = all.filter(
    (p) =>
      (!filters.pricing || p.pricingModel === filters.pricing) &&
      (!filters.platform || p.platforms.includes(filters.platform)) &&
      (!filters.useCase || p.useCases.some((u) => u.trim().toLowerCase() === filters.useCase)),
  );
  // Sidebar ke liye: sirf woh pricing/platform options jo is scope ke products me sach me hain, count ke saath.
  const count = (pick: (p: (typeof all)[number]) => string[]) => {
    const m: Record<string, number> = {};
    for (const p of all) for (const v of pick(p)) m[v] = (m[v] ?? 0) + 1;
    return m;
  };
  const optionCounts = {
    pricing: count((p) => [p.pricingModel]),
    platform: count((p) => p.platforms),
    useCase: count((p) => [...new Set(p.useCases.map((u) => u.trim().toLowerCase()))]),
  };
  const available = {
    pricing: pricingOptions.filter((o) => optionCounts.pricing[o.value]),
    platform: platformOptions.filter((o) => optionCounts.platform[o.value]),
  };
  return { items, filters, useCaseOptions, all, counts: optionCounts, available };
}

type Loaded = Awaited<ReturnType<typeof loadProducts>>;

// Category page sidebar: compact, sticky, sirf relevant options.
function FilterSidebar({ basePath, data }: { basePath: string; data: Loaded }) {
  const { filters, useCaseOptions, counts, available, all } = data;
  const active = Boolean(filters.pricing || filters.platform || filters.useCase);
  return (
    <aside className="space-y-5 lg:sticky lg:top-28 lg:self-start">
      <div className="rounded-2xl border border-line bg-surface p-5 shadow-card">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-serif text-lg font-semibold">Filter tools</h2>
          {active && (
            <Link href={basePath} rel="nofollow" scroll={false} className="text-xs font-semibold text-accent hover:underline">
              Clear all
            </Link>
          )}
        </div>
        {all.length === 0 ? (
          <p className="text-sm text-muted">Filters appear once tools are listed in this category.</p>
        ) : (
          <div className="space-y-5">
            <FilterChips stacked label="Pricing" param="pricing" options={available.pricing} counts={counts.pricing} current={filters.pricing} basePath={basePath} otherParams={filters} />
            <FilterChips stacked label="Platform" param="platform" options={available.platform} counts={counts.platform} current={filters.platform} basePath={basePath} otherParams={filters} />
            {useCaseOptions.length > 0 && (
              <FilterChips stacked label="Use case" param="useCase" options={useCaseOptions} counts={counts.useCase} current={filters.useCase} basePath={basePath} otherParams={filters} />
            )}
          </div>
        )}
      </div>
      <div className="hidden rounded-2xl border border-line bg-gradient-to-br from-accent/[0.06] to-label/[0.08] p-5 lg:block">
        <p className="mb-3 flex items-center gap-2 text-sm font-bold">
          <ShieldCheck className="h-4 w-4 text-accent" /> How we list tools
        </p>
        <ul className="space-y-2 text-sm text-muted">
          <li className="flex gap-2"><span className="text-emerald-600">&#10003;</span> Prices from each vendor&apos;s own site</li>
          <li className="flex gap-2"><span className="text-emerald-600">&#10003;</span> Re-checked when plans change</li>
          <li className="flex gap-2"><span className="text-emerald-600">&#10003;</span> Nobody pays to be listed higher</li>
        </ul>
        <Link href="/how-we-review/" className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-accent hover:underline">
          Our method <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </aside>
  );
}

function Filters({ basePath, filters, useCaseOptions }: { basePath: string; filters: DirFilters; useCaseOptions: Opt[] }) {
  return (
    <div className="mb-8 space-y-3 rounded-2xl border border-line bg-surface p-4 shadow-card">
      <FilterChips label="Pricing" param="pricing" options={pricingOptions} current={filters.pricing} basePath={basePath} otherParams={filters} />
      <FilterChips label="Platform" param="platform" options={platformOptions} current={filters.platform} basePath={basePath} otherParams={filters} />
      {useCaseOptions.length > 0 && (
        <FilterChips label="Use case" param="useCase" options={useCaseOptions} current={filters.useCase} basePath={basePath} otherParams={filters} />
      )}
    </div>
  );
}

function ProductGrid({ products }: { products: Awaited<ReturnType<typeof listProducts>>["items"] }) {
  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
      {products.map((p) => (
        <li key={p._id}>
          <ProductCard product={p} />
        </li>
      ))}
    </ul>
  );
}

// ---------- /ai-tools/ and /saas/ ----------

export async function DirectoryIndex({ area, filters: raw }: { area: Area; filters: DirFilters }) {
  const a = areas[area];
  const base = `${areaBase(area)}/`;
  const { items, filters, useCaseOptions } = await loadProducts(area, undefined, raw);

  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd([{ name: a.label, path: base }]),
          itemListJsonLd(a.title, items.map((p) => ({ name: p.brandName, path: p.url }))),
        ]}
      />
      <PageHeader
        crumbs={[{ label: a.label }]}
        eyebrow="Directory"
        title={a.title}
        description={
          area === "ai"
            ? "Browse AI tools by category or filter by pricing, platform and use case. Every profile shows when its facts were last verified."
            : "Business software by function, with a look at their AI features and dated, sourced facts."
        }
        icon={area === "ai" ? "ai-tools" : "saas"}
      >
        <p className="mt-5 text-sm text-ink-muted">
          <span className="font-bold text-white">{items.length}</span> tool{items.length === 1 ? "" : "s"} ·{" "}
          <span className="font-bold text-white">{a.categories.length}</span> categories
        </p>
      </PageHeader>
      <div className={`${container} py-12`}>
        <h2 className="mb-5 font-serif text-3xl font-bold tracking-tight">Browse by category</h2>
        <CategoryGrid base={areaBase(area)} categories={a.categories} />

        <h2 className="mb-5 mt-14 font-serif text-3xl font-bold tracking-tight">All {area === "ai" ? "AI tools" : "SaaS products"}</h2>
        <Filters basePath={base} filters={filters} useCaseOptions={useCaseOptions} />
        {items.length ? (
          <ProductGrid products={items} />
        ) : (
          <EmptyState title="No products match yet" text="Try removing a filter. New tools are added after editorial review." />
        )}
      </div>
    </>
  );
}

// ---------- /ai-tools/{category}/ ----------

async function CategoryHub({ area, slug, filters: raw }: { area: Area; slug: string; filters: DirFilters }) {
  const a = areas[area];
  const cat = a.categories.find((c) => c.slug === slug)!;
  const [data, articles] = await Promise.all([
    loadProducts(area, slug, raw),
    listArticles({ category: slug, limit: 12 }).then((r) => r.items),
  ]);
  const { items, filters } = data;
  const path = `${areaBase(area)}/${slug}/`;
  // Har product ka review article (agar hai) -> "Read review" button.
  const reviewFor = new Map<string, (typeof articles)[number]>();
  for (const ar of articles) if (ar.articleType === "review") for (const id of ar.products ?? []) if (!reviewFor.has(id)) reviewFor.set(id, ar);
  const shownArticles = articles.slice(0, 6);
  const filtered = Boolean(filters.pricing || filters.platform || filters.useCase);
  const pill = "inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5";

  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd([{ name: a.label, path: `${areaBase(area)}/` }, { name: cat.name, path }]),
          itemListJsonLd(`${cat.name} tools`, items.map((p) => ({ name: p.brandName, path: p.url }))),
        ]}
      />
      <PageHeader
        crumbs={[{ label: a.label, href: `${areaBase(area)}/` }, { label: cat.name }]}
        eyebrow="Category"
        title={`Best ${cat.name} tools`}
        description={`${cat.description}: what they cost, where they run and who each one is for.`}
        icon={slug}
      >
        <div className="mt-6 flex flex-wrap gap-2.5 text-sm">
          <span className={`${pill} text-white`}>
            <span className="font-bold">{data.all.length}</span> <span className="text-ink-muted">tool{data.all.length === 1 ? "" : "s"} listed</span>
          </span>
          <span className={`${pill} text-white`}>
            <FileText className="h-4 w-4 text-label" /> <span className="font-bold">{articles.length}</span>{" "}
            <span className="text-ink-muted">article{articles.length === 1 ? "" : "s"}</span>
          </span>
          <span className={`${pill} text-ink-muted`}>
            <CalendarCheck className="h-4 w-4 text-emerald-400" /> Prices from official sites
          </span>
        </div>
      </PageHeader>

      <div className={`${container} grid gap-8 py-12 lg:grid-cols-[280px_minmax(0,1fr)] xl:gap-10`}>
        <FilterSidebar basePath={path} data={data} />

        <div className="min-w-0">
          <div className="mb-5">
            <h2 className="font-serif text-3xl font-bold tracking-tight">{cat.name} tools</h2>
            <p className="mt-1 text-sm text-muted">
              {filtered ? `${items.length} of ${data.all.length} match your filters` : `Showing ${items.length} tool${items.length === 1 ? "" : "s"}`} · listed
              alphabetically, not ranked
            </p>
          </div>

          {items.length ? (
            <ul className="space-y-4">
              {items.map((p) => (
                <li key={p._id}>
                  <ToolListCard product={p} review={reviewFor.get(p._id)} />
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState
              title={filtered ? "No tools match these filters" : `No ${cat.name.toLowerCase()} tools listed yet`}
              text={filtered ? "Try removing a filter." : "Products appear here once an editor has verified their details against official sources."}
            />
          )}

          {data.all.length > 0 && data.all.length < 4 && !filtered && (
            <p className="mt-4 flex items-start gap-2.5 rounded-xl border border-dashed border-line px-4 py-3 text-sm text-muted">
              <Info className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
              More {cat.name} tools are coming soon.
            </p>
          )}

          {shownArticles.length > 0 && (
            <section className="mt-14">
              <h2 className="mb-6 font-serif text-3xl font-bold tracking-tight">Latest {cat.name} articles</h2>
              {shownArticles.length === 1 ? (
                <FeaturedCard article={shownArticles[0]} />
              ) : (
                <ul className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                  {shownArticles.map((ar) => (
                    <li key={ar._id}>
                      <ArticleCard article={ar} />
                    </li>
                  ))}
                </ul>
              )}
            </section>
          )}
        </div>
      </div>

      <div className={`${container} pb-16`}>
        <h2 className="mb-5 font-serif text-2xl font-bold tracking-tight">Other categories</h2>
        <CategoryGrid base={areaBase(area)} categories={a.categories.filter((c) => c.slug !== slug)} />
      </div>
    </>
  );
}

// ---------- /ai-tools/{brand}/ ----------

function OutboundCta({ p }: { p: ProductDetail }) {
  const affiliate = Boolean(p.affiliateUrl);
  return (
    <div className="flex flex-col items-start gap-2">
      <a
        href={affiliate ? p.affiliateUrl : p.officialUrl}
        target="_blank"
        // PDF section 8: affiliate links sponsored mark hon.
        rel={affiliate ? "sponsored nofollow noopener noreferrer" : "noopener noreferrer"}
        className="inline-flex items-center gap-2 rounded-xl bg-accent px-5 py-3 font-medium text-white shadow-card transition hover:opacity-90"
      >
        Visit {p.brandName} <ExternalLink className="h-4 w-4" />
      </a>
      {affiliate && (
        <p className="text-xs text-muted">
          Affiliate link: we may earn a commission.{" "}
          <Link href="/affiliate-disclosure/" className="underline underline-offset-2">
            Disclosure
          </Link>
        </p>
      )}
    </div>
  );
}

async function ProductProfile({ area, slug }: { area: Area; slug: string }) {
  const p = await getProductOr404(slug);
  // Galat section me product (jaise SaaS product /ai-tools/ par) => 404.
  if (p.productType !== area) notFound();
  const a = areas[area];
  const firstCat = p.categories[0];
  const alternatives = firstCat
    ? (await listProducts({ type: area, category: firstCat })).items.filter((x) => x.slug !== p.slug).slice(0, 3)
    : [];

  const glance = [
    { k: "Pricing model", v: pricingLabels[p.pricingModel] },
    { k: "Platforms", v: p.platforms.map(platformName).join(", ") || "—" },
    { k: "Categories", v: p.categories.map((c) => categoryName(area, c)).join(", ") || "—" },
    { k: "Last verified", v: fmtDate(p.lastVerifiedAt) ?? "Not yet verified" },
  ];

  return (
    <>
      <JsonLd
        data={[
          softwareJsonLd({
            name: p.brandName,
            description: p.shortDescription,
            path: p.url,
            officialUrl: p.officialUrl,
            category: firstCat ? categoryName(area, firstCat) : a.label,
            platforms: p.platforms.map(platformName),
          }),
          breadcrumbJsonLd([
            { name: a.label, path: `${areaBase(area)}/` },
            ...(firstCat ? [{ name: categoryName(area, firstCat), path: `${areaBase(area)}/${firstCat}/` }] : []),
            { name: p.brandName, path: p.url },
          ]),
        ]}
      />
      <div className="border-b border-line bg-surface">
        <div className={`${container} pb-10 pt-8`}>
          <nav aria-label="Breadcrumb" className="mb-6 text-sm text-muted">
            <ol className="flex flex-wrap gap-1.5">
              <li><Link href="/" className="hover:text-foreground">Home</Link></li>
              <li aria-hidden>/</li>
              <li><Link href={`${areaBase(area)}/`} className="hover:text-foreground">{a.label}</Link></li>
              {firstCat && (
                <>
                  <li aria-hidden>/</li>
                  <li><Link href={`${areaBase(area)}/${firstCat}/`} className="hover:text-foreground">{categoryName(area, firstCat)}</Link></li>
                </>
              )}
              <li aria-hidden>/</li>
              <li aria-current="page" className="text-foreground">{p.brandName}</li>
            </ol>
          </nav>
          <div className="grid items-start gap-8 lg:grid-cols-[1fr_auto]">
            <div className="flex items-start gap-5">
              <BrandMark name={p.brandName} size="lg" />
              <div>
                <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-accent">
                  {area === "ai" ? "AI tool" : "SaaS"} profile
                </p>
                <h1 className="font-serif text-4xl font-bold tracking-tight sm:text-5xl">{p.brandName}</h1>
                {p.shortDescription && <p className="mt-3 max-w-3xl text-lg text-muted">{p.shortDescription}</p>}
                <p className="mt-3 inline-flex items-center gap-1.5 text-sm text-muted">
                  <CalendarCheck className="h-4 w-4" />
                  {p.lastVerifiedAt ? `Facts last verified ${fmtDate(p.lastVerifiedAt)}` : "Facts not yet verified"}
                </p>
              </div>
            </div>
            <OutboundCta p={p} />
          </div>
        </div>
      </div>

      <div className={`${container} grid gap-10 py-12 lg:grid-cols-[1fr_360px]`}>
        <div className="min-w-0 space-y-10">
          <section>
            <h2 className="mb-4 text-2xl font-bold tracking-tight">At a glance</h2>
            <dl className="grid gap-3 sm:grid-cols-2">
              {glance.map((g) => (
                <div key={g.k} className="rounded-2xl border border-line bg-surface p-4 shadow-card">
                  <dt className="text-xs font-semibold uppercase tracking-wide text-muted">{g.k}</dt>
                  <dd className="mt-1 font-medium">{g.v}</dd>
                </div>
              ))}
            </dl>
            {p.useCases.length > 0 && (
              <div className="mt-5">
                <h3 className="mb-2 font-semibold">Common use cases</h3>
                <ul className="flex flex-wrap gap-2">
                  {p.useCases.map((u) => (
                    <li key={u} className="rounded-full bg-surface-2 px-3 py-1.5 text-sm">{u}</li>
                  ))}
                </ul>
              </div>
            )}
          </section>

          <section>
            <h2 className="mb-1 text-2xl font-bold tracking-tight">Verified facts</h2>
            <p className="mb-4 text-sm text-muted">Each fact links to the source we checked and shows when we checked it.</p>
            {p.facts.length ? (
              <div className="overflow-x-auto rounded-2xl border border-line bg-surface shadow-card">
                <table className="w-full min-w-[560px] text-sm">
                  <thead className="bg-surface-2/60 text-left text-xs uppercase tracking-wide text-muted">
                    <tr>
                      <th scope="col" className="px-4 py-3">Fact</th>
                      <th scope="col" className="px-4 py-3">Detail</th>
                      <th scope="col" className="px-4 py-3">Source</th>
                      <th scope="col" className="px-4 py-3">Checked</th>
                    </tr>
                  </thead>
                  <tbody>
                    {p.facts.map((f) => (
                      <tr key={f._id} className="border-t border-line align-top">
                        <td className="px-4 py-3 font-medium">{factLabel(f.fieldName)}</td>
                        <td className="px-4 py-3">{f.factValue}</td>
                        <td className="px-4 py-3">
                          <a href={f.sourceUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-accent hover:underline">
                            {f.sourceType === "official" ? "Official" : "Source"} <ExternalLink className="h-3 w-3" />
                          </a>
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-muted">{fmtDate(f.checkedAt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <EmptyState title="No verified facts yet" text="We only list pricing and features after checking the official source." />
            )}
          </section>

          {alternatives.length > 0 && (
            <section>
              <h2 className="mb-4 text-2xl font-bold tracking-tight">Alternatives in {categoryName(area, firstCat!)}</h2>
              <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {alternatives.map((x) => (
                  <li key={x._id}><ProductCard product={x} /></li>
                ))}
              </ul>
            </section>
          )}
        </div>

        <aside className="space-y-6">
          <div className="rounded-2xl border border-line bg-surface p-5 shadow-card">
            <h2 className="mb-3 flex items-center gap-2 font-semibold"><FileText className="h-4 w-4 text-accent" /> Reviews & comparisons</h2>
            {p.articles.length ? (
              <ul className="space-y-2">
                {p.articles.map((ar) => (
                  <li key={ar._id}>
                    <Link href={ar.url} className="group flex items-start justify-between gap-2 rounded-xl p-2.5 transition hover:bg-surface-2">
                      <span>
                        <span className="block text-xs font-medium uppercase tracking-wide text-accent">{articleTypeLabels[ar.articleType]}</span>
                        <span className="text-sm font-medium">{ar.title}</span>
                      </span>
                      <ArrowRight className="mt-4 h-4 w-4 shrink-0 text-muted transition group-hover:translate-x-0.5" />
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted">No published articles about {p.brandName} yet.</p>
            )}
          </div>
          <div className="rounded-2xl border border-line bg-surface p-5 text-sm text-muted shadow-card">
            <h2 className="mb-2 flex items-center gap-2 font-semibold text-foreground"><ShieldCheck className="h-4 w-4 text-accent" /> How we research</h2>
            <p>This is a research-based profile built from {p.brandName}&apos;s official pages. We have not assigned a rating.</p>
            <Link href="/how-we-review/" className="mt-2 inline-flex items-center gap-1 text-accent">Our method <ArrowRight className="h-3.5 w-3.5" /></Link>
          </div>
          <p className="flex gap-2 text-xs text-muted">
            <Info className="h-4 w-4 shrink-0" /> Spotted something out of date?{" "}
            <Link href="/corrections/" className="underline underline-offset-2">Report a correction</Link>
          </p>
        </aside>
      </div>
    </>
  );
}

// ---------- /ai-tools/[slug]/ router ----------

export function isCategory(area: Area, slug: string) {
  return areas[area].categories.some((c) => c.slug === slug);
}

export async function DirectorySlug({ area, slug, filters }: { area: Area; slug: string; filters: DirFilters }) {
  if (isCategory(area, slug)) return <CategoryHub area={area} slug={slug} filters={filters} />;
  if (!/^[a-z0-9-]+$/.test(slug)) notFound();
  return <ProductProfile area={area} slug={slug} />;
}

export async function directoryMetadata(area: Area, slug: string, filtered: boolean): Promise<Metadata> {
  // Filter wale URLs index na hon (PDF section 5).
  const robots = filtered ? { index: false, follow: true } : undefined;
  const cat = areas[area].categories.find((c) => c.slug === slug);
  if (cat) {
    return {
      ...pageMetadata({ title: `${cat.name} tools`, description: `${cat.description} with dated, sourced facts.`, path: `${areaBase(area)}/${slug}/` }),
      ...(robots ? { robots } : {}),
    };
  }
  if (!/^[a-z0-9-]+$/.test(slug)) return { title: "Page not found" };
  const p = await findProduct(slug);
  if (!p || p.productType !== area) return { title: "Page not found" };
  {
    return pageMetadata({
      title: `${p.brandName}: features, pricing and alternatives`,
      description: p.shortDescription || `Research-based profile of ${p.brandName} with sourced facts.`,
      path: p.url,
    });
  }
}
