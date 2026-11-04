import Link from "next/link";
import { ArrowUpRight, CalendarCheck } from "lucide-react";
import type { PublicProduct } from "@/lib/content";
import { categoryName, fmtDate, platformName, pricingLabels } from "@/lib/labels";
import BrandMark from "./BrandMark";

export default function ProductCard({ product: p }: { product: PublicProduct }) {
  return (
    <Link
      href={p.url}
      className="group flex h-full flex-col rounded-2xl border border-line bg-surface p-5 shadow-card transition hover:-translate-y-0.5 hover:border-accent/50"
    >
      <div className="flex items-start gap-3">
        <BrandMark name={p.brandName} />
        <div className="min-w-0 flex-1">
          <h3 className="flex items-center gap-1.5 font-semibold">
            <span className="truncate">{p.brandName}</span>
            <ArrowUpRight className="h-4 w-4 shrink-0 text-muted opacity-0 transition group-hover:opacity-100" />
          </h3>
          <p className="text-xs text-muted">{p.categories.map((c) => categoryName(p.productType, c)).join(" · ")}</p>
        </div>
      </div>
      {p.shortDescription && <p className="mt-3 line-clamp-2 text-sm text-muted">{p.shortDescription}</p>}
      <div className="mt-auto flex flex-wrap items-center gap-1.5 pt-4 text-xs">
        <span className="rounded-full bg-accent-soft px-2.5 py-1 font-medium text-accent">{pricingLabels[p.pricingModel]}</span>
        {p.platforms.slice(0, 3).map((pl) => (
          <span key={pl} className="rounded-full bg-surface-2 px-2.5 py-1 text-muted">
            {platformName(pl)}
          </span>
        ))}
        {p.lastVerifiedAt && (
          <span className="ml-auto inline-flex items-center gap-1 text-muted">
            <CalendarCheck className="h-3.5 w-3.5" /> {fmtDate(p.lastVerifiedAt)}
          </span>
        )}
      </div>
    </Link>
  );
}
