import type { Metadata } from "next";
import { DirectorySlug, directoryMetadata } from "@/components/DirectoryPages";

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ pricing?: string; platform?: string; useCase?: string }>;
};

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const [{ slug }, sp] = await Promise.all([params, searchParams]);
  return directoryMetadata("saas", slug, Boolean(sp.pricing || sp.platform || sp.useCase));
}

export default async function Page({ params, searchParams }: Props) {
  const [{ slug }, sp] = await Promise.all([params, searchParams]);
  return <DirectorySlug area="saas" slug={slug} filters={{ pricing: sp.pricing, platform: sp.platform, useCase: sp.useCase }} />;
}
