import { saveArticleAction } from "@/app/admin/actions";
import type { Article, Product } from "@/lib/admin-types";
import { aiCategories, saasCategories } from "@/lib/site";
import { Button, Field, dateInput, inputCls } from "./ui";

export default function ArticleForm({ article, products }: { article?: Article; products: Product[] }) {
  const a = article;
  const selected = new Set((a?.products ?? []).map((p) => (typeof p === "string" ? p : p._id)));
  const sources = (a?.sources ?? [])
    .map((s) => [s.url, s.title, dateInput(s.checkedAt)].filter((x, i) => x || i === 0).join(" | "))
    .join("\n");

  return (
    <form action={saveArticleAction} className="space-y-5">
      {a && <input type="hidden" name="id" value={a._id} />}
      <Field label="Title *">
        <input name="title" required defaultValue={a?.title} className={inputCls} />
      </Field>
      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Article type *">
          <select name="articleType" defaultValue={a?.articleType ?? "review"} className={inputCls}>
            <option value="review">Review</option>
            <option value="compare">Compare (A vs B)</option>
            <option value="alternatives">Alternatives</option>
            <option value="guide">Guide</option>
          </select>
        </Field>
        <Field label="Section">
          <select name="productType" defaultValue={a?.productType ?? "ai"} className={inputCls}>
            <option value="ai">AI tools</option>
            <option value="saas">SaaS</option>
          </select>
        </Field>
        <Field label="Slug" hint="Khaali = title se banega">
          <input name="slug" defaultValue={a?.slug} pattern="[a-z0-9]+(-[a-z0-9]+)*" className={inputCls} />
        </Field>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Blog category" hint="Card, breadcrumb aur /blog filter me dikhegi">
          <select name="category" defaultValue={a?.category ?? ""} className={inputCls}>
            <option value="">— None —</option>
            <optgroup label="AI tools">
              {aiCategories.map((c) => (
                <option key={c.slug} value={c.slug}>{c.name}</option>
              ))}
            </optgroup>
            <optgroup label="SaaS (section = SaaS)">
              {saasCategories.map((c) => (
                <option key={c.slug} value={c.slug}>{c.name}</option>
              ))}
            </optgroup>
          </select>
        </Field>
        <Field label="Cover image URL" hint="https://… (Unsplash, Cloudinary, etc.). Size ~1600×900">
          <input name="coverImageUrl" type="url" defaultValue={a?.coverImageUrl} className={inputCls} />
        </Field>
        <Field label="Cover image alt text" hint="Image me kya hai — SEO + accessibility (image ho to zaroori)">
          <input name="coverImageAlt" maxLength={200} defaultValue={a?.coverImageAlt} className={inputCls} />
        </Field>
        <Field label="Photo credit" hint="e.g. Photo: Name on Unsplash">
          <input name="coverImageCredit" maxLength={200} defaultValue={a?.coverImageCredit} className={inputCls} />
        </Field>
      </div>

      <fieldset>
        <legend className="mb-1.5 text-sm font-medium">Products covered</legend>
        {products.length === 0 ? (
          <p className="text-sm text-muted">Pehle Products me product add karo.</p>
        ) : (
          <div className="no-scrollbar grid max-h-48 gap-2 overflow-y-auto rounded-lg border border-line bg-background p-2 sm:grid-cols-2">
            {products.map((p) => (
              <label
                key={p._id}
                className="flex cursor-pointer items-center gap-2.5 rounded-md px-2.5 py-2 text-sm transition hover:bg-surface-2 has-[:checked]:bg-accent-soft has-[:checked]:text-accent"
              >
                <input type="checkbox" name="products" value={p._id} defaultChecked={selected.has(p._id)} className="accent-[var(--accent)]" />
                <span className="truncate">{p.brandName}</span>
                <span className="ml-auto text-xs uppercase text-muted">{p.productType}</span>
              </label>
            ))}
          </div>
        )}
        <span className="mt-1 block text-xs text-muted">Jitne products is article me cover hain, sab tick karo</span>
      </fieldset>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Meta title" hint="Max 70 characters">
          <input name="metaTitle" maxLength={70} defaultValue={a?.metaTitle} className={inputCls} />
        </Field>
        <Field label="Audience / use case">
          <input name="audience" defaultValue={a?.audience} className={inputCls} />
        </Field>
      </div>
      <Field label="Meta description" hint="Max 170 characters">
        <textarea name="metaDescription" maxLength={170} rows={2} defaultValue={a?.metaDescription} className={inputCls} />
      </Field>
      <Field label="Excerpt">
        <textarea name="excerpt" rows={2} defaultValue={a?.excerpt} className={inputCls} />
      </Field>
      <Field label="Body (HTML)" hint="Order: summary → what it does → features → pricing → pros/limits → alternatives → FAQ → method → sources">
        <textarea name="body" rows={16} defaultValue={a?.body} className={`${inputCls} font-mono text-xs`} />
      </Field>
      <Field label="Sources *" hint="Har line: url | title | yyyy-mm-dd (checked date)">
        <textarea name="sources" rows={4} defaultValue={sources} className={`${inputCls} font-mono text-xs`} />
      </Field>

      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Author">
          <input name="author" defaultValue={a?.author} className={inputCls} />
        </Field>
        <Field label="Reviewer (editor) *" hint="Publish ke liye zaroori">
          <input name="reviewer" defaultValue={a?.reviewer} className={inputCls} />
        </Field>
        <Field label="Review method">
          <select name="reviewMethod" defaultValue={a?.reviewMethod ?? "research_based"} className={inputCls}>
            <option value="research_based">Research-based overview</option>
            <option value="hands_on">Hands-on tested (sirf agar sach me test kiya)</option>
          </select>
        </Field>
      </div>
      <Field label="Affiliate disclosure *">
        <textarea
          name="disclosure"
          rows={2}
          defaultValue={a?.disclosure ?? "Toolora.ai may earn a commission if you buy through links on this page. This does not change our editorial assessment."}
          className={inputCls}
        />
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="QA flags" hint="Har line ek flag. Publish ke liye khaali hona chahiye">
          <textarea name="qaFlags" rows={3} defaultValue={a?.qaFlags.join("\n")} className={inputCls} />
        </Field>
        <Field label="Claims needing review" hint="Har line ek claim. Verify karke hatao">
          <textarea name="claimsNeedingReview" rows={3} defaultValue={a?.claimsNeedingReview.join("\n")} className={inputCls} />
        </Field>
      </div>
      <Button type="submit">{a ? "Save article" : "Create draft"}</Button>
    </form>
  );
}
