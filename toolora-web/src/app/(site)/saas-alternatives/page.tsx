import { SectionIndexPage } from "@/components/SectionPages";
import { sections } from "@/lib/sections";

export const metadata = { title: sections["saas-alternatives"].label, description: sections["saas-alternatives"].description };

export default function Page() {
  return <SectionIndexPage section="saas-alternatives" />;
}
