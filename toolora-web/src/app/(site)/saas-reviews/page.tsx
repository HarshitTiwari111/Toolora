import { SectionIndexPage } from "@/components/SectionPages";
import { sections } from "@/lib/sections";

export const metadata = { title: sections["saas-reviews"].label, description: sections["saas-reviews"].description };

export default function Page() {
  return <SectionIndexPage section="saas-reviews" />;
}
