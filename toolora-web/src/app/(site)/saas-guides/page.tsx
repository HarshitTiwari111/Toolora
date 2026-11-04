import { SectionIndexPage } from "@/components/SectionPages";
import { sections } from "@/lib/sections";

export const metadata = { title: sections["saas-guides"].label, description: sections["saas-guides"].description };

export default function Page() {
  return <SectionIndexPage section="saas-guides" />;
}
