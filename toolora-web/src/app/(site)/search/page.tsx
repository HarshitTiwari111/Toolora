import type { Metadata } from "next";
import ArticleCard from "@/components/site/ArticleCard";
import ProductCard from "@/components/site/ProductCard";
import PageHeader, { EmptyState, container } from "@/components/site/PageHeader";
import SearchForm from "@/components/site/SearchForm";
import { searchContent } from "@/lib/content";

// Search result pages index nahi hone chahiye (PDF section 8: search pages sitemap/index se bahar).
export const metadata: Metadata = { title: "Search", robots: { index: false, follow: true } };

type Props = { searchParams: Promise<{ q?: string }> };

export default async function SearchPage({ searchParams }: Props) {
  const q = ((await searchParams).q ?? "").slice(0, 80);
  const { products, articles } = await searchContent(q);
  const hasQuery = q.trim().length >= 2;
  const total = products.length + articles.length;

  return (
    <>
      <PageHeader
        crumbs={[{ label: "Search" }]}
        eyebrow="Search"
        title={hasQuery ? `Results for “${q}”` : "Search Toolora.ai"}
        description={hasQuery ? `${total} result${total === 1 ? "" : "s"}` : "Find AI tools, SaaS products, reviews and comparisons."}
        icon="search"
      >
        <div className="mt-6">
          <SearchForm defaultValue={q} autoFocus={!hasQuery} />
        </div>
      </PageHeader>

      <div className={`${container} space-y-12 py-12`}>
        {hasQuery && total === 0 && (
          <EmptyState title="No results" text="Try a brand name, a category like “writing”, or a use case like “meeting notes”." />
        )}
        {products.length > 0 && (
          <section>
            <h2 className="mb-5 text-2xl font-bold tracking-tight">Tools ({products.length})</h2>
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
              {products.map((p) => (
                <li key={p._id}>
                  <ProductCard product={p} />
                </li>
              ))}
            </ul>
          </section>
        )}
        {articles.length > 0 && (
          <section>
            <h2 className="mb-5 text-2xl font-bold tracking-tight">Articles ({articles.length})</h2>
            <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
              {articles.map((a) => (
                <li key={a._id}>
                  <ArticleCard article={a} />
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </>
  );
}
