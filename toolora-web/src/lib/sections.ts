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
  reviews: { label: "Reviews", pageType: "AI tool review", area: "AI", productType: "ai", articleType: "review", description: "Research-based reviews of AI tools, with sourced facts and clear limits." },
  compare: { label: "Compare", pageType: "AI tool comparison", area: "AI", productType: "ai", articleType: "compare", description: "Head-to-head comparisons of AI tools using dated, sourced facts." },
  alternatives: { label: "Alternatives", pageType: "AI tool alternatives", area: "AI", productType: "ai", articleType: "alternatives", description: "Alternatives to popular AI tools, chosen by clear selection criteria." },
  guides: { label: "Guides", pageType: "AI guide", area: "AI", productType: "ai", articleType: "guide", description: "Practical guides to choosing and using AI tools." },
  "saas-reviews": { label: "SaaS Reviews", pageType: "SaaS review", area: "SaaS", productType: "saas", articleType: "review", description: "Reviews of business software, with method, use cases and limitations." },
  "saas-compare": { label: "SaaS Compare", pageType: "SaaS comparison", area: "SaaS", productType: "saas", articleType: "compare", description: "SaaS comparisons with dated facts and clear criteria." },
  "saas-alternatives": { label: "SaaS Alternatives", pageType: "SaaS alternatives", area: "SaaS", productType: "saas", articleType: "alternatives", description: "SaaS alternatives organised by what readers actually need." },
  "saas-guides": { label: "SaaS Guides", pageType: "SaaS buyer guide", area: "SaaS", productType: "saas", articleType: "guide", description: "Buyer guides and explainers for business software." },
};
