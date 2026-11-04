import { Search } from "lucide-react";

// Plain GET form: JS ke bina bhi chalta hai (/search/?q=...).
export default function SearchForm({ defaultValue = "", autoFocus = false }: { defaultValue?: string; autoFocus?: boolean }) {
  return (
    <form action="/search/" method="get" role="search" className="relative w-full max-w-2xl">
      <label htmlFor="site-search" className="sr-only">
        Search AI tools and articles
      </label>
      <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted" />
      <input
        id="site-search"
        name="q"
        type="search"
        defaultValue={defaultValue}
        autoFocus={autoFocus}
        minLength={2}
        maxLength={80}
        placeholder="Search tools, use cases or articles…"
        className="h-13 w-full rounded-2xl border border-line bg-surface py-3.5 pl-12 pr-28 text-base text-foreground shadow-card outline-none placeholder:text-muted transition focus:border-accent focus:ring-4 focus:ring-[var(--ring)]"
      />
      <button
        type="submit"
        className="absolute right-2 top-1/2 -translate-y-1/2 rounded-xl bg-accent px-4 py-2 text-sm font-medium text-white transition hover:opacity-90"
      >
        Search
      </button>
    </form>
  );
}
