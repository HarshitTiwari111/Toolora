import { addFactAction, deleteFactAction, deleteProductAction } from "@/app/admin/actions";
import { adminGet } from "@/lib/admin-api";
import type { Product, SourceFact } from "@/lib/admin-types";
import ProductForm from "@/components/admin/ProductForm";
import ConfirmButton from "@/components/admin/ConfirmButton";
import { Badge, Button, Card, Empty, Field, Flash, PageTitle, fmtDate, inputCls } from "@/components/admin/ui";

export const metadata = { title: "Edit product" };

type Props = { params: Promise<{ id: string }>; searchParams: Promise<{ ok?: string; error?: string }> };

export default async function EditProduct({ params, searchParams }: Props) {
  const { id } = await params;
  const sp = await searchParams;
  const p = await adminGet<Product & { facts: SourceFact[] }>(`/products/${id}`);
  const today = new Date().toISOString().slice(0, 10);

  return (
    <>
      <PageTitle title={p.brandName} />
      <p className="-mt-4 mb-6 flex flex-wrap items-center gap-3 text-sm text-muted">
        <Badge value={p.status} /> Public URL: <code>{p.url}</code>
      </p>
      <Flash ok={sp.ok} error={sp.error} />

      <div className="grid gap-6 xl:grid-cols-[1fr_420px]">
        <Card>
          <ProductForm product={p} />
        </Card>

        <div className="space-y-6">
          <Card>
            <h2 className="mb-1 font-semibold">Source facts ({p.facts.length})</h2>
            <p className="mb-4 text-xs text-muted">Har pricing/feature claim ka official source aur check date.</p>
            {p.facts.length === 0 ? (
              <Empty text="Koi fact nahi. Official pricing/docs page se add karo." />
            ) : (
              <ul className="space-y-3">
                {p.facts.map((f) => (
                  <li key={f._id} className="rounded-lg border border-line p-3 text-sm">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="font-medium">{f.fieldName}</p>
                        <p>{f.factValue}</p>
                        <a href={f.sourceUrl} target="_blank" rel="noreferrer" className="break-all text-xs text-accent">
                          {f.sourceUrl}
                        </a>
                        <p className="text-xs text-muted">
                          {f.sourceType} · checked {fmtDate(f.checkedAt)}
                        </p>
                      </div>
                      <form action={deleteFactAction}>
                        <input type="hidden" name="productId" value={p._id} />
                        <input type="hidden" name="factId" value={f._id} />
                        <ConfirmButton message="Remove this fact?" className="px-2 py-1 text-xs">
                          ✕
                        </ConfirmButton>
                      </form>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </Card>

          <Card>
            <h2 className="mb-4 font-semibold">Add fact</h2>
            <form action={addFactAction} className="space-y-3">
              <input type="hidden" name="productId" value={p._id} />
              <Field label="Field" hint="e.g. pricing_pro_plan, free_tier, api_available">
                <input name="fieldName" required className={inputCls} />
              </Field>
              <Field label="Value">
                <textarea name="factValue" required rows={2} className={inputCls} />
              </Field>
              <Field label="Source URL">
                <input name="sourceUrl" type="url" required className={inputCls} />
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Source type">
                  <select name="sourceType" className={inputCls}>
                    <option value="official">Official</option>
                    <option value="first-party">First-party</option>
                    <option value="other">Other</option>
                  </select>
                </Field>
                <Field label="Checked on">
                  <input name="checkedAt" type="date" required defaultValue={today} className={inputCls} />
                </Field>
              </div>
              <Field label="Evidence note">
                <input name="evidenceNote" className={inputCls} />
              </Field>
              <Button type="submit">Add fact</Button>
            </form>
          </Card>

          <Card>
            <h2 className="mb-2 font-semibold text-red-600">Danger zone</h2>
            <form action={deleteProductAction}>
              <input type="hidden" name="id" value={p._id} />
              <ConfirmButton message={`Delete ${p.brandName} and all its facts? This cannot be undone.`}>
                Delete product
              </ConfirmButton>
            </form>
          </Card>
        </div>
      </div>
    </>
  );
}
