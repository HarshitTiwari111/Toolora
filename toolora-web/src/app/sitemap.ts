import type { MetadataRoute } from "next";
import { absUrl } from "@/lib/seo";
import { aiCategories, saasCategories, trustPages } from "@/lib/site";

// XML sitemap (PDF section 8): sirf canonical, indexable pages.
// Drafts, search, filters, admin aur api-test isme nahi aate.
export const revalidate = 3600;

type InventoryItem = { url: string; updatedAt?: string };

async function inventory(): Promise<InventoryItem[]> {
  const base = process.env.API_URL?.replace(/\/+$/, "");
  if (!base) return [];
  try {
    const res = await fetch(`${base}/api/public/inventory`, { next: { revalidate: 3600, tags: ["content"] } });
    if (!res.ok) return [];
    return ((await res.json()) as { items: InventoryItem[] }).items;
  } catch {
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPaths = [
    "/", "/blog/", "/ai-tools/", "/saas/", "/reviews/", "/compare/", "/alternatives/", "/guides/",
    "/saas-reviews/", "/saas-compare/", "/saas-alternatives/", "/saas-guides/",
    ...aiCategories.map((c) => `/ai-tools/${c.slug}/`),
    ...saasCategories.map((c) => `/saas/${c.slug}/`),
    ...trustPages.map((p) => `/${p.slug}/`),
  ];
  const dynamic = await inventory();
  return [
    ...staticPaths.map((p) => ({ url: absUrl(p), changeFrequency: "weekly" as const, priority: p === "/" ? 1 : 0.6 })),
    ...dynamic.map((it) => ({
      url: absUrl(it.url),
      lastModified: it.updatedAt ? new Date(it.updatedAt) : undefined,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
