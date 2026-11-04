import Link from "next/link";
import { aiCategories, saasCategories, siteConfig, trustPages } from "@/lib/site";
import Logo from "./Logo";

function Column({ title, links }: { title: string; links: { href: string; label: string }[] }) {
  return (
    <div>
      <h2 className="mb-4 text-xs font-bold uppercase tracking-widest text-label">{title}</h2>
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
      <div className="mx-auto grid max-w-[1600px] gap-10 px-4 py-14 sm:grid-cols-2 sm:px-6 lg:grid-cols-5 lg:px-10">
        <div className="lg:col-span-1">
          <Logo tone="light" />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-ink-muted">{siteConfig.description}</p>
        </div>
        <Column title="AI tools" links={aiCategories.slice(0, 6).map((c) => ({ href: `/ai-tools/${c.slug}/`, label: c.name }))} />
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
        <Column title="Company" links={trustPages.map((p) => ({ href: `/${p.slug}/`, label: p.title }))} />
      </div>
      <div className="border-t border-ink-line">
        <p className="mx-auto max-w-[1600px] px-4 py-6 text-xs text-ink-muted sm:px-6 lg:px-10">
          © {new Date().getFullYear()} {siteConfig.name}. Some links are affiliate links — we may earn a commission at no cost to you.{" "}
          <Link href="/affiliate-disclosure/" className="underline underline-offset-2 hover:text-white">
            Disclosure
          </Link>
          .
        </p>
      </div>
    </footer>
  );
}
