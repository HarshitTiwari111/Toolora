import { aiCategories, saasCategories } from "./site";

export const pricingLabels: Record<string, string> = {
  free: "Free",
  freemium: "Freemium",
  paid: "Paid",
  unknown: "Pricing: verify",
};

export const platformLabels: Record<string, string> = {
  web: "Web",
  windows: "Windows",
  mac: "Mac",
  ios: "iOS",
  android: "Android",
  api: "API",
  "chrome-extension": "Chrome extension",
};

export const articleTypeLabels: Record<string, string> = {
  review: "Review",
  compare: "Comparison",
  alternatives: "Alternatives",
  guide: "Guide",
};

export function categoryName(type: "ai" | "saas", slug: string) {
  const list = type === "ai" ? aiCategories : saasCategories;
  return list.find((c) => c.slug === slug)?.name ?? slug;
}

export function areaBase(type: "ai" | "saas") {
  return type === "ai" ? "/ai-tools" : "/saas";
}

// "pricing_pro_plan" -> "Pricing pro plan"
export function factLabel(field: string) {
  const s = field.replace(/[_-]+/g, " ").trim();
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export function fmtDate(d: string | null | undefined) {
  return d ? new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : null;
}

export function platformName(p: string) {
  return platformLabels[p] ?? p;
}
