import type { Metadata } from "next";
import ArticleCard from "./site/ArticleCard";
import ArticleView from "./site/ArticleView";
import PageHeader, { EmptyState, container } from "./site/PageHeader";
import { findArticle, getArticleOr404, listArticles } from "@/lib/content";
import { sections, type SectionKey } from "@/lib/sections";

export async function SectionIndexPage({ section }: { section: SectionKey }) {
  const s = sections[section];
  const { items } = await listArticles({ articleType: s.articleType, productType: s.productType });
  return (
    <>
      <PageHeader crumbs={[{ label: s.label }]} eyebrow={s.area === "AI" ? "AI tools" : "SaaS"} title={s.label} description={s.description} />
      <div className={`${container} py-12`}>
        {items.length ? (
          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
            {items.map((a) => (
              <li key={a._id}>
                <ArticleCard article={a} />
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState title="Nothing published here yet" text="Articles appear once an editor has reviewed and approved them." />
        )}
      </div>
    </>
  );
}

export async function SectionItemPage({ section, slug }: { section: SectionKey; slug: string }) {
  const s = sections[section];
  const article = await getArticleOr404(s.productType, s.articleType, slug);
  return <ArticleView article={article} sectionLabel={s.label} sectionHref={`/${section}/`} pageType={s.pageType} />;
}

export async function sectionItemMetadata(section: SectionKey, slug: string): Promise<Metadata> {
  const s = sections[section];
  const a = await findArticle(s.productType, s.articleType, slug);
  if (!a) return { title: "Page not found" };
  return {
    title: { absolute: a.metaTitle || `${a.title} | Toolora.ai` },
    description: a.metaDescription || a.excerpt,
  };
}
