import { SectionIndexPage } from "@/components/SectionPages";
import { sections } from "@/lib/sections";

export const metadata = { title: sections["saas-compare"].label, description: sections["saas-compare"].description };

export default function Page() {
  return <SectionIndexPage section="saas-compare" />;
}
