import { Router } from "express";
import bcrypt from "bcryptjs";
import rateLimit from "express-rate-limit";
import { requireAdmin, signAdminToken } from "../middleware/auth.js";
import { HttpError, notFoundIfNull, objectId, paging, parse } from "../lib/http.js";
import {
  articleSchema, articleStatusSchema, linkSuggestionSchema, loginSchema, productSchema,
  sourceFactSchema, topicSchema, topicStatusSchema,
} from "../lib/schemas.js";
import { articlePath, productPath, publishGateFailures } from "../lib/content.js";
import { slugify } from "../lib/text.js";
import { Article } from "../models/Article.js";
import { Product } from "../models/Product.js";
import { SourceFact } from "../models/SourceFact.js";
import { Topic } from "../models/Topic.js";
import { AdminUser, LinkSuggestion, WorkflowLog } from "../models/misc.js";

export const adminRouter = Router();

// ---------- Auth ----------

const loginLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 10, standardHeaders: "draft-8", legacyHeaders: false });

adminRouter.post("/auth/login", loginLimiter, async (req, res) => {
  const { email, password } = parse(loginSchema, req.body);
  const user = await AdminUser.findOne({ email: email.toLowerCase() }).select("+passwordHash");
  // Same error for wrong email or password.
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    throw new HttpError(401, "Invalid email or password");
  }
  user.lastLoginAt = new Date();
  await user.save();
  const token = signAdminToken({ sub: String(user._id), email: user.email, role: user.role });
  res.json({ token, user: { email: user.email, name: user.name, role: user.role } });
});

adminRouter.use(requireAdmin);

adminRouter.get("/auth/me", (req, res) => {
  res.json({ user: req.admin });
});

adminRouter.get("/stats", async (_req, res) => {
  const [products, articlesByStatus, topicsByStatus, recentErrors] = await Promise.all([
    Product.countDocuments(),
    Article.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }]),
    Topic.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }]),
    WorkflowLog.countDocuments({ status: "error", createdAt: { $gte: new Date(Date.now() - 7 * 864e5) } }),
  ]);
  const toMap = (rows: { _id: string; count: number }[]) => Object.fromEntries(rows.map((r) => [r._id, r.count]));
  res.json({ products, articles: toMap(articlesByStatus), topics: toMap(topicsByStatus), workflowErrors7d: recentErrors });
});

// ---------- Products ----------

adminRouter.get("/products", async (req, res) => {
  const { page, limit, skip } = paging(req.query);
  const filter: Record<string, unknown> = {};
  if (typeof req.query.type === "string") filter.productType = req.query.type;
  if (typeof req.query.status === "string") filter.status = req.query.status;
  if (typeof req.query.q === "string" && req.query.q.trim()) {
    filter.brandName = { $regex: req.query.q.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), $options: "i" };
  }
  const [items, total] = await Promise.all([
    Product.find(filter).sort({ updatedAt: -1 }).skip(skip).limit(limit).lean(),
    Product.countDocuments(filter),
  ]);
  res.json({ items: items.map((p) => ({ ...p, url: productPath(p) })), total, page, limit });
});

adminRouter.post("/products", async (req, res) => {
  const data = parse(productSchema, req.body);
  const product = await Product.create({ ...data, slug: data.slug ?? slugify(data.brandName) });
  res.status(201).json(product);
});

adminRouter.get("/products/:id", async (req, res) => {
  const product = notFoundIfNull(await Product.findById(objectId(req.params.id)).lean(), "Product");
  const facts = await SourceFact.find({ product: product._id }).sort({ fieldName: 1 }).lean();
  res.json({ ...product, url: productPath(product), facts });
});

adminRouter.patch("/products/:id", async (req, res) => {
  const data = parse(productSchema, req.body);
  const product = notFoundIfNull(
    await Product.findByIdAndUpdate(objectId(req.params.id), { ...data, slug: data.slug ?? slugify(data.brandName) }, { new: true, runValidators: true }),
    "Product",
  );
  res.json(product);
});

adminRouter.delete("/products/:id", async (req, res) => {
  const id = objectId(req.params.id);
  notFoundIfNull(await Product.findByIdAndDelete(id), "Product");
  await SourceFact.deleteMany({ product: id });
  res.status(204).end();
});

adminRouter.post("/products/:id/facts", async (req, res) => {
  const product = notFoundIfNull(await Product.findById(objectId(req.params.id)), "Product");
  const fact = await SourceFact.create({ ...parse(sourceFactSchema, req.body), product: product._id });
  res.status(201).json(fact);
});

adminRouter.delete("/facts/:id", async (req, res) => {
  notFoundIfNull(await SourceFact.findByIdAndDelete(objectId(req.params.id)), "Fact");
  res.status(204).end();
});

// ---------- Articles ----------

adminRouter.get("/articles", async (req, res) => {
  const { page, limit, skip } = paging(req.query);
  const filter: Record<string, unknown> = {};
  for (const key of ["status", "articleType", "productType", "createdBy"] as const) {
    if (typeof req.query[key] === "string") filter[key] = req.query[key];
  }
  const [items, total] = await Promise.all([
    Article.find(filter).select("-body").sort({ updatedAt: -1 }).skip(skip).limit(limit).lean(),
    Article.countDocuments(filter),
  ]);
  res.json({ items: items.map((a) => ({ ...a, url: articlePath(a) })), total, page, limit });
});

adminRouter.post("/articles", async (req, res) => {
  const data = parse(articleSchema, req.body);
  const article = await Article.create({
    ...data,
    slug: data.slug ?? slugify(data.title),
    status: "draft",
    createdBy: "admin",
    updateHistory: [{ note: "Created", by: req.admin!.email }],
  });
  res.status(201).json(article);
});

adminRouter.get("/articles/:id", async (req, res) => {
  const article = notFoundIfNull(
    await Article.findById(objectId(req.params.id)).populate("products", "brandName slug productType").lean(),
    "Article",
  );
  const links = await LinkSuggestion.find({ sourceArticle: article._id }).lean();
  res.json({ ...article, url: articlePath(article), links, publishGateFailures: publishGateFailures(article) });
});

adminRouter.patch("/articles/:id", async (req, res) => {
  const data = parse(articleSchema, req.body);
  const article = notFoundIfNull(await Article.findById(objectId(req.params.id)), "Article");
  article.set({ ...data, slug: data.slug ?? article.slug });
  article.updateHistory.push({ note: "Edited", by: req.admin!.email, date: new Date() });
  await article.save();
  res.json(article);
});

// Status change. "published" sirf tab jab saare gates pass hon (human approval).
adminRouter.post("/articles/:id/status", async (req, res) => {
  const { status, note } = parse(articleStatusSchema, req.body);
  const article = notFoundIfNull(await Article.findById(objectId(req.params.id)), "Article");
  if (status === "published") {
    const fails = publishGateFailures(article);
    if (fails.length) throw new HttpError(422, "Article is not ready to publish", fails);
    article.publishedAt ??= new Date();
  }
  article.status = status;
  article.updateHistory.push({ note: `Status → ${status}${note ? `: ${note}` : ""}`, by: req.admin!.email, date: new Date() });
  await article.save();
  if (article.topicKey && (status === "approved" || status === "published")) {
    await Topic.updateOne({ topicKey: article.topicKey }, { status });
  }
  res.json(article);
});

adminRouter.delete("/articles/:id", async (req, res) => {
  const id = objectId(req.params.id);
  notFoundIfNull(await Article.findByIdAndDelete(id), "Article");
  await LinkSuggestion.deleteMany({ sourceArticle: id });
  res.status(204).end();
});

adminRouter.post("/articles/:id/links", async (req, res) => {
  const article = notFoundIfNull(await Article.findById(objectId(req.params.id)), "Article");
  const link = await LinkSuggestion.create({ ...parse(linkSuggestionSchema, req.body), sourceArticle: article._id });
  res.status(201).json(link);
});

adminRouter.patch("/links/:id", async (req, res) => {
  const approved = Boolean(req.body?.approved);
  res.json(notFoundIfNull(await LinkSuggestion.findByIdAndUpdate(objectId(req.params.id), { approved }, { new: true }), "Link"));
});

adminRouter.delete("/links/:id", async (req, res) => {
  notFoundIfNull(await LinkSuggestion.findByIdAndDelete(objectId(req.params.id)), "Link");
  res.status(204).end();
});

// ---------- Topics ----------

adminRouter.get("/topics", async (req, res) => {
  const { page, limit, skip } = paging(req.query);
  const filter: Record<string, unknown> = {};
  if (typeof req.query.status === "string") filter.status = req.query.status;
  const [items, total] = await Promise.all([
    Topic.find(filter).sort({ priority: -1, createdAt: 1 }).skip(skip).limit(limit).lean(),
    Topic.countDocuments(filter),
  ]);
  res.json({ items, total, page, limit });
});

adminRouter.post("/topics", async (req, res) => {
  res.status(201).json(await Topic.create(parse(topicSchema, req.body)));
});

adminRouter.post("/topics/:id/status", async (req, res) => {
  const { status } = parse(topicStatusSchema, req.body);
  res.json(notFoundIfNull(await Topic.findByIdAndUpdate(objectId(req.params.id), { status }, { new: true }), "Topic"));
});

adminRouter.delete("/topics/:id", async (req, res) => {
  notFoundIfNull(await Topic.findByIdAndDelete(objectId(req.params.id)), "Topic");
  res.status(204).end();
});

// ---------- Workflow logs ----------

adminRouter.get("/logs", async (req, res) => {
  const { page, limit, skip } = paging(req.query);
  const filter: Record<string, unknown> = {};
  if (typeof req.query.status === "string") filter.status = req.query.status;
  const [items, total] = await Promise.all([
    WorkflowLog.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    WorkflowLog.countDocuments(filter),
  ]);
  res.json({ items, total, page, limit });
});
