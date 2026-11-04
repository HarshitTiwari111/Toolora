// Shared enums. Category slugs frontend (toolora-web/src/lib/site.ts) ke saath match hone chahiye.

export const PRODUCT_TYPES = ["ai", "saas"] as const;

export const AI_CATEGORIES = [
  "writing", "coding", "image-generation", "video", "audio",
  "research", "productivity", "marketing", "chatbots", "automation",
] as const;

export const SAAS_CATEGORIES = [
  "project-management", "crm", "email-marketing", "analytics",
  "customer-support", "finance", "security", "design",
] as const;

export const PRICING_MODELS = ["free", "freemium", "paid", "unknown"] as const;
export const PRODUCT_STATUSES = ["draft", "active", "archived"] as const;

export const SOURCE_TYPES = ["official", "first-party", "other"] as const;

export const ARTICLE_TYPES = ["review", "compare", "alternatives", "guide"] as const;
// PDF review integrity rule: bina test kiye "hands-on" nahi likh sakte.
export const REVIEW_METHODS = ["research_based", "hands_on"] as const;
export const ARTICLE_STATUSES = ["draft", "in_review", "approved", "published", "archived"] as const;

// PDF section 5, step 7 ka status flow.
export const TOPIC_STATUSES = [
  "new", "research", "brief_ready", "draft", "qa", "approved", "published", "refresh_due",
] as const;
export const TOPIC_INTENTS = ["review", "compare", "alternatives", "guide"] as const;

export const LINK_TYPES = ["internal", "external", "affiliate"] as const;
export const LOG_STATUSES = ["success", "error", "skipped", "retry"] as const;
export const ADMIN_ROLES = ["admin", "editor"] as const;
