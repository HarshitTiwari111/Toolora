// Content sections (PDF section 3). Har section ka index + [slug] route hai.

export type SectionKey =
  | "reviews"
  | "compare"
  | "alternatives"
  | "guides"
  | "saas-reviews"
  | "saas-compare"
  | "saas-alternatives"
  | "saas-guides";

type Section = {
  label: string;
  pageType: string;
  area: "AI" | "SaaS";
  productType: "ai" | "saas";
  articleType: "review" | "compare" | "alternatives" | "guide";
  description: string;
};

export const sections: Record<SectionKey, Section> = {
  reviews: { label: "Reviews", pageType: "AI tool review", area: "AI", productType: "ai", articleType: "review", description: "What popular AI tools do, what they cost and where they fall short." },
  compare: { label: "Compare", pageType: "AI tool comparison", area: "AI", productType: "ai", articleType: "compare", description: "Two or more AI tools side by side, so you can see which suits your work." },
  alternatives: { label: "Alternatives", pageType: "AI tool alternatives", area: "AI", productType: "ai", articleType: "alternatives", description: "Other options when a well-known AI tool is too pricey or missing a feature." },
  guides: { label: "Guides", pageType: "AI guide", area: "AI", productType: "ai", articleType: "guide", description: "Practical guides to choosing and using AI tools." },
  "saas-reviews": { label: "SaaS Reviews", pageType: "SaaS review", area: "SaaS", productType: "saas", articleType: "review", description: "Business software reviewed: features, plans and who each tool is for." },
  "saas-compare": { label: "SaaS Compare", pageType: "SaaS comparison", area: "SaaS", productType: "saas", articleType: "compare", description: "Business tools compared on price, features and team size." },
  "saas-alternatives": { label: "SaaS Alternatives", pageType: "SaaS alternatives", area: "SaaS", productType: "saas", articleType: "alternatives", description: "Swaps for popular business software, grouped by what you need instead." },
  "saas-guides": { label: "SaaS Guides", pageType: "SaaS buyer guide", area: "SaaS", productType: "saas", articleType: "guide", description: "Buyer guides and explainers for business software." },
};
