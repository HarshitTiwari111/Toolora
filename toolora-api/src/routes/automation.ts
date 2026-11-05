import { Router } from "express";
import { z } from "zod";
import { requireAutomation } from "../middleware/auth.js";
import { HttpError, notFoundIfNull, objectId, parse } from "../lib/http.js";
import {
  articleSchema, automationTopicStatusSchema, linkSuggestionSchema, productSchema, sourceFactSchema,
  topicSchema, workflowLogSchema,
} from "../lib/schemas.js";
import { articlePath, articleWordCount, MAX_ARTICLE_WORDS, publishGateFailures } from "../lib/content.js";
import { siteInventory } from "../lib/inventory.js";
import { makeTopicKey, slugify } from "../lib/text.js";
import { Article } from "../models/Article.js";
import { Product } from "../models/Product.js";
import { SourceFact } from "../models/SourceFact.js";
import { Topic } from "../models/Topic.js";
import { LinkSuggestion, WorkflowLog } from "../models/misc.js";
import { IMAGE_TYPES, ImageAsset, MAX_IMAGE_BYTES } from "../models/Image.js";

// n8n ke liye (PDF section 6). Header: x-api-key.
// Rule: ye routes kabhi publish/approve nahi kar sakte. Sirf drafts.
export const automationRouter = Router();
automationRouter.use(requireAutomation);

// Node 2/4: next candidate topics.
automationRouter.get("/topics/next", async (req, res) => {
  const limit = Math.min(20, Math.max(1, Number(req.query.limit) || 1));
  const items = await Topic.find({ status: "new" }).sort({ priority: -1, createdAt: 1 }).limit(limit).lean();
  res.json({ items });
});

// Node 3: dedupe. Same topicKey pehle se hai to naya nahi banega.
automationRouter.post("/topics", async (req, res) => {
  const data = parse(topicSchema, req.body);
  const topicKey = makeTopicKey(data.productType, data.intent, data.primaryKeyword);
  const existing = await Topic.findOne({ topicKey }).lean();
  if (existing) return res.status(200).json({ duplicate: true, topic: existing });
  res.status(201).json({ duplicate: false, topic: await Topic.create(data) });
});

automationRouter.post("/topics/:id/status", async (req, res) => {
  const { status } = parse(automationTopicStatusSchema, req.body);
  res.json(notFoundIfNull(await Topic.findByIdAndUpdate(objectId(req.params.id), { status }, { new: true }), "Topic"));
});

// Products dhundo (draft bhi), taaki duplicate na bane aur article me product id mil jaye.
automationRouter.get("/products", async (req, res) => {
  const q = typeof req.query.q === "string" ? req.query.q.trim().slice(0, 80) : "";
  const filter = q ? { $or: [{ slug: slugify(q) }, { brandName: { $regex: q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), $options: "i" } }] } : {};
  const items = await Product.find(filter).select("brandName slug productType categories status pricingModel lastVerifiedAt").sort({ brandName: 1 }).limit(25).lean();
  res.json({ items: items.map((p) => ({ ...p, id: String(p._id) })) });
});

// Naya product hamesha DRAFT. Website par tab dikhega jab editor admin me Active kare.
automationRouter.post("/products", async (req, res) => {
  const data = parse(productSchema, req.body);
  const slug = data.slug ?? slugify(data.brandName);
  const existing = await Product.findOne({ slug }).select("brandName slug status productType").lean();
  if (existing) return res.status(200).json({ duplicate: true, id: String(existing._id), product: existing });
  const product = await Product.create({ ...data, slug, status: "draft" });
  res.status(201).json({ duplicate: false, id: String(product._id), slug: product.slug, status: product.status });
});

// Image upload (base64 JSON). SVG me script/event handlers allowed nahi.
const imageUploadSchema = z.object({
  filename: z.string().trim().min(3).max(120),
  contentType: z.enum(IMAGE_TYPES),
  dataBase64: z.string().min(10),
  alt: z.string().max(200).default(""),
});
automationRouter.post("/images", async (req, res) => {
  const body = parse(imageUploadSchema, req.body);
  const data = Buffer.from(body.dataBase64, "base64");
  if (!data.length) throw new HttpError(400, "Empty image");
  if (data.length > MAX_IMAGE_BYTES) throw new HttpError(413, `Image too large (max ${MAX_IMAGE_BYTES / 1024 / 1024} MB)`);
  if (body.contentType === "image/svg+xml") {
    const text = data.toString("utf8");
    if (!/<svg[\s>]/i.test(text)) throw new HttpError(400, "Not an SVG file");
    if (/<script|\son\w+\s*=|javascript:|<foreignObject|<iframe|<embed|<object/i.test(text)) {
      throw new HttpError(400, "SVG must not contain scripts, event handlers or embedded content");
    }
  }
  const ext = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp", "image/svg+xml": "svg" }[body.contentType];
  const name = `${slugify(body.filename.replace(/\.[a-z0-9]+$/i, "")) || "image"}.${ext}`;
  const img = await ImageAsset.create({ filename: name, contentType: body.contentType, size: data.length, alt: body.alt, data });
  // Ye path article ke coverImageUrl ya body <img src> me use karo.
  res.status(201).json({ id: String(img._id), url: `/media/${img._id}/${name}`, size: data.length });
});

// Draft bhejne se pehle check: words, internal links (sirf live pages), meta, sources.
const checkSchema = z.object({
  title: z.string().default(""),
  body: z.string().default(""),
  metaTitle: z.string().default(""),
  metaDescription: z.string().default(""),
  disclosure: z.string().default(""),
  sources: z.array(z.unknown()).default([]),
  faq: z.array(z.unknown()).default([]),
});
automationRouter.post("/articles/check", async (req, res) => {
  const a = parse(checkSchema, req.body);
  const inventory = new Set((await siteInventory()).map((i) => i.url));
  const hrefs = [...new Set([...a.body.matchAll(/<a\s[^>]*href=["'](\/[^"'#?]*)/gi)].map((m) => m[1]))];
  const links = hrefs.map((href) => {
    const norm = href.endsWith("/") ? href : `${href}/`;
    return { href, exists: inventory.has(norm) || inventory.has(href) };
  });
  // Reviewer human editor admin me lagata hai, isliye yahan check se bahar.
  const issues = publishGateFailures({ ...a, articleType: "review", slug: "check", reviewer: "editor" });
  const broken = links.filter((l) => !l.exists).map((l) => l.href);
  if (broken.length) issues.push(`Internal links to pages that don't exist: ${broken.join(", ")}`);
  if (a.metaTitle.length > 70) issues.push(`Meta title is ${a.metaTitle.length} chars (max 70)`);
  if (a.metaDescription && (a.metaDescription.length < 120 || a.metaDescription.length > 170)) {
    issues.push(`Meta description is ${a.metaDescription.length} chars (aim 120-170)`);
  }
  const words = articleWordCount(a.body);
  if (words < 700) issues.push(`Body is only ${words} words; aim for 1,100-1,400 (max ${MAX_ARTICLE_WORDS})`);
  if (/<h1[\s>]/i.test(a.body)) issues.push("Body must not contain an H1 (the title is the H1)");
  if (a.faq.length < 3) issues.push("Add 3-5 FAQ items");
  const imgs = [...a.body.matchAll(/<img\s[^>]*>/gi)].map((m) => m[0]);
  if (imgs.some((t) => !/alt=["'][^"']{10,}/i.test(t))) issues.push("Every <img> needs descriptive alt text");
  res.json({
    ok: issues.length === 0,
    wordCount: words,
    maxWords: MAX_ARTICLE_WORDS,
    internalLinks: links,
    images: imgs.length,
    issues,
  });
});

// Node 5: official source facts save karna.
automationRouter.post("/facts", async (req, res) => {
  const body = parse(sourceFactSchema.extend({ productSlug: z.string().min(1) }), req.body);
  const product = notFoundIfNull(await Product.findOne({ slug: body.productSlug }), "Product");
  const { productSlug: _ignored, ...fact } = body;
  res.status(201).json(await SourceFact.create({ ...fact, product: product._id }));
});

// Node 9: draft banana. Idempotent — same topicKey par existing draft return hota hai.
automationRouter.post("/articles/draft", async (req, res) => {
  const body = parse(articleSchema.extend({ topicKey: z.string().min(3) }), req.body);
  const existing = await Article.findOne({ topicKey: body.topicKey }).select("_id slug status productType articleType").lean();
  if (existing) return res.status(200).json({ duplicate: true, id: existing._id, status: existing.status, url: articlePath(existing) });

  const topic = await Topic.findOne({ topicKey: body.topicKey });
  if (!topic) throw new HttpError(404, "Topic not found for topicKey");

  // Slug clash ho to -2, -3 ... (drafts duplicate URL na lein).
  const base = body.slug ?? slugify(body.title);
  let slug = base;
  for (let n = 2; await Article.exists({ productType: body.productType, articleType: body.articleType, slug }); n++) {
    slug = `${base}-${n}`;
  }

  const article = await Article.create({
    ...body,
    slug,
    status: "draft", // kabhi publish nahi
    createdBy: "automation",
    updateHistory: [{ note: "Draft created by automation", by: "automation" }],
  });
  topic.article = article._id;
  topic.status = "qa";
  await topic.save();

  res.status(201).json({ duplicate: false, id: article._id, status: article.status, url: articlePath(article) });
});

automationRouter.post("/articles/:id/links", async (req, res) => {
  const article = notFoundIfNull(await Article.findById(objectId(req.params.id)), "Article");
  const items = z.array(linkSuggestionSchema).max(50).parse(req.body?.items ?? []);
  const created = await LinkSuggestion.insertMany(items.map((l) => ({ ...l, sourceArticle: article._id, approved: false })));
  res.status(201).json({ created: created.length });
});

// Node 10: har node ka log.
automationRouter.post("/logs", async (req, res) => {
  res.status(201).json(await WorkflowLog.create(parse(workflowLogSchema, req.body)));
});
