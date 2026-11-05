import "server-only";
import { notFound } from "next/navigation";
import { connection } from "next/server";

// Website ke liye public content (sirf active products + published articles).
// Cache tag "content": admin me kuch badalte hi revalidateTag("content") se turant refresh.

import { CONTENT_TAG } from "./admin-constants";
export { CONTENT_TAG };

export type PricingModel = "free" | "freemium" | "paid" | "unknown";

export type PublicProduct = {
  _id: string;
  brandName: string;
  slug: string;
  productType: "ai" | "saas";
  categories: string[];
  shortDescription: string;
  officialUrl: string;
  affiliateUrl: string;
  pricingModel: PricingModel;
  platforms: string[];
  useCases: string[];
  lastVerifiedAt: string | null;
  updatedAt: string;
  url: string;
};

export type PublicFact = {
  _id: string;
  fieldName: string;
  factValue: string;
  sourceUrl: string;
  sourceType: string;
  checkedAt: string;
};

export type ArticleSummary = {
  _id: string;
  title: string;
  slug: string;
  articleType: "review" | "compare" | "alternatives" | "guide";
  productType: "ai" | "saas";
  excerpt: string;
  category?: string;
  coverImageUrl?: string;
  coverImageAlt?: string;
  author?: string;
  publishedAt: string | null;
  updatedAt?: string;
  url: string;
  // Sirf list endpoint deta hai (product ids) — category page par "Read review" ke liye.
  products?: string[];
};

export type ProductDetail = PublicProduct & { facts: PublicFact[]; articles: ArticleSummary[] };

export type PublicArticle = Omit<ArticleSummary, "products"> & {
  products: PublicProduct[];
  audience: string;
  body: string;
  metaTitle: string;
  metaDescription: string;
  author: string;
  reviewer: string;
  reviewMethod: "research_based" | "hands_on";
  disclosure: string;
  coverImageCredit?: string;
  sources: { url: string; title: string; checkedAt: string | null }[];
  faq: { question: string; answer: string }[];
  updatedAt: string;
};

type Paged<T> = { items: T[]; total: number };

function base() {
  const url = process.env.API_URL;
  if (!url) throw new Error("API_URL is not set in .env.local");
  return url.replace(/\/+$/, "");
}

// 404 => null. Baaki errors throw (error page dikhega, galat "not found" nahi).
async function get<T>(path: string): Promise<T | null> {
  // Content pages request par render hon, build par nahi: build ke waqt API band ho
  // tab bhi deploy ho sake. Data phir bhi "content" tag ke saath cache rehta hai.
  await connection();
  const res = await fetch(`${base()}/api/public${path}`, {
    next: { revalidate: 300, tags: [CONTENT_TAG] },
  });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`Content API error ${res.status} for ${path}`);
  return (await res.json()) as T;
}

function qs(params: Record<string, string | undefined>) {
  const q = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) if (v) q.set(k, v);
  const s = q.toString();
  return s ? `?${s}` : "";
}

export async function listProducts(params: { type?: string; category?: string; pricing?: string; platform?: string }) {
  return (await get<Paged<PublicProduct>>(`/products${qs({ ...params, limit: "100" })}`)) ?? { items: [], total: 0 };
}

export function findProduct(slug: string) {
  return get<ProductDetail>(`/products/${encodeURIComponent(slug)}`);
}

export async function getProductOr404(slug: string) {
  return (await findProduct(slug)) ?? notFound();
}

export async function listArticles(params: { articleType?: string; productType?: string; category?: string; limit?: number }) {
  const limit = String(params.limit ?? 100);
  return (
    (await get<Paged<ArticleSummary>>(
      `/articles${qs({ articleType: params.articleType, productType: params.productType, category: params.category, limit })}`,
    )) ?? { items: [], total: 0 }
  );
}

export async function searchContent(q: string) {
  const empty = { q, products: [] as PublicProduct[], articles: [] as ArticleSummary[] };
  if (q.trim().length < 2) return empty;
  return (await get<typeof empty>(`/search${qs({ q: q.trim() })}`)) ?? empty;
}

export function findArticle(productType: string, articleType: string, slug: string) {
  return get<PublicArticle>(`/articles/${productType}/${articleType}/${encodeURIComponent(slug)}`);
}

export async function getArticleOr404(productType: string, articleType: string, slug: string) {
  return (await findArticle(productType, articleType, slug)) ?? notFound();
}
