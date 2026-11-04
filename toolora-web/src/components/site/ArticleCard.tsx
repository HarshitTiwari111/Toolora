import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { ArticleSummary } from "@/lib/content";
import { articleTypeLabels, fmtDate } from "@/lib/labels";

export default function ArticleCard({ article: a }: { article: ArticleSummary }) {
  return (
    <Link
      href={a.url}
      className="group flex h-full flex-col rounded-2xl border border-line bg-surface p-6 shadow-card transition hover:-translate-y-0.5 hover:border-accent/50"
    >
      <p className="text-xs font-semibold uppercase tracking-wider text-accent">
        {a.productType === "saas" ? "SaaS " : ""}
        {articleTypeLabels[a.articleType]}
      </p>
      <h3 className="mt-2 text-lg font-semibold leading-snug">{a.title}</h3>
      {a.excerpt && <p className="mt-2 line-clamp-3 text-sm text-muted">{a.excerpt}</p>}
      <div className="mt-auto flex items-center justify-between pt-5 text-xs text-muted">
        <span>{fmtDate(a.updatedAt ?? a.publishedAt) && `Updated ${fmtDate(a.updatedAt ?? a.publishedAt)}`}</span>
        <span className="inline-flex items-center gap-1 font-medium text-accent">
          Read <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
        </span>
      </div>
    </Link>
  );
}
