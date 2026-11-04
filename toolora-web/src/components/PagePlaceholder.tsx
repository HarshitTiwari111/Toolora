import { Clock } from "lucide-react";
import Breadcrumbs, { type Crumb } from "./Breadcrumbs";

// Temporary page. Part 3 me real templates isko replace karenge.
export default function PagePlaceholder({
  title,
  pageType,
  crumbs,
  children,
}: {
  title: string;
  pageType: string;
  crumbs: Crumb[];
  children?: React.ReactNode;
}) {
  return (
    <>
      <div className="hero-glow border-b border-line">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-10 pb-10 pt-8">
          <Breadcrumbs items={crumbs} />
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-accent">{pageType}</p>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{title}</h1>
          <p className="mt-3 inline-flex items-center gap-2 text-sm text-muted">
            <Clock className="h-4 w-4" /> Content for this page is being researched and reviewed.
          </p>
        </div>
      </div>
      {children && <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-10 py-10">{children}</div>}
    </>
  );
}
