import Link from "next/link";
import { aiCategories, saasCategories, siteConfig } from "@/lib/site";
import Logo from "./Logo";

type FooterLink = { href: string; label: string };

function Column({ title, links }: { title: string; links: FooterLink[] }) {
  return (
    <div>
      <h2 className="mb-3.5 text-[11px] font-bold uppercase tracking-[0.14em] text-label">{title}</h2>
      <ul className="space-y-2 text-sm">
        {links.map((l) => (
          <li key={l.href}>
            <Link href={l.href} className="text-ink-muted transition-colors hover:text-white">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

const columns: { title: string; links: FooterLink[] }[] = [
  { title: "AI tools", links: aiCategories.slice(0, 6).map((c) => ({ href: `/ai-tools/${c.slug}/`, label: c.name.replace(/^AI /, "") })) },
  { title: "SaaS", links: saasCategories.slice(0, 6).map((c) => ({ href: `/saas/${c.slug}/`, label: c.name })) },
  {
    title: "Read",
    links: [
      { href: "/blog/", label: "Blog" },
      { href: "/reviews/", label: "Reviews" },
      { href: "/compare/", label: "Comparisons" },
      { href: "/alternatives/", label: "Alternatives" },
      { href: "/guides/", label: "Guides" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/about/", label: "About" },
      { href: "/how-we-review/", label: "How we review" },
      { href: "/editorial-policy/", label: "Editorial policy" },
      { href: "/corrections/", label: "Corrections" },
      { href: "/contact/", label: "Contact" },
    ],
  },
  {
    title: "Legal",
    links: [
      { href: "/privacy-policy/", label: "Privacy policy" },
      { href: "/terms/", label: "Terms of use" },
      { href: "/affiliate-disclosure/", label: "Affiliate disclosure" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="relative bg-ink text-white">
      {/* Upar patli brand line: page aur footer ke beech saaf separation (khaali gap nahi). */}
      <div aria-hidden className="h-px bg-gradient-to-r from-transparent via-accent/60 to-transparent" />

      <div className="mx-auto grid max-w-[1600px] gap-x-8 gap-y-10 px-4 py-12 sm:px-6 md:grid-cols-[minmax(0,1.3fr)_minmax(0,3fr)] lg:px-10">
        <div className="max-w-xs">
          <Logo tone="light" />
          <p className="mt-4 text-sm leading-relaxed text-ink-muted">
            Reviews and comparisons of AI tools and business software. Independent, and not paid to rank anyone.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-3 lg:grid-cols-5">
          {columns.map((c) => (
            <Column key={c.title} title={c.title} links={c.links} />
          ))}
        </div>
      </div>

      <div className="border-t border-ink-line">
        <div className="mx-auto flex max-w-[1600px] flex-col gap-1.5 px-4 py-5 text-xs text-ink-muted sm:px-6 md:flex-row md:items-center md:justify-between lg:px-10">
          <p>
            © {new Date().getFullYear()} {siteConfig.name}. Product names are trademarks of their owners.
          </p>
          <p>
            Some links may be affiliate links.{" "}
            <Link href="/affiliate-disclosure/" className="underline underline-offset-2 hover:text-white">
              Learn more
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
