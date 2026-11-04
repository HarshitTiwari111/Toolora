import Link from "next/link";
import { AlertTriangle, CheckCircle2, FileClock, Globe, ListTodo, Package, ShieldCheck } from "lucide-react";
import { adminGet } from "@/lib/admin-api";
import { Card, PageTitle } from "@/components/admin/ui";

export const metadata = { title: "Dashboard" };

type Stats = {
  products: number;
  articles: Record<string, number>;
  topics: Record<string, number>;
  workflowErrors7d: number;
};

function Stat({
  label,
  value,
  href,
  icon: Icon,
  tone,
}: {
  label: string;
  value: number;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  tone: string;
}) {
  return (
    <Link
      href={href}
      className="group flex items-center gap-4 rounded-2xl border border-line bg-surface p-5 shadow-card transition hover:-translate-y-0.5 hover:border-accent/50"
    >
      <span className={`inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${tone}`}>
        <Icon className="h-5 w-5" />
      </span>
      <span className="min-w-0">
        <span className="block text-sm text-muted">{label}</span>
        <span className="block text-2xl font-bold tracking-tight">{value}</span>
      </span>
    </Link>
  );
}

export default async function Dashboard() {
  const s = await adminGet<Stats>("/stats");
  const a = (k: string) => s.articles[k] ?? 0;

  return (
    <>
      <PageTitle title="Dashboard" subtitle="Content pipeline ka overview" />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <Stat label="Drafts to review" value={a("draft") + a("in_review")} href="/admin/articles/?status=draft" icon={FileClock} tone="bg-amber-500/10 text-amber-600" />
        <Stat label="Approved (not live)" value={a("approved")} href="/admin/articles/?status=approved" icon={CheckCircle2} tone="bg-blue-600/10 text-blue-500" />
        <Stat label="Published" value={a("published")} href="/admin/articles/?status=published" icon={Globe} tone="bg-green-600/10 text-green-600" />
        <Stat label="Products" value={s.products} href="/admin/products/" icon={Package} tone="bg-accent-soft text-accent" />
        <Stat label="New topics in queue" value={s.topics.new ?? 0} href="/admin/topics/" icon={ListTodo} tone="bg-violet-500/10 text-violet-500" />
        <Stat label="Workflow errors (7 days)" value={s.workflowErrors7d} href="/admin/logs/?status=error" icon={AlertTriangle} tone="bg-red-600/10 text-red-600" />
      </div>

      <Card className="mt-8">
        <h2 className="mb-4 flex items-center gap-2 font-semibold">
          <ShieldCheck className="h-5 w-5 text-accent" /> Editorial rules (PDF)
        </h2>
        <ul className="grid gap-3 text-sm text-muted sm:grid-cols-2">
          {[
            "Automation sirf drafts banati hai. Publish hamesha editor karega.",
            "Publish se pehle: meta title/description, kam se kam ek source, disclosure aur reviewer zaroori.",
            "Tool test nahi kiya to review method \"research based\" rakho — fake \"hands-on\" claim nahi.",
            "Pricing ya features bina source ke mat likho; source na mile to \"verify\" flag lagao.",
          ].map((r) => (
            <li key={r} className="flex gap-2 rounded-xl bg-surface-2 p-3">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
              {r}
            </li>
          ))}
        </ul>
      </Card>
    </>
  );
}
