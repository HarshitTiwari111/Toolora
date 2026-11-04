import { SectionIndexPage } from "@/components/SectionPages";
import { pageMetadata } from "@/lib/seo";
import { sections } from "@/lib/sections";

export const metadata = pageMetadata({
  title: sections["compare"].label,
  description: sections["compare"].description,
  path: "/compare/",
});

export default function Page() {
  return <SectionIndexPage section="compare" />;
}
