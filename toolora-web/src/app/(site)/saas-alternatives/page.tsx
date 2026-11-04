import { SectionIndexPage } from "@/components/SectionPages";
import { pageMetadata } from "@/lib/seo";
import { sections } from "@/lib/sections";

export const metadata = pageMetadata({
  title: sections["saas-alternatives"].label,
  description: sections["saas-alternatives"].description,
  path: "/saas-alternatives/",
});

export default function Page() {
  return <SectionIndexPage section="saas-alternatives" />;
}
