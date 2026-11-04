"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath, revalidateTag } from "next/cache";
import { CONTENT_TAG } from "@/lib/admin-constants";
import { ADMIN_COOKIE, adminApi, adminLogin, type AdminResult } from "@/lib/admin-api";

// ---------- helpers ----------

function str(fd: FormData, name: string) {
  return String(fd.get(name) ?? "").trim();
}

// "a, b" ya multi-line → ["a","b"]
function list(fd: FormData, name: string) {
  return str(fd, name)
    .split(/[\n,]/)
    .map((s) => s.trim())
    .filter(Boolean);
}

function lines(fd: FormData, name: string) {
  return str(fd, name)
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
}

function errorText(r: Extract<AdminResult<unknown>, { ok: false }>) {
  const d = r.details;
  if (Array.isArray(d) && d.length) {
    const parts = d.map((x) => (typeof x === "string" ? x : `${x.path ? `${x.path}: ` : ""}${x.message}`));
    return `${r.error} — ${parts.join("; ")}`;
  }
  return r.error;
}

// Website cache refresh (published content badla ho sakta hai).
function refresh() {
  revalidateTag(CONTENT_TAG);
}

function back(path: string, kind: "ok" | "error", msg: string): never {
  const sep = path.includes("?") ? "&" : "?";
  redirect(`${path}${sep}${kind}=${encodeURIComponent(msg)}`);
}

// ---------- auth ----------

export async function loginAction(fd: FormData) {
  const r = await adminLogin(str(fd, "email"), String(fd.get("password") ?? ""));
  if (!r.ok) back("/admin/login", "error", r.error);
  (await cookies()).set(ADMIN_COOKIE, r.token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/admin",
    maxAge: 12 * 60 * 60,
  });
  redirect("/admin");
}

export async function logoutAction() {
  (await cookies()).delete({ name: ADMIN_COOKIE, path: "/admin" });
  redirect("/admin/login");
}

// ---------- products ----------

export async function saveProductAction(fd: FormData) {
  const id = str(fd, "id");
  const body = {
    brandName: str(fd, "brandName"),
    slug: str(fd, "slug") || undefined,
    productType: str(fd, "productType"),
    categories: fd.getAll("categories").map(String),
    shortDescription: str(fd, "shortDescription"),
    officialUrl: str(fd, "officialUrl"),
    affiliateUrl: str(fd, "affiliateUrl"),
    logoRightsNote: str(fd, "logoRightsNote"),
    pricingModel: str(fd, "pricingModel"),
    platforms: list(fd, "platforms"),
    useCases: list(fd, "useCases"),
    lastVerifiedAt: str(fd, "lastVerifiedAt") || null,
    status: str(fd, "status"),
  };
  const r = await adminApi<{ _id: string }>(id ? `/products/${id}` : "/products", { method: id ? "PATCH" : "POST", body });
  const here = id ? `/admin/products/${id}` : "/admin/products/?new=1";
  if (!r.ok) back(here, "error", errorText(r));
  revalidatePath("/admin/products");
  refresh();
  back(`/admin/products/${r.data._id}`, "ok", id ? "Product saved" : "Product created");
}

export async function deleteProductAction(fd: FormData) {
  const r = await adminApi(`/products/${str(fd, "id")}`, { method: "DELETE" });
  if (!r.ok) back(`/admin/products/${str(fd, "id")}`, "error", errorText(r));
  refresh();
  back("/admin/products", "ok", "Product deleted");
}

export async function addFactAction(fd: FormData) {
  const id = str(fd, "productId");
  const r = await adminApi(`/products/${id}/facts`, {
    method: "POST",
    body: {
      fieldName: str(fd, "fieldName"),
      factValue: str(fd, "factValue"),
      sourceUrl: str(fd, "sourceUrl"),
      sourceType: str(fd, "sourceType"),
      checkedAt: str(fd, "checkedAt"),
      evidenceNote: str(fd, "evidenceNote"),
    },
  });
  if (!r.ok) back(`/admin/products/${id}`, "error", errorText(r));
  refresh();
  back(`/admin/products/${id}`, "ok", "Fact added");
}

export async function deleteFactAction(fd: FormData) {
  const id = str(fd, "productId");
  const r = await adminApi(`/facts/${str(fd, "factId")}`, { method: "DELETE" });
  if (!r.ok) back(`/admin/products/${id}`, "error", errorText(r));
  refresh();
  back(`/admin/products/${id}`, "ok", "Fact removed");
}

// ---------- articles ----------

export async function saveArticleAction(fd: FormData) {
  const id = str(fd, "id");
  // Sources: har line "url | title | yyyy-mm-dd"
  const sources = lines(fd, "sources").map((l) => {
    const [url, title = "", checkedAt = ""] = l.split("|").map((s) => s.trim());
    return { url, title, checkedAt: checkedAt || null };
  });
  const body = {
    title: str(fd, "title"),
    slug: str(fd, "slug") || undefined,
    articleType: str(fd, "articleType"),
    productType: str(fd, "productType"),
    products: fd.getAll("products").map(String).filter(Boolean),
    audience: str(fd, "audience"),
    body: String(fd.get("body") ?? ""),
    excerpt: str(fd, "excerpt"),
    metaTitle: str(fd, "metaTitle"),
    metaDescription: str(fd, "metaDescription"),
    author: str(fd, "author"),
    reviewer: str(fd, "reviewer"),
    reviewMethod: str(fd, "reviewMethod"),
    disclosure: str(fd, "disclosure"),
    category: str(fd, "category"),
    coverImageUrl: str(fd, "coverImageUrl"),
    coverImageAlt: str(fd, "coverImageAlt"),
    coverImageCredit: str(fd, "coverImageCredit"),
    sources,
    qaFlags: lines(fd, "qaFlags"),
    claimsNeedingReview: lines(fd, "claimsNeedingReview"),
  };
  const r = await adminApi<{ _id: string }>(id ? `/articles/${id}` : "/articles", { method: id ? "PATCH" : "POST", body });
  const here = id ? `/admin/articles/${id}` : "/admin/articles/?new=1";
  if (!r.ok) back(here, "error", errorText(r));
  revalidatePath("/admin/articles");
  refresh();
  back(`/admin/articles/${r.data._id}`, "ok", id ? "Article saved" : "Draft created");
}

export async function setArticleStatusAction(fd: FormData) {
  const id = str(fd, "id");
  const status = str(fd, "status");
  const r = await adminApi(`/articles/${id}/status`, { method: "POST", body: { status, note: str(fd, "note") } });
  if (!r.ok) back(`/admin/articles/${id}`, "error", errorText(r));
  revalidatePath("/admin/articles");
  refresh();
  back(`/admin/articles/${id}`, "ok", `Status changed to ${status.replace(/_/g, " ")}`);
}

export async function deleteArticleAction(fd: FormData) {
  const r = await adminApi(`/articles/${str(fd, "id")}`, { method: "DELETE" });
  if (!r.ok) back(`/admin/articles/${str(fd, "id")}`, "error", errorText(r));
  refresh();
  back("/admin/articles", "ok", "Article deleted");
}

export async function toggleLinkAction(fd: FormData) {
  const articleId = str(fd, "articleId");
  const r = await adminApi(`/links/${str(fd, "linkId")}`, { method: "PATCH", body: { approved: str(fd, "approved") === "true" } });
  if (!r.ok) back(`/admin/articles/${articleId}`, "error", errorText(r));
  back(`/admin/articles/${articleId}`, "ok", "Link updated");
}

// ---------- topics ----------

export async function createTopicAction(fd: FormData) {
  const volume = str(fd, "volume");
  const r = await adminApi("/topics", {
    method: "POST",
    body: {
      primaryKeyword: str(fd, "primaryKeyword"),
      intent: str(fd, "intent"),
      productType: str(fd, "productType"),
      brand: str(fd, "brand"),
      priority: Number(str(fd, "priority") || 3),
      volume: volume ? Number(volume) : null,
      difficulty: str(fd, "difficulty") ? Number(str(fd, "difficulty")) : null,
      secondaryQueries: list(fd, "secondaryQueries"),
      country: str(fd, "country") || "us",
      language: str(fd, "language") || "en",
      provider: str(fd, "provider"),
      clusterId: str(fd, "clusterId"),
      sourceUrls: list(fd, "sourceUrls"),
      sourceCheckedAt: str(fd, "sourceCheckedAt") || null,
      assignedEditor: str(fd, "assignedEditor"),
    },
  });
  if (!r.ok) back("/admin/topics", "error", errorText(r));
  revalidatePath("/admin/topics");
  back("/admin/topics", "ok", "Topic added to queue");
}

export async function setTopicStatusAction(fd: FormData) {
  const r = await adminApi(`/topics/${str(fd, "id")}/status`, { method: "POST", body: { status: str(fd, "status") } });
  if (!r.ok) back("/admin/topics", "error", errorText(r));
  back("/admin/topics", "ok", "Topic status updated");
}

export async function deleteTopicAction(fd: FormData) {
  const r = await adminApi(`/topics/${str(fd, "id")}`, { method: "DELETE" });
  if (!r.ok) back("/admin/topics", "error", errorText(r));
  back("/admin/topics", "ok", "Topic deleted");
}
