import type { Metadata } from "next";
import ArticleView from "./site/ArticleView";
import { findArticle, getArticleOr404 } from "@/lib/content";
import { sections, type SectionKey } from "@/lib/sections";

// Single article page (/reviews/{slug}/ ...).
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
