import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { aiCategories, saasCategories, siteConfig } from "@/lib/site";
import Logo from "./Logo";

function Column({ title, links }: { title: string; links: { href: string; label: string }[] }) {
  return (
    <div>
      <h2 className="mb-4 text-xs font-extrabold uppercase tracking-widest text-label">{title}</h2>
      <ul className="space-y-2.5 text-sm">
        {links.map((l) => (
          <li key={l.href}>
            <Link href={l.href} className="text-ink-muted transition hover:text-white">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Footer() {
  return (
    <footer className="mt-20 bg-ink text-white">
      <div className="mx-auto grid max-w-[1600px] gap-10 px-4 py-16 sm:grid-cols-2 sm:px-6 lg:grid-cols-[1.4fr_repeat(5,1fr)] lg:px-10">
        <div className="sm:col-span-2 lg:col-span-1">
          <Logo tone="light" />
          <p className="mt-4 font-semibold">Find, compare &amp; choose the right AI tools.</p>
          <p className="mt-2 max-w-xs text-sm leading-relaxed text-ink-muted">{siteConfig.description}</p>
          <Link href="/ai-tools/" className="mt-5 inline-flex items-center gap-2 rounded-full bg-label px-5 py-2.5 text-sm font-bold text-ink transition hover:brightness-95">
            Explore AI tools <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <Column title="Popular" links={aiCategories.slice(0, 6).map((c) => ({ href: `/ai-tools/${c.slug}/`, label: `Best ${c.name} tools` }))} />
        <Column title="SaaS" links={saasCategories.slice(0, 6).map((c) => ({ href: `/saas/${c.slug}/`, label: c.name }))} />
        <Column
          title="Read"
          links={[
            { href: "/blog/", label: "Blog" },
            { href: "/reviews/", label: "Reviews" },
            { href: "/compare/", label: "Comparisons" },
            { href: "/alternatives/", label: "Alternatives" },
            { href: "/guides/", label: "Guides" },
            { href: "/search/", label: "Search" },
          ]}
        />
        <Column
          title="Trust"
          links={[
            { href: "/about/", label: "About" },
            { href: "/editorial-policy/", label: "Editorial Policy" },
            { href: "/how-we-review/", label: "How We Review" },
            { href: "/affiliate-disclosure/", label: "Affiliate Disclosure" },
            { href: "/corrections/", label: "Corrections" },
          ]}
        />
        <Column
          title="Legal"
          links={[
            { href: "/privacy-policy/", label: "Privacy Policy" },
            { href: "/terms/", label: "Terms of Use" },
            { href: "/contact/", label: "Contact" },
          ]}
        />
      </div>
      <div className="border-t border-ink-line">
        <div className="mx-auto flex max-w-[1600px] flex-col gap-2 px-4 py-6 text-xs text-ink-muted sm:px-6 lg:px-10">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p>© {new Date().getFullYear()} {siteConfig.name}. All rights reserved.</p>
            <p>
              Some links are affiliate links. We may earn a commission at no extra cost to you.{" "}
              <Link href="/affiliate-disclosure/" className="underline underline-offset-2 hover:text-white">
                Read our affiliate disclosure
              </Link>
              .
            </p>
          </div>
          <p>Product names and logos are trademarks of their respective owners and are used only to identify the products we review. No endorsement is implied.</p>
        </div>
      </div>
    </footer>
  );
}
