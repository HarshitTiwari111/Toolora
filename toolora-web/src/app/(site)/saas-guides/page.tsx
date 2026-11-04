import { SectionIndexPage } from "@/components/SectionPages";
import { pageMetadata } from "@/lib/seo";
import { sections } from "@/lib/sections";

export const metadata = pageMetadata({
  title: sections["saas-guides"].label,
  description: sections["saas-guides"].description,
  path: "/saas-guides/",
});

export default function Page() {
  return <SectionIndexPage section="saas-guides" />;
}
