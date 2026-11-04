// Site-wide config. Categories PDF ke section 3 (sitemap) se liye gaye hain.

export const siteConfig = {
  name: "Toolora.ai",
  description:
    "Discover, compare and understand AI tools and SaaS products with sourced, dated facts.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  // Jab tak "true" na ho, poori site noindex rahegi (staging safety).
  indexable: process.env.NEXT_PUBLIC_SITE_INDEXABLE === "true",
};

export type Category = { slug: string; name: string; description: string };

export const aiCategories: Category[] = [
  { slug: "writing", name: "AI Writing", description: "AI writing tools" },
  { slug: "coding", name: "AI Coding", description: "AI coding assistants" },
  { slug: "image-generation", name: "AI Image Generation", description: "AI image generation tools" },
  { slug: "video", name: "AI Video", description: "AI video tools" },
  { slug: "audio", name: "AI Audio", description: "AI voice, music and transcription tools" },
  { slug: "research", name: "AI Research", description: "AI search and research assistants" },
  { slug: "productivity", name: "AI Productivity", description: "AI productivity and meeting tools" },
  { slug: "marketing", name: "AI Marketing", description: "AI marketing and sales tools" },
  { slug: "chatbots", name: "AI Chatbots", description: "Chatbots and customer support tools" },
  { slug: "automation", name: "AI Automation", description: "AI agents and workflow automation tools" },
];

export const saasCategories: Category[] = [
  { slug: "project-management", name: "Project Management", description: "Project management software" },
  { slug: "crm", name: "CRM", description: "CRM software" },
  { slug: "email-marketing", name: "Email Marketing", description: "Email marketing platforms" },
  { slug: "analytics", name: "Analytics", description: "Analytics and reporting tools" },
  { slug: "customer-support", name: "Customer Support", description: "Help desk and customer support tools" },
  { slug: "finance", name: "Finance", description: "Accounting, invoicing and finance tools" },
  { slug: "security", name: "Security", description: "Security and identity tools" },
  { slug: "design", name: "Design", description: "Design and collaboration tools" },
];

export const trustPages = [
  { slug: "about", title: "About Toolora.ai" },
  { slug: "editorial-policy", title: "Editorial Policy" },
  { slug: "how-we-review", title: "How We Review" },
  { slug: "contact", title: "Contact" },
  { slug: "privacy-policy", title: "Privacy Policy" },
  { slug: "terms", title: "Terms of Use" },
  { slug: "affiliate-disclosure", title: "Affiliate Disclosure" },
  { slug: "corrections", title: "Corrections" },
] as const;

export type NavItem = { href: string; label: string; menu?: { href: string; label: string }[] };

export const mainNav: NavItem[] = [
  {
    href: "/ai-tools/",
    label: "AI Tools",
    menu: [{ href: "/ai-tools/", label: "All AI tools" }, ...aiCategories.map((c) => ({ href: `/ai-tools/${c.slug}/`, label: c.name }))],
  },
  {
    href: "/saas/",
    label: "SaaS",
    menu: [{ href: "/saas/", label: "All SaaS" }, ...saasCategories.map((c) => ({ href: `/saas/${c.slug}/`, label: c.name }))],
  },
  { href: "/reviews/", label: "Reviews" },
  { href: "/compare/", label: "Compare" },
  { href: "/alternatives/", label: "Alternatives" },
  { href: "/guides/", label: "Guides" },
  { href: "/blog/", label: "Blog" },
];

export function humanize(slug: string) {
  return slug
    .split("-")
    .map((w) => (w === "vs" ? "vs" : w.charAt(0).toUpperCase() + w.slice(1)))
    .join(" ");
}
