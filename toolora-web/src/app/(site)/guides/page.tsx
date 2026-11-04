import { SectionIndexPage } from "@/components/SectionPages";
import { sections } from "@/lib/sections";

export const metadata = { title: sections["guides"].label, description: sections["guides"].description };

export default function Page() {
  return <SectionIndexPage section="guides" />;
}
