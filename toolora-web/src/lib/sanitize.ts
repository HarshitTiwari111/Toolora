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
