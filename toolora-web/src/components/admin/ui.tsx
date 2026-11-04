import Link from "next/link";
import { CheckCircle2, Plus, XCircle } from "lucide-react";

const fieldBase =
  "rounded-lg border border-line bg-background px-3 py-2 text-sm outline-none transition placeholder:text-muted/70 focus:border-accent focus:ring-4 focus:ring-[var(--ring)]";

// Form fields ke liye (full width).
export const inputCls = `w-full ${fieldBase}`;
// Filter bar ke liye (content jitni width).
export const filterCls = `${fieldBase} h-10`;

export function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-xs text-muted">{hint}</span>}
    </label>
  );
}

export function Button({
  children,
  variant = "primary",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "secondary" | "danger" }) {
  const styles = {
    primary: "bg-accent text-white shadow-sm hover:opacity-90",
    secondary: "border border-line bg-surface hover:bg-surface-2",
    danger: "border border-red-500/40 text-red-600 hover:bg-red-500/10",
  }[variant];
  return (
    <button
      {...props}
      className={`inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50 ${styles} ${props.className ?? ""}`}
    >
      {children}
    </button>
  );
}

export function Flash({ ok, error }: { ok?: string; error?: string }) {
  if (!ok && !error) return null;
  const Icon = error ? XCircle : CheckCircle2;
  return (
    <p
      role="status"
      className={`mb-6 flex items-start gap-2 rounded-xl border px-4 py-3 text-sm ${
        error ? "border-red-500/30 bg-red-500/5 text-red-600" : "border-green-600/30 bg-green-600/5 text-green-600"
      }`}
    >
      <Icon className="mt-0.5 h-4 w-4 shrink-0" />
      <span>{error ?? ok}</span>
    </p>
  );
}

const badgeColors: Record<string, string> = {
  published: "bg-green-600/10 text-green-600 ring-green-600/20",
  active: "bg-green-600/10 text-green-600 ring-green-600/20",
  success: "bg-green-600/10 text-green-600 ring-green-600/20",
  approved: "bg-blue-600/10 text-blue-500 ring-blue-600/20",
  in_review: "bg-amber-500/10 text-amber-600 ring-amber-500/20",
  qa: "bg-amber-500/10 text-amber-600 ring-amber-500/20",
  retry: "bg-amber-500/10 text-amber-600 ring-amber-500/20",
  error: "bg-red-600/10 text-red-600 ring-red-600/20",
};

export function Badge({ value }: { value: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ring-1 ring-inset ${
        badgeColors[value] ?? "bg-slate-500/10 text-muted ring-slate-500/20"
      }`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {value.replace(/_/g, " ")}
    </span>
  );
}

export function PageTitle({
  title,
  subtitle,
  action,
  children,
}: {
  title: string;
  subtitle?: React.ReactNode;
  action?: { href: string; label: string };
  children?: React.ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
      <div className="min-w-0">
        <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
        {subtitle && <div className="mt-1 text-sm text-muted">{subtitle}</div>}
      </div>
      {action && (
        <Link
          href={action.href}
          className="inline-flex items-center gap-1.5 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:opacity-90"
        >
          <Plus className="h-4 w-4" /> {action.label}
        </Link>
      )}
      {children}
    </div>
  );
}

export function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <section className={`rounded-2xl border border-line bg-surface p-5 shadow-card sm:p-6 ${className}`}>{children}</section>;
}

export function Empty({ text }: { text: string }) {
  return (
    <p className="rounded-2xl border border-dashed border-line bg-surface px-6 py-12 text-center text-sm text-muted">{text}</p>
  );
}

// Tables ke liye common styles.
export const tableWrap = "overflow-x-auto rounded-2xl border border-line bg-surface shadow-card";
export const thCls = "px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted";
export const tdCls = "px-4 py-3";
export const rowCls = "border-t border-line transition hover:bg-surface-2/60";

export function fmtDate(d: string | null | undefined) {
  return d ? new Date(d).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : "—";
}

export function dateInput(d: string | null | undefined) {
  return d ? new Date(d).toISOString().slice(0, 10) : "";
}
