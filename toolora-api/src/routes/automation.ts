import { Router } from "express";
import { z } from "zod";
import { requireAutomation } from "../middleware/auth.js";
import { HttpError, notFoundIfNull, objectId, parse } from "../lib/http.js";
import {
  articleSchema, automationTopicStatusSchema, linkSuggestionSchema, sourceFactSchema,
  topicSchema, workflowLogSchema,
} from "../lib/schemas.js";
import { articlePath } from "../lib/content.js";
import { makeTopicKey, slugify } from "../lib/text.js";
import { Article } from "../models/Article.js";
import { Product } from "../models/Product.js";
import { SourceFact } from "../models/SourceFact.js";
import { Topic } from "../models/Topic.js";
import { LinkSuggestion, WorkflowLog } from "../models/misc.js";

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
