import type { Metadata } from "next";
import { siteConfig } from "./site";

// On-page SEO helpers: canonical, Open Graph / Twitter, JSON-LD schema.
// PDF section 8: canonical har indexable page par; schema sirf jo page par sach me hai (fake ratings nahi).

export function absUrl(path = "/") {
  return new URL(path, siteConfig.url).toString();
}

export function pageMetadata({
  title,
  description,
  path,
  image,
  imageAlt,
  type = "website",
  publishedTime,
  modifiedTime,
  absoluteTitle = false,
  noindex = false,
}: {
  title: string;
  description?: string;
  path: string;
  image?: string;
  imageAlt?: string;
  type?: "website" | "article";
  publishedTime?: string | null;
  modifiedTime?: string | null;
  absoluteTitle?: boolean;
  noindex?: boolean;
}): Metadata {
  // Image na ho to default share image (app/opengraph-image.tsx).
  const images = image
    ? [{ url: image, alt: imageAlt ?? title }]
    : [{ url: "/opengraph-image/", width: 1200, height: 630, alt: `${siteConfig.name}: AI tool reviews, comparisons and guides` }];
  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type,
      url: path,
      siteName: siteConfig.name,
      title,
      description,
      locale: "en_US",
      images,
      ...(type === "article"
        ? { publishedTime: publishedTime ?? undefined, modifiedTime: modifiedTime ?? undefined }
        : {}),
    },
    twitter: { card: "summary_large_image", title, description, images: [images[0].url] },
    ...(noindex ? { robots: { index: false, follow: true } } : {}),
  };
}

type Json = Record<string, unknown>;

export function organizationJsonLd(): Json {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": absUrl("/#organization"),
    name: siteConfig.name,
    url: absUrl("/"),
    logo: absUrl("/icon.svg"),
  };
}

export function websiteJsonLd(): Json {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": absUrl("/#website"),
    name: siteConfig.name,
    url: absUrl("/"),
    publisher: { "@id": absUrl("/#organization") },
    potentialAction: {
      "@type": "SearchAction",
      target: { "@type": "EntryPoint", urlTemplate: `${absUrl("/search/")}?q={search_term_string}` },
      "query-input": "required name=search_term_string",
    },
  };
}

// FAQ section ka structured data (sirf wahi Q&A jo page par dikhte hain).
export function faqJsonLd(items: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]): Json {
  const all = [{ name: "Home", path: "/" }, ...items];
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: all.map((c, i) => ({ "@type": "ListItem", position: i + 1, name: c.name, item: absUrl(c.path) })),
  };
}

export function articleJsonLd(a: {
  title: string;
  description: string;
  path: string;
  image?: string;
  author?: string;
  reviewer?: string;
  publishedAt?: string | null;
  updatedAt?: string | null;
  articleType: string;
}): Json {
  return {
    "@context": "https://schema.org",
    "@type": a.articleType === "guide" ? "BlogPosting" : "Article",
    headline: a.title.slice(0, 110),
    description: a.description,
    mainEntityOfPage: absUrl(a.path),
    url: absUrl(a.path),
    ...(a.image ? { image: [absUrl(a.image)] } : {}),
    ...(a.publishedAt ? { datePublished: a.publishedAt } : {}),
    ...(a.updatedAt ? { dateModified: a.updatedAt } : {}),
    author: a.author ? { "@type": "Person", name: a.author } : { "@id": absUrl("/#organization") },
    ...(a.reviewer ? { editor: { "@type": "Person", name: a.reviewer } } : {}),
    publisher: { "@id": absUrl("/#organization") },
  };
}

// Product profile: SoftwareApplication. Rating/offer tabhi jab verified ho — abhi nahi daalte.
export function softwareJsonLd(p: {
  name: string;
  description: string;
  path: string;
  officialUrl: string;
  category: string;
  platforms: string[];
}): Json {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: p.name,
    description: p.description || undefined,
    url: absUrl(p.path),
    sameAs: p.officialUrl,
    applicationCategory: p.category,
    ...(p.platforms.length ? { operatingSystem: p.platforms.join(", ") } : {}),
  };
}

export function itemListJsonLd(name: string, items: { name: string; path: string }[]): Json {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name,
    itemListElement: items.slice(0, 50).map((it, i) => ({ "@type": "ListItem", position: i + 1, name: it.name, url: absUrl(it.path) })),
  };
}
