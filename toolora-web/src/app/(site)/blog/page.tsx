import Link from "next/link";
import type { Metadata } from "next";
import ArticleCard, { FeaturedCard } from "@/components/site/ArticleCard";
import JsonLd from "@/components/site/JsonLd";
import PageHeader, { EmptyState, container } from "@/components/site/PageHeader";
import { listArticles } from "@/lib/content";
import { articleCategory, articleTypeLabels } from "@/lib/labels";
import { breadcrumbJsonLd, itemListJsonLd, pageMetadata } from "@/lib/seo";

type Props = { searchParams: Promise<{ category?: string; type?: string }> };

const TYPES = ["review", "compare", "alternatives", "guide"] as const;

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const sp = await searchParams;
  // Filter wale URLs index na hon; canonical hamesha /blog/.
  return pageMetadata({
    title: "Blog: AI tool reviews, comparisons and guides",
    description: "Fact-checked reviews, comparisons, alternatives and guides on AI tools and SaaS — every claim sourced and dated.",
    path: "/blog/",
    noindex: Boolean(sp.category || sp.type),
  });
}

export default async function BlogPage({ searchParams }: Props) {
  const sp = await searchParams;
  const { items: all } = await listArticles({ limit: 100 });

  // Chips sirf un categories ke jinke articles hain.
  const cats = [...new Map(all.map((a) => articleCategory(a)).filter(Boolean).map((c) => [c!.slug, c!])).values()];
  const category = cats.some((c) => c.slug === sp.category) ? sp.category : undefined;
  const type = (TYPES as readonly string[]).includes(sp.type ?? "") ? sp.type : undefined;

  const items = all.filter((a) => (!category || a.category === category) && (!type || a.articleType === type));
  const [featured, ...rest] = items;

  const chip = (active: boolean) =>
    `rounded-full border px-3.5 py-1.5 text-sm font-medium transition ${
      active ? "border-ink bg-ink text-white" : "border-line bg-surface text-foreground hover:border-ink"
    }`;
  const href = (p: { category?: string; type?: string }) => {
    const q = new URLSearchParams();
    if (p.category) q.set("category", p.category);
    if (p.type) q.set("type", p.type);
    const s = q.toString();
    return s ? `/blog/?${s}` : "/blog/";
  };

  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd([{ name: "Blog", path: "/blog/" }]),
          itemListJsonLd("Toolora.ai blog", all.map((a) => ({ name: a.title, path: a.url }))),
        ]}
      />
      <PageHeader
        crumbs={[{ label: "Blog" }]}
        eyebrow="The blog"
        title="Latest guides & reviews"
        description="Practical, fact-checked articles on choosing and using AI tools and SaaS."
      />
      <div className={`${container} py-10`}>
        <nav aria-label="Filter articles" className="mb-8 space-y-3">
          <ul className="flex flex-wrap gap-2">
            <li>
              <Link href={href({ type })} rel="nofollow" className={chip(!category)}>All topics</Link>
            </li>
            {cats.map((c) => (
              <li key={c.slug}>
                <Link href={href({ category: c.slug, type })} rel="nofollow" className={chip(category === c.slug)}>
                  {c.name.replace(/^AI /, "")}
                </Link>
              </li>
            ))}
          </ul>
          <ul className="flex flex-wrap gap-2">
            <li>
              <Link href={href({ category })} rel="nofollow" className={chip(!type)}>All types</Link>
            </li>
            {TYPES.map((t) => (
              <li key={t}>
                <Link href={href({ category, type: t })} rel="nofollow" className={chip(type === t)}>
                  {articleTypeLabels[t]}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {featured ? (
          <>
            <FeaturedCard article={featured} />
            {rest.length > 0 && (
              <ul className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {rest.map((a) => (
                  <li key={a._id}>
                    <ArticleCard article={a} />
                  </li>
                ))}
              </ul>
            )}
          </>
        ) : (
          <EmptyState title="No articles here yet" text="Try another topic. New articles are published after editorial review." />
        )}
      </div>
    </>
  );
}
