import Link from "next/link";
import { adminGet } from "@/lib/admin-api";
import type { Paged, WorkflowLog } from "@/lib/admin-types";
import { Badge, Empty, PageTitle } from "@/components/admin/ui";

export const metadata = { title: "Workflow logs" };

export default async function LogsPage({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  const sp = await searchParams;
  const qs = new URLSearchParams({ limit: "100" });
  if (sp.status) qs.set("status", sp.status);
  const data = await adminGet<Paged<WorkflowLog>>(`/logs?${qs}`);

  return (
    <>
      <PageTitle title={`Workflow logs (${data.total})`} />
      <nav className="mb-5 flex gap-2 text-sm">
        {["", "success", "error", "retry", "skipped"].map((s) => (
          <Link
            key={s}
            href={s ? `/admin/logs/?status=${s}` : "/admin/logs/"}
            className={`rounded-full border px-3 py-1 ${(sp.status ?? "") === s ? "border-accent bg-accent-soft text-accent" : "border-line bg-surface text-muted hover:text-foreground"}`}
          >
            {s || "All"}
          </Link>
        ))}
      </nav>
      {data.items.length === 0 ? (
        <Empty text="Abhi koi log nahi. n8n (Part 6) chalne ke baad yahan har run dikhega." />
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-line bg-surface shadow-card">
          <table className="w-full min-w-[720px] text-sm">
            <thead className="bg-surface-2/60 text-left">
              <tr>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted">Time</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted">Run</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted">Node</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted">Status</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted">Error</th>
              </tr>
            </thead>
            <tbody>
              {data.items.map((l) => (
                <tr key={l._id} className="border-t border-line transition hover:bg-surface-2/60">
                  <td className="whitespace-nowrap px-4 py-3">{new Date(l.createdAt).toLocaleString("en-GB")}</td>
                  <td className="px-4 py-3 font-mono text-xs">{l.runId}</td>
                  <td className="px-4 py-3">{l.node}</td>
                  <td className="px-4 py-3">
                    <Badge value={l.status} />
                    {l.retries > 0 && <span className="ml-1 text-xs text-muted">×{l.retries}</span>}
                  </td>
                  <td className="px-4 py-3 text-red-600">{l.errorSummary}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
