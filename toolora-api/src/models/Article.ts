import { Schema, model } from "mongoose";
import { ARTICLE_STATUSES, ARTICLE_TYPES, PRODUCT_TYPES, REVIEW_METHODS } from "../constants.js";

const sourceSchema = new Schema(
  { url: { type: String, required: true }, title: { type: String, default: "" }, checkedAt: { type: Date, default: null } },
  { _id: false },
);

const faqSchema = new Schema({ question: String, answer: String }, { _id: false });

const historySchema = new Schema(
  { date: { type: Date, default: Date.now }, note: String, by: String },
  { _id: false },
);

const articleSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, lowercase: true, trim: true },
    articleType: { type: String, enum: ARTICLE_TYPES, required: true },
    productType: { type: String, enum: PRODUCT_TYPES, default: "ai" },
    products: [{ type: Schema.Types.ObjectId, ref: "Product" }],
    audience: { type: String, default: "" },
    body: { type: String, default: "" },
    excerpt: { type: String, default: "" },
    metaTitle: { type: String, default: "" },
    metaDescription: { type: String, default: "" },
    author: { type: String, default: "" },
    reviewer: { type: String, default: "" },
    reviewMethod: { type: String, enum: REVIEW_METHODS, default: "research_based" },
    disclosure: { type: String, default: "" },
    sources: { type: [sourceSchema], default: [] },
    faq: { type: [faqSchema], default: [] },
    // QA (PDF section 7) ke flags. Editor clear kare tab publish.
    qaFlags: { type: [String], default: [] },
    claimsNeedingReview: { type: [String], default: [] },
    status: { type: String, enum: ARTICLE_STATUSES, default: "draft", index: true },
    createdBy: { type: String, enum: ["admin", "automation"], default: "admin" },
    // Automation idempotency: same topic se doosra draft nahi banega.
    topicKey: { type: String, default: undefined },
    publishedAt: { type: Date, default: null },
    updateHistory: { type: [historySchema], default: [] },
  },
  { timestamps: true },
);

// URL /reviews/{slug}/ vs /saas-reviews/{slug}/ — isliye uniqueness type ke andar.
articleSchema.index({ productType: 1, articleType: 1, slug: 1 }, { unique: true });
articleSchema.index({ topicKey: 1 }, { unique: true, partialFilterExpression: { topicKey: { $type: "string" } } });

export const Article = model("Article", articleSchema);
