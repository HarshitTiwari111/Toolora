import Link from "next/link";
import { adminGet } from "@/lib/admin-api";
import type { Paged, Product } from "@/lib/admin-types";
import { Badge, Empty, Flash, PageTitle, fmtDate, filterCls } from "@/components/admin/ui";
import Modal from "@/components/admin/Modal";
import ProductForm from "@/components/admin/ProductForm";

export const metadata = { title: "Products" };

type Props = { searchParams: Promise<{ q?: string; type?: string; status?: string; ok?: string; error?: string; new?: string }> };

export default async function ProductsPage({ searchParams }: Props) {
  const sp = await searchParams;
  const qs = new URLSearchParams({ limit: "100" });
  for (const k of ["q", "type", "status"] as const) if (sp[k]) qs.set(k, sp[k]!);
  const data = await adminGet<Paged<Product>>(`/products?${qs}`);

  return (
    <>
      <PageTitle title={`Products (${data.total})`}>
        <Modal triggerLabel="New product" title="New product" description="Official site se verified details hi daalo.">
          {sp.new && <Flash error={sp.error} />}
          <ProductForm />
        </Modal>
      </PageTitle>
      <Flash ok={sp.ok} error={sp.new ? undefined : sp.error} />
      <form className="mb-5 flex flex-wrap gap-2">
        <input name="q" placeholder="Search brand…" defaultValue={sp.q} className={`${filterCls} w-full max-w-xs`} />
        <select name="type" defaultValue={sp.type ?? ""} className={`${filterCls}`}>
          <option value="">All types</option>
          <option value="ai">AI</option>
          <option value="saas">SaaS</option>
        </select>
        <select name="status" defaultValue={sp.status ?? ""} className={`${filterCls}`}>
          <option value="">All statuses</option>
          <option value="draft">Draft</option>
          <option value="active">Active</option>
          <option value="archived">Archived</option>
        </select>
        <button className="h-10 rounded-lg border border-line bg-surface px-4 text-sm font-medium hover:bg-surface-2">Filter</button>
      </form>
      {data.items.length === 0 ? (
        <Empty text="Abhi koi product nahi hai. PDF ki 100 brands list se shuru karo." />
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-line bg-surface shadow-card">
          <table className="w-full min-w-[640px] text-sm">
            <thead className="bg-surface-2/60 text-left">
              <tr>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted">Brand</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted">Type</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted">Categories</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted">Pricing</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted">Verified</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted">Status</th>
              </tr>
            </thead>
            <tbody>
              {data.items.map((p) => (
                <tr key={p._id} className="border-t border-line transition hover:bg-surface-2/60">
                  <td className="px-4 py-3">
                    <Link href={`/admin/products/${p._id}/`} className="font-medium hover:text-accent">
                      {p.brandName}
                    </Link>
                    <div className="text-xs text-muted">{p.url}</div>
                  </td>
                  <td className="px-4 py-3 uppercase">{p.productType}</td>
                  <td className="px-4 py-3">{p.categories.join(", ") || "—"}</td>
                  <td className="px-4 py-3">{p.pricingModel}</td>
                  <td className="px-4 py-3">{fmtDate(p.lastVerifiedAt)}</td>
                  <td className="px-4 py-3">
                    <Badge value={p.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
