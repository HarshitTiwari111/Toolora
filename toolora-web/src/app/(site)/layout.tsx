import Header from "@/components/Header";
import Footer from "@/components/Footer";
import JsonLd from "@/components/site/JsonLd";
import { organizationJsonLd, websiteJsonLd } from "@/lib/seo";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="site flex min-h-screen flex-1 flex-col">
      <JsonLd data={[organizationJsonLd(), websiteJsonLd()]} />
      <Header />
      <main id="main" className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
}
