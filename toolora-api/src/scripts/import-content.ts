// Real content import (products + source facts + topics + articles) from a JSON file.
// Same zod validation as the admin API. Articles land as "in_review" by default;
// they go live only with --publish and a human reviewer name (PDF: human approval).
//
//   npx tsx src/scripts/import-content.ts <file.json>
//   npx tsx src/scripts/import-content.ts <file.json> --publish --reviewer "Name"
//   (live DB: set DOTENV_CONFIG_PATH=.env.production)
import dns from "node:dns";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import mongoose from "mongoose";
import { z } from "zod";
import { connectDb } from "../db.js";
import { articlePath, publishGateFailures } from "../lib/content.js";
import { articleSchema, productSchema, sourceFactSchema, topicSchema } from "../lib/schemas.js";
import { makeTopicKey } from "../lib/text.js";
import { Article } from "../models/Article.js";
import { Product } from "../models/Product.js";
import { SourceFact } from "../models/SourceFact.js";
import { Topic } from "../models/Topic.js";

// Kuch networks Atlas SRV lookup fail karte hain.
if (process.env.MONGODB_URI?.startsWith("mongodb+srv://")) dns.setServers(["8.8.8.8", "1.1.1.1"]);

const args = process.argv.slice(2);
const file = args.find((a) => !a.startsWith("--"));
const publish = args.includes("--publish");
const reviewerIdx = args.indexOf("--reviewer");
const reviewer = reviewerIdx >= 0 ? (args[reviewerIdx + 1] ?? "").trim() : "";
if (!file) throw new Error("Usage: import-content.ts <file.json> [--publish --reviewer \"Name\"]");
if (publish && !reviewer) throw new Error("--publish needs --reviewer \"Human editor name\"");

const fileSchema = z.object({
  checkedAt: z.string(),
  products: z.array(z.looseObject({ slug: z.string(), facts: z.array(z.unknown()).default([]) })),
  topics: z.array(z.unknown()).default([]),
  articles: z.array(z.looseObject({ topicKeyword: z.string(), productSlugs: z.array(z.string()) })),
});

async function run() {
  const data = fileSchema.parse(JSON.parse(readFileSync(file!, "utf8")));
  await connectDb();

  const productIds = new Map<string, string>();
  for (const raw of data.products) {
    const { facts, ...rest } = raw;
    const p = productSchema.parse(rest);
    const doc = await Product.findOneAndUpdate({ slug: p.slug }, p, { upsert: true, returnDocument: "after", runValidators: true });
    productIds.set(doc.slug, String(doc._id));
    for (const f of facts) {
      const fact = sourceFactSchema.parse({ checkedAt: data.checkedAt, ...(f as object) });
      await SourceFact.deleteMany({ product: doc._id, fieldName: fact.fieldName });
      await SourceFact.create({ ...fact, product: doc._id });
    }
    console.log(`[product] ${doc.brandName} (${facts.length} facts)`);
  }

  for (const raw of data.topics) {
    const t = topicSchema.parse(raw);
    const topicKey = makeTopicKey(t.productType, t.intent, t.primaryKeyword);
    await Topic.findOneAndUpdate({ topicKey }, { ...t, topicKey }, { upsert: true, returnDocument: "after", setDefaultsOnInsert: true });
  }

  for (const raw of data.articles) {
    const { topicKeyword, productSlugs, bodyFile, ...rest } = raw as typeof raw & { bodyFile?: string };
    // Body alag HTML file me ho sakti hai (editor ke liye aasan).
    if (bodyFile) (rest as Record<string, unknown>).body = readFileSync(resolve(dirname(file!), bodyFile), "utf8");
    const products = productSlugs.map((s) => {
      const id = productIds.get(s);
      if (!id) throw new Error(`Unknown product slug in article: ${s}`);
      return id;
    });
    const parsed = articleSchema.parse({ ...rest, products, reviewer: publish ? reviewer : (rest.reviewer ?? "") });
    if (!parsed.slug) throw new Error(`Article needs a slug: ${parsed.title}`);
    const a = { ...parsed, slug: parsed.slug };
    const topic = await Topic.findOne({ primaryKeyword: topicKeyword, productType: a.productType });
    const status = publish ? "published" : "in_review";

    if (publish) {
      const fails = publishGateFailures(a);
      if (fails.length) throw new Error(`${a.title}: not ready to publish -> ${fails.join("; ")}`);
    }

    const existing = await Article.findOne({ productType: a.productType, articleType: a.articleType, slug: a.slug });
    const note = publish ? `Published after review by ${reviewer}` : "Imported for editor review";
    const doc = await Article.findOneAndUpdate(
      { productType: a.productType, articleType: a.articleType, slug: a.slug },
      {
        ...a,
        status,
        topicKey: topic?.topicKey,
        createdBy: existing?.get("createdBy") ?? "admin",
        ...(publish ? { publishedAt: existing?.publishedAt ?? new Date() } : {}),
        $push: { updateHistory: { note, by: publish ? reviewer : "import" } },
      },
      { upsert: true, returnDocument: "after", runValidators: true },
    );
    if (topic) {
      topic.set({ article: doc._id, status: publish ? "published" : "qa" });
      await topic.save();
    }
    console.log(`[article] ${status.padEnd(9)} ${articlePath(doc)}`);
  }
}

run()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(() => mongoose.disconnect());
