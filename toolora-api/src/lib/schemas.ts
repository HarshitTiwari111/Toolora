import { z } from "zod";
import {
  AI_CATEGORIES, ARTICLE_STATUSES, ARTICLE_TYPES, LINK_TYPES, LOG_STATUSES, PRICING_MODELS,
  PRODUCT_STATUSES, PRODUCT_TYPES, REVIEW_METHODS, SAAS_CATEGORIES, SOURCE_TYPES,
  TOPIC_INTENTS, TOPIC_STATUSES,
} from "../constants.js";

const url = z.url({ protocol: /^https?$/ });
const optionalUrl = z.union([url, z.literal("")]);
const dateish = z.coerce.date();
const objectIdStr = z.string().regex(/^[a-f0-9]{24}$/i, "Invalid id");
const slug = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug: lowercase letters, numbers, hyphens");

export const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(1).max(200),
});

export const productSchema = z
  .object({
    brandName: z.string().trim().min(1).max(120),
    slug: slug.optional(),
    productType: z.enum(PRODUCT_TYPES),
    categories: z.array(z.string()).default([]),
    shortDescription: z.string().max(500).default(""),
    officialUrl: url,
    affiliateUrl: optionalUrl.default(""),
    logoRightsNote: z.string().max(500).default(""),
    pricingModel: z.enum(PRICING_MODELS).default("unknown"),
    platforms: z.array(z.string().trim().min(1)).default([]),
    useCases: z.array(z.string().trim().min(1)).default([]),
    lastVerifiedAt: dateish.nullable().default(null),
    status: z.enum(PRODUCT_STATUSES).default("draft"),
  })
  .superRefine((p, ctx) => {
    const allowed: readonly string[] = p.productType === "ai" ? AI_CATEGORIES : SAAS_CATEGORIES;
    const bad = p.categories.filter((c) => !allowed.includes(c));
    if (bad.length) {
      ctx.addIssue({ code: "custom", path: ["categories"], message: `Unknown ${p.productType} categories: ${bad.join(", ")}` });
    }
  });

export const sourceFactSchema = z.object({
  fieldName: z.string().trim().min(1).max(80),
  factValue: z.string().trim().min(1).max(2000),
  sourceUrl: url,
  sourceType: z.enum(SOURCE_TYPES).default("official"),
  checkedAt: dateish,
  evidenceNote: z.string().max(2000).default(""),
});

const articleSource = z.object({ url, title: z.string().max(300).default(""), checkedAt: dateish.nullable().default(null) });

export const articleSchema = z.object({
  title: z.string().trim().min(1).max(200),
  slug: slug.optional(),
  articleType: z.enum(ARTICLE_TYPES),
  productType: z.enum(PRODUCT_TYPES).default("ai"),
  products: z.array(objectIdStr).default([]),
  audience: z.string().max(300).default(""),
  body: z.string().max(200_000).default(""),
  excerpt: z.string().max(500).default(""),
  metaTitle: z.string().max(70).default(""),
  metaDescription: z.string().max(170).default(""),
  author: z.string().max(100).default(""),
  reviewer: z.string().max(100).default(""),
  reviewMethod: z.enum(REVIEW_METHODS).default("research_based"),
  disclosure: z.string().max(1000).default(""),
  sources: z.array(articleSource).default([]),
  faq: z.array(z.object({ question: z.string().min(1), answer: z.string().min(1) })).default([]),
  qaFlags: z.array(z.string()).default([]),
  claimsNeedingReview: z.array(z.string()).default([]),
});

export const articleStatusSchema = z.object({
  status: z.enum(ARTICLE_STATUSES),
  note: z.string().max(500).default(""),
});

export const topicSchema = z.object({
  primaryKeyword: z.string().trim().min(2).max(200),
  secondaryQueries: z.array(z.string()).default([]),
  intent: z.enum(TOPIC_INTENTS),
  productType: z.enum(PRODUCT_TYPES).default("ai"),
  brand: z.string().max(120).default(""),
  country: z.string().max(10).default("us"),
  language: z.string().max(10).default("en"),
  provider: z.string().max(60).default(""),
  volume: z.number().int().nonnegative().nullable().default(null),
  difficulty: z.number().min(0).max(100).nullable().default(null),
  clusterId: z.string().max(80).default(""),
  priority: z.number().int().min(1).max(5).default(3),
  sourceUrls: z.array(url).default([]),
  sourceCheckedAt: dateish.nullable().default(null),
  assignedEditor: z.string().max(100).default(""),
});

export const topicStatusSchema = z.object({ status: z.enum(TOPIC_STATUSES) });
// Automation approved/published status set nahi kar sakti (human approval gate).
export const automationTopicStatusSchema = z.object({
  status: z.enum(["research", "brief_ready", "draft", "qa"]),
});

export const linkSuggestionSchema = z.object({
  targetUrl: z.string().min(1).max(500),
  anchorText: z.string().trim().min(1).max(200),
  reason: z.string().max(500).default(""),
  linkType: z.enum(LINK_TYPES),
});

export const workflowLogSchema = z.object({
  runId: z.string().min(1).max(100),
  node: z.string().min(1).max(100),
  status: z.enum(LOG_STATUSES),
  retries: z.number().int().min(0).default(0),
  errorSummary: z.string().max(2000).default(""),
  tokenCostEstimate: z.number().nonnegative().nullable().default(null),
  topicKey: z.string().max(300).default(""),
  meta: z.record(z.string(), z.unknown()).default({}),
});
