import type { Metadata } from "next";
import { DirectoryIndex } from "@/components/DirectoryPages";

type Props = { searchParams: Promise<{ pricing?: string; platform?: string; useCase?: string }> };

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const sp = await searchParams;
  const filtered = Boolean(sp.pricing || sp.platform || sp.useCase);
  return { title: "AI tools directory", robots: filtered ? { index: false, follow: true } : undefined };
}

export default async function Page({ searchParams }: Props) {
  const sp = await searchParams;
  return <DirectoryIndex area="ai" filters={{ pricing: sp.pricing, platform: sp.platform, useCase: sp.useCase }} />;
}
