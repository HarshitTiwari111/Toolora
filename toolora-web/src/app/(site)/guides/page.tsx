import { SectionIndexPage } from "@/components/SectionPages";
import { pageMetadata } from "@/lib/seo";
import { sections } from "@/lib/sections";

export const metadata = pageMetadata({
  title: sections["guides"].label,
  description: sections["guides"].description,
  path: "/guides/",
});

export default function Page() {
  return <SectionIndexPage section="guides" />;
}
