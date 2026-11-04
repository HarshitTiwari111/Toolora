import { SectionIndexPage } from "@/components/SectionPages";
import { sections } from "@/lib/sections";

export const metadata = { title: sections["alternatives"].label, description: sections["alternatives"].description };

export default function Page() {
  return <SectionIndexPage section="alternatives" />;
}
