import { SectionIndexPage } from "@/components/SectionPages";
import { pageMetadata } from "@/lib/seo";
import { sections } from "@/lib/sections";

export const metadata = pageMetadata({
  title: sections["reviews"].label,
  description: sections["reviews"].description,
  path: "/reviews/",
});

export default function Page() {
  return <SectionIndexPage section="reviews" />;
}
