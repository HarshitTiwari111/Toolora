import { createTopicAction, deleteTopicAction, setTopicStatusAction } from "@/app/admin/actions";
import { adminGet } from "@/lib/admin-api";
import { TOPIC_STATUSES, type Paged, type Topic } from "@/lib/admin-types";
import ConfirmButton from "@/components/admin/ConfirmButton";
import { Badge, Button, Card, Empty, Field, Flash, PageTitle, inputCls } from "@/components/admin/ui";

export const metadata = { title: "Topic queue" };

type Props = { searchParams: Promise<{ status?: string; ok?: string; error?: string }> };

export default async function TopicsPage({ searchParams }: Props) {
  const sp = await searchParams;
  const qs = new URLSearchParams({ limit: "100" });
  if (sp.status) qs.set("status", sp.status);
  const data = await adminGet<Paged<Topic>>(`/topics?${qs}`);

  return (
    <>
      <PageTitle title={`Topic queue (${data.total})`} />
      <Flash ok={sp.ok} error={sp.error} />

      <Card className="mb-6">
        <h2 className="mb-4 font-semibold">Add topic</h2>
        <form action={createTopicAction} className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Field label="Primary keyword *">
            <input name="primaryKeyword" required placeholder="gamma review" className={inputCls} />
          </Field>
          <Field label="Intent">
            <select name="intent" className={inputCls}>
              <option value="review">Review</option>
              <option value="compare">Compare</option>
              <option value="alternatives">Alternatives</option>
              <option value="guide">Guide</option>
            </select>
          </Field>
          <Field label="Section">
            <select name="productType" className={inputCls}>
              <option value="ai">AI</option>
              <option value="saas">SaaS</option>
            </select>
          </Field>
          <Field label="Brand">
            <input name="brand" className={inputCls} />
          </Field>
          <Field label="Priority (1–5)">
            <input name="priority" type="number" min={1} max={5} defaultValue={3} className={inputCls} />
          </Field>
          <Field label="Volume" hint="Sirf keyword tool ka measured data">
            <input name="volume" type="number" min={0} className={inputCls} />
          </Field>
          <Field label="Source URLs" hint="Comma se alag">
            <input name="sourceUrls" className={inputCls} />
          </Field>
          <Field label="Assigned editor">
            <input name="assignedEditor" className={inputCls} />
          </Field>
          <details className="sm:col-span-2 lg:col-span-4">
            <summary className="cursor-pointer text-sm font-medium text-accent">More fields (keyword data, cluster, country)</summary>
            <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <Field label="Secondary queries" hint="Comma se alag">
                <input name="secondaryQueries" className={inputCls} />
              </Field>
              <Field label="Difficulty (0–100)">
                <input name="difficulty" type="number" min={0} max={100} className={inputCls} />
              </Field>
              <Field label="Keyword data provider" hint="e.g. Ahrefs, Semrush">
                <input name="provider" className={inputCls} />
              </Field>
              <Field label="Cluster ID" hint="Same intent wale keywords ek cluster me">
                <input name="clusterId" className={inputCls} />
              </Field>
              <Field label="Country">
                <input name="country" defaultValue="us" className={inputCls} />
              </Field>
              <Field label="Language">
                <input name="language" defaultValue="en" className={inputCls} />
              </Field>
              <Field label="Sources checked on">
                <input name="sourceCheckedAt" type="date" className={inputCls} />
              </Field>
            </div>
          </details>
          <div className="sm:col-span-2 lg:col-span-4">
            <Button type="submit">Add to queue</Button>
          </div>
        </form>
      </Card>

      {data.items.length === 0 ? (
        <Empty text="Queue khaali hai." />
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-line bg-surface shadow-card">
          <table className="w-full min-w-[720px] text-sm">
            <thead className="bg-surface-2/60 text-left">
              <tr>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted">Keyword</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted">Intent</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted">Priority</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted">Volume</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted">Status</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted"></th>
              </tr>
            </thead>
            <tbody>
              {data.items.map((t) => (
                <tr key={t._id} className="border-t border-line transition hover:bg-surface-2/60 align-top">
                  <td className="px-4 py-3">
                    <p className="font-medium">{t.primaryKeyword}</p>
                    <p className="text-xs text-muted">{t.topicKey}</p>
                    {(t.clusterId || t.provider) && (
                      <p className="text-xs text-muted">
                        {t.clusterId && `cluster: ${t.clusterId}`} {t.provider && `· ${t.provider}`}
                      </p>
                    )}
                  </td>
                  <td className="px-4 py-3 capitalize">
                    {t.productType.toUpperCase()} · {t.intent}
                  </td>
                  <td className="px-4 py-3">{t.priority}</td>
                  <td className="px-4 py-3">{t.volume ?? "—"}</td>
                  <td className="px-4 py-3">
                    <Badge value={t.status} />
                    <form action={setTopicStatusAction} className="mt-2 flex gap-1">
                      <input type="hidden" name="id" value={t._id} />
                      <select name="status" defaultValue={t.status} className={`${inputCls} py-1 text-xs`}>
                        {TOPIC_STATUSES.map((s) => (
                          <option key={s} value={s}>
                            {s.replace(/_/g, " ")}
                          </option>
                        ))}
                      </select>
                      <button className="rounded-lg border border-line px-2 text-xs">Set</button>
                    </form>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <form action={deleteTopicAction}>
                      <input type="hidden" name="id" value={t._id} />
                      <ConfirmButton message="Delete this topic?" className="px-2 py-1 text-xs">
                        Delete
                      </ConfirmButton>
                    </form>
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
