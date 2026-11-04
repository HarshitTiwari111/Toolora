import type { Metadata } from "next";
import { SectionItemPage, sectionItemMetadata } from "@/components/SectionPages";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  return sectionItemMetadata("reviews", slug);
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  return <SectionItemPage section="reviews" slug={slug} />;
}
