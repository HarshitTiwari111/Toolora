import ArticleCard from "./site/ArticleCard";
import PageHeader, { EmptyState, container } from "./site/PageHeader";
import { listArticles } from "@/lib/content";
import { sections, type SectionKey } from "@/lib/sections";

// Section list pages (/reviews/, /compare/ ...). Article page alag file me hai
// (SectionArticle.tsx) taaki list pages HTML sanitizer load na karein.
export async function SectionIndexPage({ section }: { section: SectionKey }) {
  const s = sections[section];
  const { items } = await listArticles({ articleType: s.articleType, productType: s.productType });
  return (
    <>
      <PageHeader crumbs={[{ label: s.label }]} eyebrow={s.area === "AI" ? "AI tools" : "SaaS"} title={s.label} description={s.description} />
      <div className={`${container} py-12`}>
        {items.length ? (
          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
            {items.map((a) => (
              <li key={a._id}>
                <ArticleCard article={a} />
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState title="Nothing published here yet" text="Articles appear once an editor has reviewed and approved them." />
        )}
      </div>
    </>
  );
}
