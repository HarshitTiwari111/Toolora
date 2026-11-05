import { AI_CATEGORIES, SAAS_CATEGORIES } from "../constants.js";
import { Article } from "../models/Article.js";
import { Product } from "../models/Product.js";
import { articlePath, productPath } from "./content.js";

// Site ke saare live URLs: internal links sirf inhi par lagne chahiye (PDF section 8).
export type InventoryItem = { url: string; title: string; kind: string; updatedAt?: Date };

const humanize = (s: string) => s.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

const STATIC_PAGES: InventoryItem[] = [
  { url: "/", title: "Home", kind: "page" },
  { url: "/blog/", title: "Blog", kind: "section" },
  { url: "/ai-tools/", title: "AI tools directory", kind: "section" },
  { url: "/saas/", title: "SaaS directory", kind: "section" },
  { url: "/reviews/", title: "AI tool reviews", kind: "section" },
  { url: "/compare/", title: "AI tool comparisons", kind: "section" },
  { url: "/alternatives/", title: "AI tool alternatives", kind: "section" },
  { url: "/guides/", title: "AI guides", kind: "section" },
  { url: "/saas-reviews/", title: "SaaS reviews", kind: "section" },
  { url: "/saas-compare/", title: "SaaS comparisons", kind: "section" },
  { url: "/saas-alternatives/", title: "SaaS alternatives", kind: "section" },
  { url: "/saas-guides/", title: "SaaS guides", kind: "section" },
  ...["about", "editorial-policy", "how-we-review", "contact", "privacy-policy", "terms", "affiliate-disclosure", "corrections"].map(
    (s) => ({ url: `/${s}/`, title: humanize(s), kind: "trust" }),
  ),
  ...AI_CATEGORIES.map((c) => ({ url: `/ai-tools/${c}/`, title: `AI ${humanize(c)} tools`, kind: "category" })),
  ...SAAS_CATEGORIES.map((c) => ({ url: `/saas/${c}/`, title: `${humanize(c)} software`, kind: "category" })),
];

export async function siteInventory(): Promise<InventoryItem[]> {
  const [products, articles] = await Promise.all([
    Product.find({ status: "active" }).select("slug productType brandName updatedAt").lean(),
    Article.find({ status: "published" }).select("slug productType articleType title updatedAt").lean(),
  ]);
  return [
    ...STATIC_PAGES,
    ...products.map((p) => ({ url: productPath(p), title: p.brandName, kind: "product", updatedAt: p.updatedAt })),
    ...articles.map((a) => ({ url: articlePath(a), title: a.title, kind: a.articleType, updatedAt: a.updatedAt })),
  ];
}
