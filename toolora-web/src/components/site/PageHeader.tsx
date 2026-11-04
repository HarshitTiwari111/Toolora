import Breadcrumbs, { type Crumb } from "../Breadcrumbs";

export const container = "mx-auto w-full max-w-[1600px] px-4 sm:px-6 lg:px-10";

export default function PageHeader({
  crumbs,
  eyebrow,
  title,
  description,
  children,
}: {
  crumbs: Crumb[];
  eyebrow?: string;
  title: string;
  description?: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <div className="hero-glow border-b border-line">
      <div className={`${container} pb-10 pt-8`}>
        <Breadcrumbs items={crumbs} />
        {eyebrow && <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-accent">{eyebrow}</p>}
        <h1 className="max-w-4xl text-3xl font-bold tracking-tight sm:text-5xl">{title}</h1>
        {description && <div className="mt-4 max-w-3xl text-lg leading-relaxed text-muted">{description}</div>}
        {children}
      </div>
    </div>
  );
}

export function EmptyState({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-line bg-surface px-6 py-14 text-center">
      <p className="font-semibold">{title}</p>
      <p className="mx-auto mt-1 max-w-md text-sm text-muted">{text}</p>
    </div>
  );
}
