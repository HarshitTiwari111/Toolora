import PagePlaceholder from "@/components/PagePlaceholder";
import { getHealth } from "@/lib/api";

// Developer test page: Next.js → Express API → MongoDB connection check. Launch se pehle hata dena.
export const metadata = { title: "API connection test", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

function Row({ label, ok, value }: { label: string; ok: boolean; value: string }) {
  return (
    <li className="flex items-center justify-between gap-4 rounded-xl border border-line bg-surface p-4">
      <span className="font-medium">{label}</span>
      <span className={ok ? "text-green-600" : "text-red-600"}>
        {ok ? "✓" : "✗"} {value}
      </span>
    </li>
  );
}

export default async function Page() {
  const result = await getHealth();
  return (
    <PagePlaceholder title="API connection test" pageType="Developer only" crumbs={[{ label: "API test" }]}>
      {result.ok ? (
        <ul className="max-w-xl space-y-3">
          <Row label="Next.js → Express API" ok value={result.data.service} />
          <Row
            label="Express → MongoDB"
            ok={result.data.db.state === "connected"}
            value={`${result.data.db.state} (${result.data.db.name}${
              result.data.db.pingMs !== null ? `, ${result.data.db.pingMs} ms` : ""
            })`}
          />
        </ul>
      ) : (
        <p className="max-w-xl rounded-xl border border-line bg-surface p-4 font-medium text-red-600">
          ✗ Not connected: {result.error}
        </p>
      )}
    </PagePlaceholder>
  );
}
