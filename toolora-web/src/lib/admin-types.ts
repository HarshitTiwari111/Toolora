// Shapes jo toolora-api admin endpoints return karte hain.

export type Paged<T> = { items: T[]; total: number; page: number; limit: number };

export type Product = {
  _id: string;
  brandName: string;
  slug: string;
  productType: "ai" | "saas";
  categories: string[];
  shortDescription: string;
  officialUrl: string;
  affiliateUrl: string;
  logoRightsNote: string;
  pricingModel: "free" | "freemium" | "paid" | "unknown";
  platforms: string[];
  useCases: string[];
  lastVerifiedAt: string | null;
  status: "draft" | "active" | "archived";
  updatedAt: string;
  url: string;
};

export type SourceFact = {
  _id: string;
  fieldName: string;
  factValue: string;
  sourceUrl: string;
  sourceType: string;
  checkedAt: string;
  evidenceNote: string;
};

export type ArticleStatus = "draft" | "in_review" | "approved" | "published" | "archived";

export type Article = {
  _id: string;
  title: string;
  slug: string;
  articleType: "review" | "compare" | "alternatives" | "guide";
  productType: "ai" | "saas";
  products: { _id: string; brandName: string; slug: string }[] | string[];
  audience: string;
  body: string;
  excerpt: string;
  metaTitle: string;
  metaDescription: string;
  author: string;
  reviewer: string;
  reviewMethod: "research_based" | "hands_on";
  disclosure: string;
  sources: { url: string; title: string; checkedAt: string | null }[];
  qaFlags: string[];
  claimsNeedingReview: string[];
  status: ArticleStatus;
  createdBy: "admin" | "automation";
  publishedAt: string | null;
  updatedAt: string;
  updateHistory: { date: string; note: string; by: string }[];
  url: string;
};

export type LinkSuggestion = {
  _id: string;
  targetUrl: string;
  anchorText: string;
  reason: string;
  linkType: string;
  approved: boolean;
};

export type Topic = {
  _id: string;
  primaryKeyword: string;
  intent: string;
  productType: string;
  brand: string;
  priority: number;
  status: string;
  volume: number | null;
  assignedEditor: string;
  topicKey: string;
  clusterId: string;
  provider: string;
  difficulty: number | null;
  sourceCheckedAt: string | null;
  createdAt: string;
};

export type WorkflowLog = {
  _id: string;
  runId: string;
  node: string;
  status: string;
  retries: number;
  errorSummary: string;
  topicKey: string;
  createdAt: string;
};

export const ARTICLE_STATUSES: ArticleStatus[] = ["draft", "in_review", "approved", "published", "archived"];
export const TOPIC_STATUSES = ["new", "research", "brief_ready", "draft", "qa", "approved", "published", "refresh_due"];
