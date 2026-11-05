import type { Metadata } from "next";
import ArticleView from "./site/ArticleView";
import JsonLd from "./site/JsonLd";
import { findArticle, getArticleOr404, listArticles } from "@/lib/content";
import { articleCategory } from "@/lib/labels";
import { articleJsonLd, breadcrumbJsonLd, faqJsonLd, pageMetadata } from "@/lib/seo";
import { sections, type SectionKey } from "@/lib/sections";
import { categoryPhoto, photoUrl } from "@/lib/photos";

// Share image: article ki cover, warna category ki Unsplash photo (1200x630).
function shareImage(a: { coverImageUrl?: string; category?: string; productType: string }) {
  if (a.coverImageUrl) return a.coverImageUrl;
  const p = categoryPhoto(a.category);
  return p ? photoUrl(p, 1200, 630) : undefined;
}

// Single article page (/reviews/{slug}/ ...).
export async function SectionItemPage({ section, slug }: { section: SectionKey; slug: string }) {
  const s = sections[section];
  const article = await getArticleOr404(s.productType, s.articleType, slug);

  // "Keep reading": same category, warna same section.
  const pool = (
    await listArticles(article.category ? { category: article.category, limit: 8 } : { articleType: s.articleType, productType: s.productType, limit: 8 })
  ).items;
  const related = pool.filter((r) => r._id !== article._id).slice(0, 3);
  const latest = (await listArticles({ limit: 6 })).items;

  const cat = articleCategory(article);
  const crumbs = cat ? [{ name: cat.name, path: cat.href }] : [{ name: s.label, path: `/${section}/` }];

  return (
    <>
      <JsonLd
        data={[
          articleJsonLd({
            title: article.title,
            description: article.metaDescription || article.excerpt,
            path: article.url,
            image: shareImage(article),
            author: article.author,
            reviewer: article.reviewer,
            publishedAt: article.publishedAt,
            updatedAt: article.updatedAt,
            articleType: article.articleType,
          }),
          breadcrumbJsonLd([...crumbs, { name: article.title, path: article.url }]),
          ...(article.faq.length ? [faqJsonLd(article.faq)] : []),
        ]}
      />
      <ArticleView article={article} sectionLabel={s.label} sectionHref={`/${section}/`} pageType={s.pageType} related={related} latest={latest} />
    </>
  );
}

export async function sectionItemMetadata(section: SectionKey, slug: string): Promise<Metadata> {
  const s = sections[section];
  const a = await findArticle(s.productType, s.articleType, slug);
  if (!a) return { title: "Page not found" };
  return pageMetadata({
    // Template " | Toolora.ai" khud jodta hai.
    title: a.metaTitle || a.title,
    description: a.metaDescription || a.excerpt,
    path: a.url,
    type: "article",
    image: shareImage(a),
    imageAlt: a.coverImageAlt || categoryPhoto(a.category)?.alt || undefined,
    publishedTime: a.publishedAt,
    modifiedTime: a.updatedAt,
  });
}
