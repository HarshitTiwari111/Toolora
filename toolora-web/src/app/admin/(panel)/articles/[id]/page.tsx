import { deleteArticleAction, setArticleStatusAction, toggleLinkAction } from "@/app/admin/actions";
import { adminGet } from "@/lib/admin-api";
import type { Article, LinkSuggestion, Paged, Product } from "@/lib/admin-types";
import ArticleForm from "@/components/admin/ArticleForm";
import ConfirmButton from "@/components/admin/ConfirmButton";
import { Badge, Button, Card, Flash, PageTitle, fmtDate } from "@/components/admin/ui";

export const metadata = { title: "Edit article" };

type Props = { params: Promise<{ id: string }>; searchParams: Promise<{ ok?: string; error?: string }> };
type Full = Article & { links: LinkSuggestion[]; publishGateFailures: string[] };

// Editor workflow: draft → in review → approved → published.
const NEXT: Record<string, { status: string; label: string }[]> = {
  draft: [{ status: "in_review", label: "Send to review" }],
  in_review: [
    { status: "approved", label: "Approve" },
    { status: "draft", label: "Back to draft" },
  ],
  approved: [
    { status: "published", label: "Publish now" },
    { status: "in_review", label: "Back to review" },
  ],
  published: [
    { status: "draft", label: "Unpublish (to draft)" },
    { status: "archived", label: "Archive" },
  ],
  archived: [{ status: "draft", label: "Restore as draft" }],
};

export default async function EditArticle({ params, searchParams }: Props) {
  const { id } = await params;
  const sp = await searchParams;
  const [a, products] = await Promise.all([
    adminGet<Full>(`/articles/${id}`),
    adminGet<Paged<Product>>("/products?limit=100"),
  ]);
  const ready = a.publishGateFailures.length === 0;

  return (
    <>
      <PageTitle title={a.title} />
      <p className="-mt-4 mb-6 flex flex-wrap items-center gap-3 text-sm text-muted">
        <Badge value={a.status} /> {a.createdBy === "automation" ? "🤖 Created by n8n" : "Created by editor"} · URL:{" "}
        <code>{a.url}</code>
      </p>
      <Flash ok={sp.ok} error={sp.error} />

      <div className="grid gap-6 xl:grid-cols-[1fr_380px]">
        <Card>
          <ArticleForm article={a} products={products.items} />
        </Card>

        <div className="space-y-6">
          <Card>
            <h2 className="mb-3 font-semibold">Workflow</h2>
            <div className={`mb-4 rounded-lg border p-3 text-sm ${ready ? "border-green-600/40" : "border-amber-500/40"}`}>
              {ready ? (
                <p className="text-green-600">✓ All publish gates pass.</p>
              ) : (
                <>
                  <p className="mb-1 font-medium text-amber-600">Publish blocked until fixed:</p>
                  <ul className="list-disc pl-5 text-muted">
                    {a.publishGateFailures.map((f) => (
                      <li key={f}>{f}</li>
                    ))}
                  </ul>
                </>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {(NEXT[a.status] ?? []).map((n) => (
                // Har action ka apna form: status hidden field me jaata hai (submitter value par depend nahi).
                <form key={n.status} action={setArticleStatusAction}>
                  <input type="hidden" name="id" value={a._id} />
                  <input type="hidden" name="status" value={n.status} />
                  <Button
                    type="submit"
                    variant={n.status === "published" || n.status === "approved" ? "primary" : "secondary"}
                    disabled={n.status === "published" && !ready}
                  >
                    {n.label}
                  </Button>
                </form>
              ))}
            </div>
          </Card>

          <Card>
            <h2 className="mb-3 font-semibold">Link suggestions ({a.links.length})</h2>
            {a.links.length === 0 ? (
              <p className="text-sm text-muted">Automation ki suggestions yahan aayengi.</p>
            ) : (
              <ul className="space-y-2">
                {a.links.map((l) => (
                  <li key={l._id} className="flex items-start justify-between gap-2 rounded-lg border border-line p-3 text-sm">
                    <div className="min-w-0">
                      <p className="font-medium">&ldquo;{l.anchorText}&rdquo;</p>
                      <p className="break-all text-xs text-accent">{l.targetUrl}</p>
                      <p className="text-xs text-muted">
                        {l.linkType}
                        {l.reason ? ` · ${l.reason}` : ""}
                      </p>
                    </div>
                    <form action={toggleLinkAction}>
                      <input type="hidden" name="articleId" value={a._id} />
                      <input type="hidden" name="linkId" value={l._id} />
                      <input type="hidden" name="approved" value={String(!l.approved)} />
                      <Button type="submit" variant={l.approved ? "secondary" : "primary"} className="px-2 py-1 text-xs">
                        {l.approved ? "Approved ✓" : "Approve"}
                      </Button>
                    </form>
                  </li>
                ))}
              </ul>
            )}
          </Card>

          <Card>
            <h2 className="mb-3 font-semibold">History</h2>
            <ul className="space-y-1.5 text-xs text-muted">
              {[...a.updateHistory].reverse().slice(0, 15).map((h, i) => (
                <li key={i}>
                  <span className="text-foreground">{fmtDate(h.date)}</span> · {h.note} {h.by && `(${h.by})`}
                </li>
              ))}
            </ul>
          </Card>

          <Card>
            <h2 className="mb-2 font-semibold text-red-600">Danger zone</h2>
            <form action={deleteArticleAction}>
              <input type="hidden" name="id" value={a._id} />
              <ConfirmButton message="Delete this article permanently? This cannot be undone.">Delete article</ConfirmButton>
            </form>
          </Card>
        </div>
      </div>
    </>
  );
}
