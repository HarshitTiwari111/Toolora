import Link from "next/link";
import { ChevronDown, Menu, Search, ShieldCheck } from "lucide-react";
import { mainNav } from "@/lib/site";
import Logo from "./Logo";
import CategoryIcon from "./CategoryIcon";
import { tone } from "@/lib/theme";

// Reference jaisa dark header: dropdown menus (CSS hover/focus, JS ke bina) + mobile <details> menu.
export default function Header() {
  return (
    <header className="sticky top-0 z-40">
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-2 focus:z-50 focus:rounded-lg focus:bg-white focus:px-3 focus:py-2 focus:text-ink">
        Skip to content
      </a>
      <div className="bg-accent text-white">
        <p className="mx-auto flex max-w-[1600px] items-center justify-center gap-2 px-4 py-2 text-center text-xs font-medium sm:text-sm">
          <ShieldCheck className="hidden h-4 w-4 sm:block" />
          <span className="sm:hidden">Prices checked on official sites.</span>
          <span className="hidden sm:inline">We copy prices from official pricing pages and show the date we checked.</span>
          <Link href="/how-we-review/" className="rounded-md bg-label px-2 py-0.5 font-semibold text-ink">
            How we review
          </Link>
        </p>
      </div>

      <div className="border-b border-ink-line bg-ink text-white">
        <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-10">
          <Logo tone="light" />

          <nav aria-label="Main" className="hidden lg:block">
            <ul className="flex items-center gap-0.5 whitespace-nowrap text-sm font-medium xl:text-[15px]">
              {mainNav.map((item) =>
                item.menu ? (
                  <li key={item.href} className="group relative">
                    <Link
                      href={item.href}
                      className="flex items-center gap-1 whitespace-nowrap rounded-lg px-2.5 py-2 text-white/85 transition hover:bg-white/10 hover:text-white xl:px-3"
                      aria-haspopup="true"
                    >
                      {item.label} <ChevronDown className="h-3.5 w-3.5 opacity-70" />
                    </Link>
                    <div className="invisible absolute left-0 top-full z-50 pt-2 opacity-0 transition group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100">
                      <ul className="grid w-[34rem] grid-cols-2 gap-1 rounded-2xl border border-line bg-surface p-3 text-foreground shadow-2xl">
                        {item.menu.slice(1).map((m) => {
                          const slug = m.href.split("/").filter(Boolean).pop() ?? "";
                          const t = tone(slug);
                          return (
                            <li key={m.href}>
                              <Link href={m.href} className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm font-medium transition hover:bg-surface-2">
                                <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md" style={{ background: t.soft, color: t.ink }}>
                                  <CategoryIcon slug={slug} className="h-4 w-4" />
                                </span>
                                {m.label}
                              </Link>
                            </li>
                          );
                        })}
                        <li className="col-span-2 mt-1 border-t border-line pt-2">
                          <Link href={item.menu[0].href} className="block rounded-lg px-2.5 py-2 text-sm font-bold text-accent hover:bg-surface-2">
                            {item.menu[0].label} →
                          </Link>
                        </li>
                      </ul>
                    </div>
                  </li>
                ) : (
                  <li key={item.href}>
                    <Link href={item.href} className="block whitespace-nowrap rounded-lg px-2.5 py-2 text-white/85 transition hover:bg-white/10 hover:text-white xl:px-3">
                      {item.label}
                    </Link>
                  </li>
                ),
              )}
            </ul>
          </nav>

          <div className="flex items-center gap-2">
            <Link href="/search/" aria-label="Search" className="rounded-lg p-2 text-white/85 transition hover:bg-white/10 hover:text-white">
              <Search className="h-5 w-5" />
            </Link>
            <Link
              href="/ai-tools/"
              className="hidden whitespace-nowrap rounded-lg border border-white/80 px-4 py-2 text-sm font-bold uppercase tracking-wide transition hover:bg-white hover:text-ink sm:block lg:hidden xl:block"
            >
              Explore tools
            </Link>

            {/* Mobile menu */}
            <details className="group relative lg:hidden">
              <summary aria-label="Open menu" className="list-none rounded-lg p-2 text-white/85 marker:hidden hover:bg-white/10 [&::-webkit-details-marker]:hidden">
                <Menu className="h-6 w-6" />
              </summary>
              <nav
                aria-label="Mobile"
                className="no-scrollbar absolute right-0 top-full mt-3 max-h-[75vh] w-[min(20rem,calc(100vw-2rem))] overflow-y-auto rounded-2xl border border-line bg-surface p-3 text-foreground shadow-2xl"
              >
                <ul className="space-y-1 text-sm">
                  {mainNav.map((item) => (
                    <li key={item.href}>
                      <Link href={item.href} className="block rounded-lg px-3 py-2 font-semibold hover:bg-surface-2">
                        {item.label}
                      </Link>
                      {item.menu && (
                        <ul className="mb-2 ml-3 border-l border-line pl-2">
                          {item.menu.slice(1).map((m) => (
                            <li key={m.href}>
                              <Link href={m.href} className="block rounded-lg px-3 py-1.5 text-muted hover:bg-surface-2 hover:text-foreground">
                                {m.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                    </li>
                  ))}
                </ul>
              </nav>
            </details>
          </div>
        </div>
      </div>
    </header>
  );
}
