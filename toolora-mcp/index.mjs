#!/usr/bin/env node
// Toolora.ai MCP server for Claude Desktop.
// Claude researches a topic, writes the article and saves it as a DRAFT through the automation API.
// Nothing here can publish: an editor approves and publishes in /admin (PDF rule: human approval).
//
// Env: TOOLORA_API_URL (e.g. https://toolora-api.onrender.com), TOOLORA_API_KEY (AUTOMATION_API_KEY),
//      TOOLORA_SITE_URL (public website, for admin links).
import { readFile } from "node:fs/promises";
import { extname, basename, dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const API = (process.env.TOOLORA_API_URL ?? "").replace(/\/+$/, "");
const KEY = process.env.TOOLORA_API_KEY ?? "";
const SITE = (process.env.TOOLORA_SITE_URL ?? "https://toolora-lake.vercel.app").replace(/\/+$/, "");
const HERE = dirname(fileURLToPath(import.meta.url));
const GUIDE_PATH = join(HERE, "..", "docs", "content", "WRITING-GUIDE.md");

const AI_CATEGORIES = ["writing", "coding", "image-generation", "video", "audio", "research", "productivity", "marketing", "chatbots", "automation"];
const SAAS_CATEGORIES = ["project-management", "crm", "email-marketing", "analytics", "customer-support", "finance", "security", "design"];
const PLATFORMS = ["web", "windows", "mac", "ios", "android", "api", "chrome-extension"];

// ---------------------------------------------------------------- HTTP helper
async function api(path, { method = "GET", body, auth = true } = {}) {
  if (!API) throw new Error("TOOLORA_API_URL is not set in the Claude Desktop config.");
  if (auth && !KEY) throw new Error("TOOLORA_API_KEY is not set in the Claude Desktop config.");
  // Render free plan so jata hai; pehli request me ~1 minute lag sakta hai.
  const res = await fetch(`${API}${path}`, {
    method,
    headers: { "content-type": "application/json", ...(auth ? { "x-api-key": KEY } : {}) },
    body: body === undefined ? undefined : JSON.stringify(body),
    signal: AbortSignal.timeout(120_000),
  });
  const text = await res.text();
  let data;
  try { data = text ? JSON.parse(text) : {}; } catch { data = { raw: text.slice(0, 500) }; }
  if (!res.ok) {
    const detail = data?.details ?? data?.issues ?? data?.error ?? data?.raw ?? res.statusText;
    throw new Error(`API ${method} ${path} failed (${res.status}): ${typeof detail === "string" ? detail : JSON.stringify(detail)}`);
  }
  return data;
}

const out = (obj) => ({ content: [{ type: "text", text: typeof obj === "string" ? obj : JSON.stringify(obj, null, 2) }] });
const fail = (e) => ({ isError: true, content: [{ type: "text", text: String(e?.message ?? e) }] });
const tool = (fn) => async (args) => { try { return out(await fn(args)); } catch (e) { return fail(e); } };

// ---------------------------------------------------------------- schemas
const dateStr = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Use YYYY-MM-DD");
const source = z.object({ url: z.string().url(), title: z.string().default(""), checkedAt: dateStr });
const faqItem = z.object({ question: z.string().min(5), answer: z.string().min(10) });
const articleShape = {
  title: z.string().min(10).max(200).describe("Page title / H1, includes the primary keyword"),
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).optional().describe("Short URL slug, e.g. notion-ai-review"),
  articleType: z.enum(["review", "compare", "alternatives", "guide"]),
  productType: z.enum(["ai", "saas"]),
  category: z.string().describe(`Category slug. AI: ${AI_CATEGORIES.join(", ")}. SaaS: ${SAAS_CATEGORIES.join(", ")}`),
  productIds: z.array(z.string()).default([]).describe("Product ids from find_products / create_product"),
  audience: z.string().max(300).default(""),
  body: z.string().min(200).describe("Article HTML (no H1). Use the classes listed in the writing guide."),
  excerpt: z.string().max(500).describe("1-2 sentence summary shown on cards"),
  metaTitle: z.string().max(70),
  metaDescription: z.string().max(170).describe("120-170 characters, includes the keyword"),
  author: z.string().max(100).default("Toolora Editorial Team"),
  disclosure: z.string().min(10).max(1000).describe("Affiliate disclosure, or a statement that there is none"),
  coverImageUrl: z.string().default("").describe("URL returned by upload_image (e.g. /media/<id>/name.jpg)"),
  coverImageAlt: z.string().max(200).default(""),
  coverImageCredit: z.string().max(200).default("Illustration: Toolora.ai"),
  sources: z.array(source).min(1).describe("Official sources with the date you checked them"),
  faq: z.array(faqItem).min(3).max(6),
  claimsNeedingReview: z.array(z.string()).default([]).describe("Anything you could not verify; the editor will check it"),
};

// ---------------------------------------------------------------- server
const server = new McpServer(
  { name: "toolora", version: "1.0.0" },
  {
    instructions: `Toolora.ai content tools. Workflow for every article:
1) Call get_writing_guide and follow it exactly (max 1,500 words, SEO checklist, >=2 internal links, allowed HTML classes, images).
2) Research ONLY official/first-party pages of the product (pricing, features, docs). Note the date you checked. Never invent prices, limits, ratings or hands-on testing; label the article research-based.
3) find_products -> create_product (if missing) -> save_source_fact for each key fact.
4) get_site_inventory and pick internal links ONLY from it.
5) Create images: write original SVG diagrams/charts from the facts (no logos/screenshots) and upload_image them; for the cover use convertToJpg=true (1600x900).
6) create_topic, then check_article and fix every issue, then create_article_draft.
Drafts are never published by these tools. Tell the user to review and publish in ${SITE}/admin/articles/.`,
  },
);

server.registerTool(
  "get_writing_guide",
  { title: "Get writing guide", description: "Toolora's editorial, SEO, interlinking and image rules. Read this before writing any article." },
  tool(async () => readFile(GUIDE_PATH, "utf8")),
);

server.registerTool(
  "get_site_inventory",
  { title: "Get site inventory", description: "All live pages on Toolora.ai (categories, products, articles, trust pages). Use only these URLs for internal links." },
  tool(async () => {
    const { items } = await api("/api/public/inventory", { auth: false });
    return { count: items.length, items: items.map(({ url, title, kind }) => ({ url, title, kind })) };
  }),
);

server.registerTool(
  "find_products",
  { title: "Find products", description: "Search existing products (including drafts) by name or slug. Returns their ids.", inputSchema: { q: z.string().default("").describe("Brand name, e.g. Notion") } },
  tool(async ({ q }) => api(`/api/automation/products?q=${encodeURIComponent(q)}`)),
);

server.registerTool(
  "create_product",
  {
    title: "Create product (draft)",
    description: "Add a new AI tool or SaaS product as a DRAFT. Returns its id. If the slug exists, returns the existing product instead.",
    inputSchema: {
      brandName: z.string().min(1),
      slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).optional(),
      productType: z.enum(["ai", "saas"]),
      categories: z.array(z.string()).min(1).describe(`AI: ${AI_CATEGORIES.join(", ")}. SaaS: ${SAAS_CATEGORIES.join(", ")}`),
      shortDescription: z.string().max(500),
      officialUrl: z.string().url(),
      pricingModel: z.enum(["free", "freemium", "paid", "unknown"]),
      platforms: z.array(z.enum(PLATFORMS)).default([]),
      useCases: z.array(z.string()).max(5).default([]).describe("Short phrases, e.g. Meeting notes"),
      lastVerifiedAt: dateStr.describe("Date you checked the official pages"),
    },
  },
  tool(async (args) => api("/api/automation/products", { method: "POST", body: { ...args, affiliateUrl: "", logoRightsNote: "No logo used. Brand initials only." } })),
);

server.registerTool(
  "save_source_fact",
  {
    title: "Save source fact",
    description: "Store one verified fact for a product with its official source URL and check date.",
    inputSchema: {
      productSlug: z.string(),
      fieldName: z.string().describe("e.g. pricing_pro, free_plan, languages, platforms"),
      factValue: z.string().max(2000),
      sourceUrl: z.string().url(),
      sourceType: z.enum(["official", "first-party", "other"]).default("official"),
      checkedAt: dateStr,
      evidenceNote: z.string().max(2000).default(""),
    },
  },
  tool(async (args) => api("/api/automation/facts", { method: "POST", body: args })),
);

server.registerTool(
  "list_topics",
  { title: "List topics", description: "Next topics waiting in the keyword queue (status new).", inputSchema: { limit: z.number().int().min(1).max(20).default(10) } },
  tool(async ({ limit }) => api(`/api/automation/topics/next?limit=${limit}`)),
);

server.registerTool(
  "create_topic",
  {
    title: "Create topic",
    description: "Add a keyword/topic to the queue (required before create_article_draft). Returns topicKey. Duplicate topics return the existing one.",
    inputSchema: {
      primaryKeyword: z.string().min(2),
      intent: z.enum(["review", "compare", "alternatives", "guide"]),
      productType: z.enum(["ai", "saas"]),
      brand: z.string().default(""),
      secondaryQueries: z.array(z.string()).default([]),
      priority: z.number().int().min(1).max(5).default(3),
      sourceUrls: z.array(z.string().url()).default([]),
      sourceCheckedAt: dateStr.optional(),
    },
  },
  tool(async (args) => {
    const r = await api("/api/automation/topics", { method: "POST", body: args });
    return { duplicate: r.duplicate, topicKey: r.topic?.topicKey, status: r.topic?.status, id: r.topic?._id };
  }),
);

server.registerTool(
  "upload_image",
  {
    title: "Upload image",
    description:
      "Upload an article image. Give either svg (SVG markup you wrote) or filePath (local .png/.jpg/.webp/.svg). " +
      "Set convertToJpg=true for the cover (renders SVG to a 1600px-wide JPG, needed for social sharing). Returns the URL to use in the article.",
    inputSchema: {
      filename: z.string().min(3).describe("e.g. notion-ai-review-cover"),
      alt: z.string().min(10).max(200).describe("Descriptive alt text"),
      svg: z.string().optional(),
      filePath: z.string().optional(),
      convertToJpg: z.boolean().default(false),
    },
  },
  tool(async ({ filename, alt, svg, filePath, convertToJpg }) => {
    if (!svg && !filePath) throw new Error("Provide svg or filePath.");
    let data;
    let type;
    if (svg) {
      data = Buffer.from(svg, "utf8");
      type = "image/svg+xml";
    } else {
      data = await readFile(filePath);
      type = { ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".webp": "image/webp", ".svg": "image/svg+xml" }[extname(filePath).toLowerCase()];
      if (!type) throw new Error("Only .png, .jpg, .webp or .svg files are supported.");
    }
    if (convertToJpg && type !== "image/jpeg") {
      const sharp = (await import("sharp")).default;
      data = await sharp(data, { density: 144 }).resize({ width: 1600, withoutEnlargement: false }).flatten({ background: "#121420" }).jpeg({ quality: 84, mozjpeg: true }).toBuffer();
      type = "image/jpeg";
    }
    const r = await api("/api/automation/images", {
      method: "POST",
      body: { filename: filename || basename(filePath ?? "image"), contentType: type, dataBase64: data.toString("base64"), alt },
    });
    return { ...r, use: `Cover: coverImageUrl="${r.url}". Inline: <figure><img src="${r.url}" alt="${alt}"><figcaption>…</figcaption></figure>` };
  }),
);

server.registerTool(
  "check_article",
  {
    title: "Check article",
    description: "Check an article before saving: word count (max 1,500), internal links exist, meta lengths, H1, FAQ, image alt text. Fix every issue it returns.",
    inputSchema: {
      title: z.string().default(""),
      body: z.string(),
      metaTitle: z.string().default(""),
      metaDescription: z.string().default(""),
      disclosure: z.string().default(""),
      sources: z.array(source).default([]),
      faq: z.array(faqItem).default([]),
    },
  },
  tool(async (args) => api("/api/automation/articles/check", { method: "POST", body: args })),
);

server.registerTool(
  "create_article_draft",
  {
    title: "Create article draft",
    description: "Save the finished article as a DRAFT (never published). Runs check_article first and refuses if anything fails. Needs a topicKey from create_topic.",
    inputSchema: { topicKey: z.string().min(3), ...articleShape },
  },
  tool(async ({ topicKey, productIds, ...a }) => {
    const check = await api("/api/automation/articles/check", { method: "POST", body: a });
    if (!check.ok) return { saved: false, message: "Fix these issues, then call create_article_draft again.", ...check };
    const r = await api("/api/automation/articles/draft", {
      method: "POST",
      body: { ...a, topicKey, products: productIds, reviewMethod: "research_based", claimsNeedingReview: a.claimsNeedingReview },
    });
    return {
      saved: !r.duplicate,
      duplicate: r.duplicate,
      id: r.id,
      status: r.status,
      futureUrl: `${SITE}${r.url}`,
      reviewIn: `${SITE}/admin/articles/`,
      wordCount: check.wordCount,
      next: "Ask the user to open the admin panel, add the reviewer name, review and publish.",
    };
  }),
);

server.registerTool(
  "suggest_links",
  {
    title: "Suggest internal links",
    description: "Store internal/external link suggestions for an article draft; the editor approves them in admin.",
    inputSchema: {
      articleId: z.string(),
      items: z.array(z.object({ targetUrl: z.string(), anchorText: z.string(), reason: z.string().default(""), linkType: z.enum(["internal", "external", "affiliate"]) })).min(1).max(50),
    },
  },
  tool(async ({ articleId, items }) => api(`/api/automation/articles/${articleId}/links`, { method: "POST", body: { items } })),
);

await server.connect(new StdioServerTransport());
