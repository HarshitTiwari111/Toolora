export function slugify(input: string) {
  return input
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 120);
}

// Idempotency key (PDF section 6): same topic do baar na bane.
export function normalizeKeyword(input: string) {
  return input.toLowerCase().replace(/\s+/g, " ").trim();
}

export function makeTopicKey(productType: string, intent: string, keyword: string) {
  return `${productType}:${intent}:${slugify(normalizeKeyword(keyword))}`;
}
