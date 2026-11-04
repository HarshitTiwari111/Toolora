import { saveProductAction } from "@/app/admin/actions";
import { aiCategories, saasCategories } from "@/lib/site";
import type { Product } from "@/lib/admin-types";
import { Button, Field, dateInput, inputCls } from "./ui";

export default function ProductForm({ product }: { product?: Product }) {
  const p = product;
  return (
    <form action={saveProductAction} className="space-y-5">
      {p && <input type="hidden" name="id" value={p._id} />}
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Brand name *">
          <input name="brandName" required defaultValue={p?.brandName} className={inputCls} />
        </Field>
        <Field label="Slug" hint="Khaali chhodo to brand name se banega">
          <input name="slug" defaultValue={p?.slug} pattern="[a-z0-9]+(-[a-z0-9]+)*" className={inputCls} />
        </Field>
        <Field label="Product type *">
          <select name="productType" defaultValue={p?.productType ?? "ai"} className={inputCls}>
            <option value="ai">AI tool</option>
            <option value="saas">SaaS</option>
          </select>
        </Field>
        <Field label="Status">
          <select name="status" defaultValue={p?.status ?? "draft"} className={inputCls}>
            <option value="draft">Draft (site par nahi dikhega)</option>
            <option value="active">Active (site par live)</option>
            <option value="archived">Archived</option>
          </select>
        </Field>
        <Field label="Official URL *">
          <input name="officialUrl" type="url" required defaultValue={p?.officialUrl} className={inputCls} />
        </Field>
        <Field label="Affiliate URL" hint="Citation se alag track hota hai">
          <input name="affiliateUrl" type="url" defaultValue={p?.affiliateUrl} className={inputCls} />
        </Field>
        <Field label="Pricing model">
          <select name="pricingModel" defaultValue={p?.pricingModel ?? "unknown"} className={inputCls}>
            <option value="unknown">Unknown / verify</option>
            <option value="free">Free</option>
            <option value="freemium">Freemium</option>
            <option value="paid">Paid</option>
          </select>
        </Field>
        <Field label="Last verified on" hint="Official site par facts kab check kiye">
          <input name="lastVerifiedAt" type="date" defaultValue={dateInput(p?.lastVerifiedAt)} className={inputCls} />
        </Field>
      </div>

      <fieldset>
        <legend className="mb-2 text-sm font-medium">Categories (product type ke hisaab se)</legend>
        <div className="grid gap-4 sm:grid-cols-2">
          {[
            { title: "AI", cats: aiCategories },
            { title: "SaaS", cats: saasCategories },
          ].map((g) => (
            <div key={g.title} className="rounded-lg border border-line p-3">
              <p className="mb-2 text-xs font-semibold uppercase text-muted">{g.title}</p>
              <div className="grid grid-cols-2 gap-1.5">
                {g.cats.map((c) => (
                  <label key={c.slug} className="flex items-center gap-2 text-sm">
                    <input type="checkbox" name="categories" value={c.slug} defaultChecked={p?.categories.includes(c.slug)} className="accent-[var(--accent)]" />
                    {c.name.replace(/^AI /, "")}
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>
      </fieldset>

      <Field label="Short description">
        <textarea name="shortDescription" rows={2} defaultValue={p?.shortDescription} className={inputCls} />
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Platforms" hint="Comma se alag: web, windows, mac, ios, android, api">
          <input name="platforms" defaultValue={p?.platforms.join(", ")} className={inputCls} />
        </Field>
        <Field label="Use cases" hint="Comma se alag">
          <input name="useCases" defaultValue={p?.useCases.join(", ")} className={inputCls} />
        </Field>
      </div>
      <Field label="Logo / media rights note">
        <input name="logoRightsNote" defaultValue={p?.logoRightsNote} className={inputCls} />
      </Field>
      <Button type="submit">{p ? "Save product" : "Create product"}</Button>
    </form>
  );
}
