import "server-only";
import sanitizeHtml from "sanitize-html";

// Article body HTML (editor/AI se aata hai) ko render se pehle saaf karna.
// Scripts, iframes, inline event handlers, style — sab hata diye jaate hain.
export function cleanArticleHtml(html: string) {
  return sanitizeHtml(html, {
    allowedTags: [
      "h2", "h3", "h4", "p", "br", "hr", "ul", "ol", "li", "strong", "b", "em", "i", "u",
      "a", "blockquote", "code", "pre", "table", "thead", "tbody", "tr", "th", "td", "caption",
      "figure", "figcaption", "img", "span", "sup", "sub",
    ],
    allowedAttributes: {
      a: ["href", "title", "rel", "target"],
      img: ["src", "alt", "width", "height", "loading"],
      th: ["scope", "colspan", "rowspan"],
      td: ["colspan", "rowspan"],
    },
    allowedSchemes: ["http", "https", "mailto"],
    allowProtocolRelative: false,
    transformTags: {
      // Body me H1 nahi (page ka H1 title hai): h1 -> h2.
      h1: "h2",
      a: (tagName, attribs) => {
        const href = attribs.href ?? "";
        const external = /^https?:\/\//i.test(href);
        const relIn = (attribs.rel ?? "").split(/\s+/).filter(Boolean);
        // Editor ne sponsored/nofollow lagaya ho to rakho; external par noopener hamesha.
        const rel = new Set(relIn.filter((r) => ["sponsored", "nofollow", "ugc"].includes(r)));
        if (external) {
          rel.add("noopener");
          rel.add("noreferrer");
        }
        return {
          tagName,
          attribs: {
            href,
            ...(attribs.title ? { title: attribs.title } : {}),
            ...(rel.size ? { rel: [...rel].join(" ") } : {}),
            ...(external ? { target: "_blank" } : {}),
          },
        };
      },
      img: (tagName, attribs) => ({ tagName, attribs: { ...attribs, loading: "lazy", alt: attribs.alt ?? "" } }),
    },
  });
}

export type TocItem = { id: string; text: string };

// H2 headings ko id do (anchor links) aur "On this page" ki list banao.
export function withHeadingIds(html: string): { html: string; toc: TocItem[] } {
  const toc: TocItem[] = [];
  const used = new Set<string>();
  const out = html.replace(/<h2>([\s\S]*?)<\/h2>/g, (_m, inner: string) => {
    const text = inner.replace(/<[^>]+>/g, "").replace(/&amp;/g, "&").replace(/&#x27;|&#39;/g, "'").replace(/&quot;/g, '"').trim();
    let id = text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 60) || "section";
    let n = 2;
    const base = id;
    while (used.has(id)) id = `${base}-${n++}`;
    used.add(id);
    toc.push({ id, text });
    return `<h2 id="${id}">${inner}</h2>`;
  });
  return { html: out, toc };
}
