import { SectionIndexPage } from "@/components/SectionPages";
import { pageMetadata } from "@/lib/seo";
import { sections } from "@/lib/sections";

export const metadata = pageMetadata({
  title: sections["saas-reviews"].label,
  description: sections["saas-reviews"].description,
  path: "/saas-reviews/",
});

export default function Page() {
  return <SectionIndexPage section="saas-reviews" />;
}
