import { SectionIndexPage } from "@/components/SectionPages";
import { sections } from "@/lib/sections";

export const metadata = { title: sections["reviews"].label, description: sections["reviews"].description };

export default function Page() {
  return <SectionIndexPage section="reviews" />;
}
