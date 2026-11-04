import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Category } from "@/lib/site";
import CategoryIcon from "./CategoryIcon";

export default function CategoryGrid({ base, categories }: { base: string; categories: Category[] }) {
  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
      {categories.map((c) => (
        <li key={c.slug}>
          <Link
            href={`${base}/${c.slug}/`}
            className="group flex h-full items-start gap-4 rounded-2xl border border-line bg-surface p-5 shadow-card transition hover:-translate-y-0.5 hover:border-accent/50"
          >
            <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent-soft text-accent">
              <CategoryIcon slug={c.slug} />
            </span>
            <span className="min-w-0 flex-1">
              <span className="flex items-center justify-between gap-2 font-semibold">
                {c.name}
                <ArrowUpRight className="h-4 w-4 text-muted opacity-0 transition group-hover:opacity-100" />
              </span>
              <span className="mt-1 block text-sm text-muted">{c.description}</span>
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
