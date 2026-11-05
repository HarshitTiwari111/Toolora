import Link from "next/link";
import { ArrowRight, CalendarCheck, ExternalLink, FileText, Monitor } from "lucide-react";
import type { ArticleSummary, PublicProduct } from "@/lib/content";
import { categoryName, fmtDate, platformName, pricingLabels } from "@/lib/labels";
import { tone } from "@/lib/theme";

// Category page ka wide tool card: kam tools hon tab bhi page bhara aur useful lage.
// Koi rank/score nahi (PDF: no paid rankings, no invented ratings).
export default function ToolListCard({ product: p, review }: { product: PublicProduct; review?: ArticleSummary }) {
  const t = tone(p.categories[0] ?? p.productType);
  const affiliate = Boolean(p.affiliateUrl);
  return (
    <article className="group relative overflow-hidden rounded-2xl border border-line bg-surface shadow-card transition hover:-translate-y-0.5 hover:shadow-lg">
      <span aria-hidden className="absolute inset-y-0 left-0 w-1.5" style={{ background: `linear-gradient(${t.from}, ${t.to})` }} />
      <div className="grid gap-5 p-5 pl-7 sm:p-6 sm:pl-8 md:grid-cols-[minmax(0,1fr)_auto] md:items-center">
        <div className="flex gap-4">
          <span
            aria-hidden
            className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-2xl font-bold text-white shadow-md"
            style={{ background: `linear-gradient(135deg, ${t.from}, ${t.to})` }}
          >
            {p.brandName.trim().charAt(0).toUpperCase()}
          </span>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
              <h3 className="text-xl font-bold tracking-tight">
                <Link href={p.url} className="hover:text-accent">
                  {p.brandName}
                </Link>
              </h3>
              <span className="rounded-full px-2.5 py-0.5 text-xs font-semibold" style={{ background: t.soft, color: t.ink }}>
                {pricingLabels[p.pricingModel]}
              </span>
              <span className="text-xs text-muted">{p.categories.map((c) => categoryName(p.productType, c)).join(" · ")}</span>
            </div>
            {p.shortDescription && <p className="mt-2 text-[15px] leading-relaxed text-muted">{p.shortDescription}</p>}

            <dl className="mt-3.5 flex flex-wrap gap-x-6 gap-y-2 text-sm">
              {p.useCases.length > 0 && (
                <div className="flex flex-wrap items-center gap-1.5">
                  <dt className="font-semibold">Best for</dt>
                  {p.useCases.slice(0, 3).map((u) => (
                    <dd key={u} className="rounded-md bg-surface-2 px-2 py-0.5 text-xs text-muted">
                      {u}
                    </dd>
                  ))}
                </div>
              )}
              {p.platforms.length > 0 && (
                <div className="flex items-center gap-1.5 text-muted">
                  <dt className="sr-only">Platforms</dt>
                  <Monitor className="h-4 w-4 shrink-0" aria-hidden />
                  <dd>{p.platforms.map(platformName).join(", ")}</dd>
                </div>
              )}
              {p.lastVerifiedAt && (
                <div className="flex items-center gap-1.5 text-muted">
                  <dt className="sr-only">Facts checked</dt>
                  <CalendarCheck className="h-4 w-4 shrink-0 text-emerald-600" aria-hidden />
                  <dd>Facts checked {fmtDate(p.lastVerifiedAt)}</dd>
                </div>
              )}
            </dl>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 md:w-48 md:flex-col md:items-stretch">
          {review && (
            <Link
              href={review.url}
              className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-ink px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-ink/85"
            >
              <FileText className="h-4 w-4" /> Read review
            </Link>
          )}
          <a
            href={affiliate ? p.affiliateUrl : p.officialUrl}
            target="_blank"
            rel={affiliate ? "sponsored nofollow noopener noreferrer" : "noopener noreferrer"}
            className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-line px-4 py-2.5 text-sm font-semibold transition hover:border-accent hover:text-accent"
          >
            Visit site <ExternalLink className="h-3.5 w-3.5" />
          </a>
          <Link href={p.url} className="inline-flex items-center justify-center gap-1 px-2 py-1.5 text-sm font-medium text-accent hover:underline">
            Full profile <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </article>
  );
}
