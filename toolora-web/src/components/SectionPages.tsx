import ArticleCard from "./site/ArticleCard";
import PageHeader, { ExploreInstead, container } from "./site/PageHeader";
import { listArticles } from "@/lib/content";
import { sections, type SectionKey } from "@/lib/sections";

const ICONS: Record<string, string> = { review: "reviews", compare: "compare", alternatives: "alternatives", guide: "guides" };

// Section list pages (/reviews/, /compare/ ...). Article page alag file me hai
// (SectionArticle.tsx) taaki list pages HTML sanitizer load na karein.
export async function SectionIndexPage({ section }: { section: SectionKey }) {
  const s = sections[section];
  const { items } = await listArticles({ articleType: s.articleType, productType: s.productType });
  return (
    <>
      <PageHeader
        crumbs={[{ label: s.label }]}
        eyebrow={s.area === "AI" ? "AI tools" : "SaaS"}
        title={s.label}
        description={s.description}
        icon={ICONS[s.articleType]}
      >
        <p className="mt-5 text-sm text-ink-muted">
          <span className="font-bold text-white">{items.length}</span> published article{items.length === 1 ? "" : "s"}
        </p>
      </PageHeader>
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
          <ExploreInstead text="Articles here appear once an editor has reviewed and approved them. Meanwhile, explore the categories below." />
        )}
      </div>
    </>
  );
}
