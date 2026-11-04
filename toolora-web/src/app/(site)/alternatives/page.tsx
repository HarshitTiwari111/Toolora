import { SectionIndexPage } from "@/components/SectionPages";
import { pageMetadata } from "@/lib/seo";
import { sections } from "@/lib/sections";

export const metadata = pageMetadata({
  title: sections["alternatives"].label,
  description: sections["alternatives"].description,
  path: "/alternatives/",
});

export default function Page() {
  return <SectionIndexPage section="alternatives" />;
}
