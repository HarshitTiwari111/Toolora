// Public URL helpers (PDF section 3) aur publish gates (PDF section 7).

type ArticleLike = {
  productType?: string | null;
  articleType: string;
  slug: string;
  body?: string | null;
  metaTitle?: string | null;
  metaDescription?: string | null;
  disclosure?: string | null;
  reviewer?: string | null;
  sources?: unknown[] | null;
  qaFlags?: string[] | null;
  claimsNeedingReview?: string[] | null;
};

const sectionFor: Record<string, { ai: string; saas: string }> = {
  review: { ai: "reviews", saas: "saas-reviews" },
  compare: { ai: "compare", saas: "saas-compare" },
  alternatives: { ai: "alternatives", saas: "saas-alternatives" },
  guide: { ai: "guides", saas: "saas-guides" },
};

export function articlePath(a: Pick<ArticleLike, "productType" | "articleType" | "slug">) {
  const type = a.productType === "saas" ? "saas" : "ai";
  return `/${sectionFor[a.articleType]?.[type] ?? "guides"}/${a.slug}/`;
}

export function productPath(p: { productType: string; slug: string }) {
  return `${p.productType === "saas" ? "/saas" : "/ai-tools"}/${p.slug}/`;
}

// Publish se pehle ye sab pass hona chahiye. Fail hone par list return hoti hai.
export function publishGateFailures(a: ArticleLike): string[] {
  const fails: string[] = [];
  if (!a.body?.trim()) fails.push("Body is empty");
  if (!a.metaTitle?.trim()) fails.push("Meta title missing");
  if (!a.metaDescription?.trim()) fails.push("Meta description missing");
  if (!a.sources?.length) fails.push("At least one source URL required");
  if (!a.disclosure?.trim()) fails.push("Disclosure missing");
  if (!a.reviewer?.trim()) fails.push("Reviewer (human editor) missing");
  if (a.qaFlags?.length) fails.push(`Open QA flags: ${a.qaFlags.length}`);
  if (a.claimsNeedingReview?.length) fails.push(`Claims needing review: ${a.claimsNeedingReview.length}`);
  return fails;
}
