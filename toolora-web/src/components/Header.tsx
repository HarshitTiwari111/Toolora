import Link from "next/link";
import { Search } from "lucide-react";
import { mainNav } from "@/lib/site";
import Logo from "./Logo";

export default function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-surface shadow-[0_1px_0_0_var(--line)]">
      <div className="mx-auto flex max-w-[1600px] flex-wrap items-center justify-between gap-x-6 gap-y-2 px-4 sm:px-6 lg:px-10 py-3">
        <Logo />
        <nav aria-label="Main" className="no-scrollbar -mx-1 overflow-x-auto">
          <ul className="flex gap-1 text-sm font-medium">
            {mainNav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="block whitespace-nowrap rounded-lg px-3 py-2 text-muted transition hover:bg-surface-2 hover:text-foreground"
                >
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/search/"
                aria-label="Search"
                className="flex items-center gap-1.5 whitespace-nowrap rounded-lg px-3 py-2 text-muted transition hover:bg-surface-2 hover:text-foreground"
              >
                <Search className="h-4 w-4" />
                <span className="hidden md:inline">Search</span>
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
