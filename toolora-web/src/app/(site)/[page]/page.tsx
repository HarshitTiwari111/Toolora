import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PageHeader, { container } from "@/components/site/PageHeader";
import { trustPages } from "@/lib/site";
import { trustContent } from "@/lib/trust-content";
import { pageMetadata } from "@/lib/seo";

// Sirf PDF ke trust pages; baaki koi bhi top-level URL 404 dega.
export const dynamicParams = false;

export function generateStaticParams() {
  return trustPages.map((p) => ({ page: p.slug }));
}

type Props = { params: Promise<{ page: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { page } = await params;
  const p = trustPages.find((x) => x.slug === page);
  if (!p) return { title: "Page not found" };
  return pageMetadata({ title: p.title, description: trustContent[page]?.description, path: `/${p.slug}/` });
}

export default async function Page({ params }: Props) {
  const { page } = await params;
  const p = trustPages.find((x) => x.slug === page);
  if (!p) notFound();
  const content = trustContent[page];

  return (
    <>
      <PageHeader crumbs={[{ label: p.title }]} eyebrow="Toolora.ai" title={p.title} description={content?.description} icon="trust" />
      <div className={`${container} py-12`}>
        {content ? (
          <div className="article-body">{content.body}</div>
        ) : (
          <p className="max-w-2xl rounded-2xl border border-dashed border-line bg-surface p-6 text-muted">
            This page is being prepared and will be published before launch.
          </p>
        )}
      </div>
    </>
  );
}
