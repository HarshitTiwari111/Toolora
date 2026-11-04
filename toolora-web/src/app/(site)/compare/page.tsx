import { SectionIndexPage } from "@/components/SectionPages";
import { sections } from "@/lib/sections";

export const metadata = { title: sections["compare"].label, description: sections["compare"].description };

export default function Page() {
  return <SectionIndexPage section="compare" />;
}
