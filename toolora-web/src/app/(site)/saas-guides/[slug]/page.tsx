import type { Metadata } from "next";
import { SectionItemPage, sectionItemMetadata } from "@/components/SectionPages";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  return sectionItemMetadata("saas-guides", slug);
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  return <SectionItemPage section="saas-guides" slug={slug} />;
}
