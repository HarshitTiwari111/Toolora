import Link from "next/link";
import { adminGet } from "@/lib/admin-api";
import { ARTICLE_STATUSES, type Article, type Paged, type Product } from "@/lib/admin-types";
import Modal from "@/components/admin/Modal";
import ArticleForm from "@/components/admin/ArticleForm";
import { Badge, Empty, Flash, PageTitle, fmtDate } from "@/components/admin/ui";

export const metadata = { title: "Articles" };

type Props = { searchParams: Promise<{ status?: string; ok?: string; error?: string; new?: string }> };

export default async function ArticlesPage({ searchParams }: Props) {
  const sp = await searchParams;
  const qs = new URLSearchParams({ limit: "100" });
  if (sp.status) qs.set("status", sp.status);
  const [data, products] = await Promise.all([
    adminGet<Paged<Article>>(`/articles?${qs}`),
    adminGet<Paged<Product>>("/products?limit=100"),
  ]);

  const tabs = [{ value: "", label: "All" }, ...ARTICLE_STATUSES.map((s) => ({ value: s, label: s.replace(/_/g, " ") }))];

  return (
    <>
      <PageTitle title={`Articles (${data.total})`}>
        <Modal triggerLabel="New draft" title="New article draft" description="Draft save hoga; publish editor review ke baad.">
          {sp.new && <Flash error={sp.error} />}
          <ArticleForm products={products.items} />
        </Modal>
      </PageTitle>
      <Flash ok={sp.ok} error={sp.new ? undefined : sp.error} />
      <nav className="mb-5 flex flex-wrap gap-2">
        {tabs.map((t) => (
          <Link
            key={t.value}
            href={t.value ? `/admin/articles/?status=${t.value}` : "/admin/articles/"}
            className={`rounded-full border px-3 py-1 text-sm capitalize ${
              (sp.status ?? "") === t.value ? "border-accent bg-accent-soft text-accent" : "border-line bg-surface text-muted hover:text-foreground"
            }`}
          >
            {t.label}
          </Link>
        ))}
      </nav>
      {data.items.length === 0 ? (
        <Empty text="Is status me koi article nahi." />
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-line bg-surface shadow-card">
          <table className="w-full min-w-[640px] text-sm">
            <thead className="bg-surface-2/60 text-left">
              <tr>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted">Title</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted">Type</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted">Source</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted">Updated</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted">Status</th>
              </tr>
            </thead>
            <tbody>
              {data.items.map((a) => (
                <tr key={a._id} className="border-t border-line transition hover:bg-surface-2/60">
                  <td className="px-4 py-3">
                    <Link href={`/admin/articles/${a._id}/`} className="font-medium hover:text-accent">
                      {a.title}
                    </Link>
                    <div className="text-xs text-muted">{a.url}</div>
                  </td>
                  <td className="px-4 py-3 capitalize">
                    {a.productType.toUpperCase()} · {a.articleType}
                  </td>
                  <td className="px-4 py-3">{a.createdBy === "automation" ? "🤖 n8n" : "Editor"}</td>
                  <td className="px-4 py-3">{fmtDate(a.updatedAt)}</td>
                  <td className="px-4 py-3">
                    <Badge value={a.status} />
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
