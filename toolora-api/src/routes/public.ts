import { Router } from "express";
import { ARTICLE_TYPES, PRODUCT_TYPES } from "../constants.js";
import { HttpError, notFoundIfNull, paging } from "../lib/http.js";
import { articlePath, productPath } from "../lib/content.js";
import { Article } from "../models/Article.js";
import { Product } from "../models/Product.js";
import { SourceFact } from "../models/SourceFact.js";

// Website ke liye. Sirf ACTIVE products aur PUBLISHED articles. Drafts kabhi yahan se nahi niklenge.
export const publicRouter = Router();

const PRIVATE_ARTICLE_FIELDS = "-qaFlags -claimsNeedingReview -topicKey -createdBy -__v";
const PUBLIC_PRODUCT_FIELDS = "brandName slug productType categories shortDescription officialUrl affiliateUrl pricingModel platforms useCases lastVerifiedAt updatedAt";

function oneOf<T extends readonly string[]>(list: T, value: unknown): T[number] | undefined {
  return typeof value === "string" && (list as readonly string[]).includes(value) ? (value as T[number]) : undefined;
}

publicRouter.get("/products", async (req, res) => {
  const { page, limit, skip } = paging(req.query);
  const filter: Record<string, unknown> = { status: "active" };
  const type = oneOf(PRODUCT_TYPES, req.query.type);
  if (type) filter.productType = type;
  if (typeof req.query.category === "string") filter.categories = req.query.category;
  if (typeof req.query.pricing === "string") filter.pricingModel = req.query.pricing;
  if (typeof req.query.platform === "string") filter.platforms = req.query.platform;
  if (typeof req.query.useCase === "string") filter.useCases = req.query.useCase;

  const [items, total] = await Promise.all([
    Product.find(filter).select(PUBLIC_PRODUCT_FIELDS).sort({ brandName: 1 }).skip(skip).limit(limit).lean(),
    Product.countDocuments(filter),
  ]);
  res.json({ items: items.map((p) => ({ ...p, url: productPath(p) })), total, page, limit });
});

publicRouter.get("/products/:slug", async (req, res) => {
  const product = notFoundIfNull(
    await Product.findOne({ slug: req.params.slug, status: "active" }).select(PUBLIC_PRODUCT_FIELDS).lean(),
    "Product",
  );
  const [facts, articles] = await Promise.all([
    SourceFact.find({ product: product._id }).select("fieldName factValue sourceUrl sourceType checkedAt").sort({ fieldName: 1 }).lean(),
    Article.find({ products: product._id, status: "published" }).select("title slug articleType productType excerpt category coverImageUrl coverImageAlt author publishedAt updatedAt").sort({ publishedAt: -1 }).lean(),
  ]);
  res.json({
    ...product,
    url: productPath(product),
    facts,
    articles: articles.map((a) => ({ ...a, url: articlePath(a) })),
  });
});

publicRouter.get("/articles", async (req, res) => {
  const { page, limit, skip } = paging(req.query);
  const filter: Record<string, unknown> = { status: "published" };
  const articleType = oneOf(ARTICLE_TYPES, req.query.articleType);
  const productType = oneOf(PRODUCT_TYPES, req.query.productType);
  if (articleType) filter.articleType = articleType;
  if (productType) filter.productType = productType;
  if (typeof req.query.category === "string" && /^[a-z0-9-]{1,40}$/.test(req.query.category)) filter.category = req.query.category;

  const [items, total] = await Promise.all([
    Article.find(filter).select("title slug articleType productType excerpt category coverImageUrl coverImageAlt author publishedAt updatedAt products").sort({ publishedAt: -1 }).skip(skip).limit(limit).lean(),
    Article.countDocuments(filter),
  ]);
  res.json({ items: items.map((a) => ({ ...a, url: articlePath(a) })), total, page, limit });
});

publicRouter.get("/articles/:productType/:articleType/:slug", async (req, res) => {
  const productType = oneOf(PRODUCT_TYPES, req.params.productType);
  const articleType = oneOf(ARTICLE_TYPES, req.params.articleType);
  if (!productType || !articleType) throw new HttpError(404, "Article not found");

  const article = notFoundIfNull(
    await Article.findOne({ productType, articleType, slug: req.params.slug, status: "published" })
      .select(PRIVATE_ARTICLE_FIELDS)
      .populate({ path: "products", match: { status: "active" }, select: PUBLIC_PRODUCT_FIELDS })
      .lean(),
    "Article",
  );
  // Populated products ko bhi public URL chahiye (draft/archived products match se pehle hi hat jaate hain).
  const products = (article.products as unknown as { productType: string; slug: string }[])
    .filter(Boolean)
    .map((p) => ({ ...p, url: productPath(p) }));
  res.json({ ...article, products, url: articlePath(article) });
});

// Site search (PDF section 1): sirf active products + published articles.
publicRouter.get("/search", async (req, res) => {
  const q = typeof req.query.q === "string" ? req.query.q.trim().slice(0, 80) : "";
  if (q.length < 2) return res.json({ q, products: [], articles: [] });
  const rx = { $regex: q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), $options: "i" };
  const [products, articles] = await Promise.all([
    Product.find({ status: "active", $or: [{ brandName: rx }, { shortDescription: rx }, { useCases: rx }, { categories: rx }] })
      .select(PUBLIC_PRODUCT_FIELDS)
      .sort({ brandName: 1 })
      .limit(24)
      .lean(),
    Article.find({ status: "published", $or: [{ title: rx }, { excerpt: rx }] })
      .select("title slug articleType productType excerpt category coverImageUrl coverImageAlt author publishedAt updatedAt")
      .sort({ publishedAt: -1 })
      .limit(24)
      .lean(),
  ]);
  res.json({
    q,
    products: products.map((p) => ({ ...p, url: productPath(p) })),
    articles: articles.map((a) => ({ ...a, url: articlePath(a) })),
  });
});

// Sitemap + internal-link inventory (PDF section 8): sirf live canonical URLs.
publicRouter.get("/inventory", async (_req, res) => {
  const [products, articles] = await Promise.all([
    Product.find({ status: "active" }).select("slug productType brandName updatedAt").lean(),
    Article.find({ status: "published" }).select("slug productType articleType title updatedAt").lean(),
  ]);
  res.json({
    items: [
      ...products.map((p) => ({ url: productPath(p), title: p.brandName, kind: "product", updatedAt: p.updatedAt })),
      ...articles.map((a) => ({ url: articlePath(a), title: a.title, kind: a.articleType, updatedAt: a.updatedAt })),
    ],
  });
});
