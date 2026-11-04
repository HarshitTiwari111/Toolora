import Link from "next/link";
import { aiCategories, saasCategories, siteConfig, trustPages } from "@/lib/site";
import Logo from "./Logo";

function Column({ title, links }: { title: string; links: { href: string; label: string }[] }) {
  return (
    <div>
      <h2 className="mb-3 text-sm font-semibold">{title}</h2>
      <ul className="space-y-2 text-sm">
        {links.map((l) => (
          <li key={l.href}>
            <Link href={l.href} className="text-muted transition hover:text-foreground">
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
    <footer className="mt-20 border-t border-line bg-surface">
      <div className="mx-auto grid max-w-[1600px] gap-10 px-4 sm:px-6 lg:px-10 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Logo />
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted">{siteConfig.description}</p>
        </div>
        <Column title="AI tools" links={aiCategories.slice(0, 6).map((c) => ({ href: `/ai-tools/${c.slug}/`, label: c.name }))} />
        <Column title="SaaS" links={saasCategories.slice(0, 6).map((c) => ({ href: `/saas/${c.slug}/`, label: c.name }))} />
        <Column title="Company" links={trustPages.map((p) => ({ href: `/${p.slug}/`, label: p.title }))} />
      </div>
      <div className="border-t border-line">
        <p className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-10 py-5 text-xs text-muted">
          © {new Date().getFullYear()} {siteConfig.name}. Some links may be affiliate links —{" "}
          <Link href="/affiliate-disclosure/" className="underline underline-offset-2 hover:text-foreground">
            see our disclosure
          </Link>
          .
        </p>
      </div>
    </footer>
  );
}
