import { SectionIndexPage } from "@/components/SectionPages";
import { pageMetadata } from "@/lib/seo";
import { sections } from "@/lib/sections";

export const metadata = pageMetadata({
  title: sections["saas-compare"].label,
  description: sections["saas-compare"].description,
  path: "/saas-compare/",
});

export default function Page() {
  return <SectionIndexPage section="saas-compare" />;
}
