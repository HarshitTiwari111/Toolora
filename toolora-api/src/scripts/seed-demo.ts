// Local testing ke liye DEMO data. Saare brands fictional hain (example.com URLs),
// taaki koi real pricing/feature claim galti se publish na ho.
//
//   npm run seed:demo           -> demo data daalo (pehle purana demo hata deta hai)
//   npm run seed:demo -- --clear -> sirf demo data hatao
import mongoose from "mongoose";
import { connectDb } from "../db.js";
import { makeTopicKey } from "../lib/text.js";
import { Article } from "../models/Article.js";
import { Product } from "../models/Product.js";
import { SourceFact } from "../models/SourceFact.js";
import { Topic } from "../models/Topic.js";
import { LinkSuggestion, WorkflowLog } from "../models/misc.js";

const PREFIX = "demo-";
const daysAgo = (n: number) => new Date(Date.now() - n * 864e5);

async function clearDemo() {
  const products = await Product.find({ slug: { $regex: `^${PREFIX}` } }).select("_id");
  const articles = await Article.find({ slug: { $regex: `^${PREFIX}` } }).select("_id");
  await SourceFact.deleteMany({ product: { $in: products.map((p) => p._id) } });
  await LinkSuggestion.deleteMany({ sourceArticle: { $in: articles.map((a) => a._id) } });
  await Article.deleteMany({ _id: { $in: articles.map((a) => a._id) } });
  await Product.deleteMany({ _id: { $in: products.map((p) => p._id) } });
  await Topic.deleteMany({ brand: { $regex: "^Demo" } });
  await WorkflowLog.deleteMany({ runId: { $regex: `^${PREFIX}` } });
  console.log(`[demo] Removed ${products.length} products, ${articles.length} articles and related demo data`);
}

async function seed() {
  // ---------- Products ----------
  const [write, voice, meet, crm] = await Product.create([
    {
      brandName: "DemoWrite AI",
      slug: "demo-demowrite-ai",
      productType: "ai",
      categories: ["writing", "marketing"],
      shortDescription: "DEMO: fictional AI writing assistant for blog posts and ad copy.",
      officialUrl: "https://example.com/demowrite",
      affiliateUrl: "https://example.com/demowrite?ref=toolora",
      pricingModel: "freemium",
      platforms: ["web", "chrome-extension"],
      useCases: ["blog drafts", "ad copy", "email subject lines"],
      lastVerifiedAt: daysAgo(3),
      status: "active",
    },
    {
      brandName: "DemoVoice Studio",
      slug: "demo-demovoice-studio",
      productType: "ai",
      categories: ["audio"],
      shortDescription: "DEMO: fictional AI voice generator.",
      officialUrl: "https://example.com/demovoice",
      pricingModel: "paid",
      platforms: ["web", "api"],
      useCases: ["voiceovers", "podcast intros"],
      lastVerifiedAt: daysAgo(40),
      status: "active",
    },
    {
      brandName: "DemoMeet Notes",
      slug: "demo-demomeet-notes",
      productType: "ai",
      categories: ["productivity"],
      shortDescription: "DEMO: fictional AI meeting notes tool (still being researched).",
      officialUrl: "https://example.com/demomeet",
      pricingModel: "unknown",
      status: "draft",
    },
    {
      brandName: "DemoCRM Cloud",
      slug: "demo-democrm-cloud",
      productType: "saas",
      categories: ["crm"],
      shortDescription: "DEMO: fictional CRM with AI lead scoring.",
      officialUrl: "https://example.com/democrm",
      pricingModel: "paid",
      platforms: ["web", "ios", "android"],
      useCases: ["sales pipeline", "lead scoring"],
      lastVerifiedAt: daysAgo(10),
      status: "active",
    },
  ]);

  // ---------- Source facts ----------
  await SourceFact.create([
    { product: write._id, fieldName: "free_plan", factValue: "DEMO: Free plan with limited monthly words", sourceUrl: "https://example.com/demowrite/pricing", sourceType: "official", checkedAt: daysAgo(3) },
    { product: write._id, fieldName: "pricing_pro_plan", factValue: "DEMO: Pro plan $19/month (billed monthly)", sourceUrl: "https://example.com/demowrite/pricing", sourceType: "official", checkedAt: daysAgo(3), evidenceNote: "Pricing table, Pro column" },
    { product: write._id, fieldName: "languages", factValue: "DEMO: 25+ languages", sourceUrl: "https://example.com/demowrite/docs/languages", sourceType: "official", checkedAt: daysAgo(3) },
    { product: voice._id, fieldName: "pricing_starter_plan", factValue: "DEMO: Starter plan $29/month", sourceUrl: "https://example.com/demovoice/pricing", sourceType: "official", checkedAt: daysAgo(40) },
    { product: crm._id, fieldName: "ai_feature", factValue: "DEMO: AI lead scoring on Business plan", sourceUrl: "https://example.com/democrm/features", sourceType: "official", checkedAt: daysAgo(10) },
  ]);

  // ---------- Topics (queue) ----------
  const topicRows = [
    { primaryKeyword: "demowrite ai review", intent: "review", productType: "ai", brand: "DemoWrite AI", priority: 5, status: "published", volume: 1300 },
    { primaryKeyword: "demowrite ai vs demovoice studio", intent: "compare", productType: "ai", brand: "DemoWrite AI", priority: 4, status: "approved", volume: 210 },
    { primaryKeyword: "demovoice studio alternatives", intent: "alternatives", productType: "ai", brand: "DemoVoice Studio", priority: 3, status: "qa", volume: 480 },
    { primaryKeyword: "democrm cloud review", intent: "review", productType: "saas", brand: "DemoCRM Cloud", priority: 3, status: "draft", volume: 320 },
    { primaryKeyword: "demomeet notes review", intent: "review", productType: "ai", brand: "DemoMeet Notes", priority: 4, status: "new", volume: null },
    { primaryKeyword: "best ai writing tools for demo bloggers", intent: "guide", productType: "ai", brand: "Demo guide", priority: 2, status: "new", volume: 90 },
  ] as const;
  await Topic.create(topicRows.map((t) => ({ ...t, sourceUrls: ["https://example.com"] })));
  const key = (i: number) => makeTopicKey(topicRows[i].productType, topicRows[i].intent, topicRows[i].primaryKeyword);

  const disclosure =
    "Toolora.ai may earn a commission if you buy through links on this page. This does not change our editorial assessment.";
  const body = (name: string) => `
<h2>Summary</h2>
<p>DEMO content. ${name} is a fictional tool used to test the Toolora.ai workflow.</p>
<h2>What it does</h2>
<p>Describe the main jobs the tool helps with, based only on official sources.</p>
<h2>Pricing</h2>
<p>See the source facts on the product page (checked dates shown there).</p>
<h2>Pros and limitations</h2>
<ul><li>Pro: example strength from source</li><li>Limitation: example limit from source</li></ul>
<h2>Methodology</h2>
<p>Research-based overview from the vendor's official pages. Not hands-on tested.</p>`;

  // ---------- Articles (har status ka ek) ----------
  const [published, approved, inReview, autoDraft] = await Article.create([
    {
      title: "DemoWrite AI Review: Features, Pricing and Who It's For",
      slug: "demo-demowrite-ai-review",
      articleType: "review",
      productType: "ai",
      products: [write._id],
      audience: "Bloggers and small marketing teams",
      body: body("DemoWrite AI"),
      excerpt: "DEMO: research-based overview of a fictional AI writing tool.",
      metaTitle: "DemoWrite AI Review (Demo) — Features & Pricing",
      metaDescription: "DEMO page: research-based overview of DemoWrite AI with sourced pricing and features.",
      author: "Demo Author",
      reviewer: "Demo Editor",
      reviewMethod: "research_based",
      disclosure,
      sources: [{ url: "https://example.com/demowrite/pricing", title: "DemoWrite pricing", checkedAt: daysAgo(3) }],
      status: "published",
      createdBy: "automation",
      topicKey: key(0),
      publishedAt: daysAgo(2),
      updateHistory: [
        { date: daysAgo(5), note: "Draft created by automation", by: "automation" },
        { date: daysAgo(4), note: "Status → in_review", by: "demo" },
        { date: daysAgo(3), note: "Status → approved", by: "demo" },
        { date: daysAgo(2), note: "Status → published", by: "demo" },
      ],
    },
    {
      title: "DemoWrite AI vs DemoVoice Studio",
      slug: "demo-demowrite-ai-vs-demovoice-studio",
      articleType: "compare",
      productType: "ai",
      products: [write._id, voice._id],
      body: body("DemoWrite AI vs DemoVoice Studio"),
      excerpt: "DEMO comparison article.",
      metaTitle: "DemoWrite AI vs DemoVoice Studio (Demo)",
      metaDescription: "DEMO comparison with dated, sourced facts.",
      author: "Demo Author",
      reviewer: "Demo Editor",
      disclosure,
      sources: [
        { url: "https://example.com/demowrite/pricing", title: "DemoWrite pricing", checkedAt: daysAgo(3) },
        { url: "https://example.com/demovoice/pricing", title: "DemoVoice pricing", checkedAt: daysAgo(3) },
      ],
      status: "approved",
      createdBy: "automation",
      topicKey: key(1),
      updateHistory: [{ date: daysAgo(1), note: "Status → approved", by: "demo" }],
    },
    {
      title: "Best DemoVoice Studio Alternatives",
      slug: "demo-demovoice-studio-alternatives",
      articleType: "alternatives",
      productType: "ai",
      products: [voice._id],
      body: body("DemoVoice Studio alternatives"),
      excerpt: "DEMO alternatives page waiting for editor review.",
      metaTitle: "DemoVoice Studio Alternatives (Demo)",
      metaDescription: "DEMO alternatives page.",
      author: "Demo Author",
      disclosure,
      sources: [{ url: "https://example.com/demovoice", title: "DemoVoice home", checkedAt: daysAgo(40) }],
      // Ye issues publish rokenge — editor ko fix karne honge.
      qaFlags: ["Pricing checked 40 days ago — re-verify before publishing"],
      claimsNeedingReview: ["\"Supports 100 voices\" — no source found"],
      status: "in_review",
      createdBy: "automation",
      topicKey: key(2),
      updateHistory: [{ date: daysAgo(1), note: "Status → in_review", by: "demo" }],
    },
    {
      title: "DemoCRM Cloud Review",
      slug: "demo-democrm-cloud-review",
      articleType: "review",
      productType: "saas",
      products: [crm._id],
      body: body("DemoCRM Cloud"),
      excerpt: "DEMO draft created by automation.",
      author: "n8n (demo)",
      disclosure,
      sources: [],
      qaFlags: ["Missing sources for pricing section"],
      status: "draft",
      createdBy: "automation",
      topicKey: key(3),
      updateHistory: [{ date: new Date(), note: "Draft created by automation", by: "automation" }],
    },
  ]);

  await Topic.updateOne({ topicKey: key(0) }, { article: published._id });
  await Topic.updateOne({ topicKey: key(1) }, { article: approved._id });
  await Topic.updateOne({ topicKey: key(2) }, { article: inReview._id });
  await Topic.updateOne({ topicKey: key(3) }, { article: autoDraft._id });

  // ---------- Link suggestions ----------
  await LinkSuggestion.create([
    { sourceArticle: autoDraft._id, targetUrl: "/saas/crm/", anchorText: "CRM software", reason: "Category hub link", linkType: "internal" },
    { sourceArticle: autoDraft._id, targetUrl: "https://example.com/democrm/pricing", anchorText: "DemoCRM pricing page", reason: "Primary source", linkType: "external", approved: true },
    { sourceArticle: inReview._id, targetUrl: "/ai-tools/demo-demovoice-studio/", anchorText: "DemoVoice Studio profile", reason: "Product profile", linkType: "internal" },
  ]);

  // ---------- Workflow logs (n8n jaisa) ----------
  const run1 = `${PREFIX}run-001`;
  const run2 = `${PREFIX}run-002`;
  await WorkflowLog.create([
    { runId: run1, node: "Schedule Trigger", status: "success", topicKey: key(3) },
    { runId: run1, node: "Fetch first-party sources", status: "success", topicKey: key(3), tokenCostEstimate: 0 },
    { runId: run1, node: "Generate article draft", status: "success", topicKey: key(3), tokenCostEstimate: 0.04 },
    { runId: run1, node: "Create draft", status: "success", topicKey: key(3) },
    { runId: run2, node: "Fetch first-party sources", status: "retry", retries: 1, topicKey: key(4), errorSummary: "Timeout fetching pricing page" },
    { runId: run2, node: "Fetch first-party sources", status: "error", retries: 2, topicKey: key(4), errorSummary: "Pricing page blocked (403) — moved to manual research" },
  ]);

  console.log("[demo] Seeded: 4 products, 5 facts, 6 topics, 4 articles, 3 link suggestions, 6 workflow logs");
}

async function main() {
  await connectDb();
  await clearDemo();
  if (!process.argv.includes("--clear")) await seed();
  await mongoose.disconnect();
}

main().catch(async (err) => {
  console.error("[demo] Failed:", err);
  await mongoose.disconnect();
  process.exit(1);
});
