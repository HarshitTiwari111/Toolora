import Link from "next/link";
import {
  ArrowRight, BadgeCheck, CalendarCheck, CheckCircle2, CircleDollarSign, FileText, Link2, ListChecks, Scale, ShieldCheck,
} from "lucide-react";
import CategoryGrid from "@/components/CategoryGrid";
import ArticleCard from "@/components/site/ArticleCard";
import SearchForm from "@/components/site/SearchForm";
import { listArticles } from "@/lib/content";
import { aiCategories, saasCategories } from "@/lib/site";

const principles = [
  {
    icon: Link2,
    title: "Every claim has a source",
    text: "Pricing and features link to the vendor's official page, so you can check them yourself.",
  },
  {
    icon: CalendarCheck,
    title: "Dated, not stale",
    text: "Each fact shows when it was last verified, and pages are queued for regular refreshes.",
  },
  {
    icon: ShieldCheck,
    title: "Honest about method",
    text: "We say clearly when a page is research-based. No invented test results or star ratings.",
  },
  {
    icon: BadgeCheck,
    title: "Reviewed by an editor",
    text: "Nothing is published automatically. A human editor checks every page before it goes live.",
  },
];

// Hero ki right side: har product page me kya milega (real structure, koi fake data nahi).
const anatomy = [
  { icon: FileText, label: "Who it fits — and who it doesn't" },
  { icon: ListChecks, label: "Features checked against official docs" },
  { icon: CircleDollarSign, label: "Pricing with a \"checked on\" date" },
  { icon: Scale, label: "Pros, limitations and alternatives" },
  { icon: Link2, label: "Source links for every claim" },
];

function PageAnatomy() {
  return (
    <div className="relative hidden lg:block">
      <div aria-hidden className="absolute -inset-6 rounded-[2rem] bg-gradient-to-br from-accent/20 to-accent-2/10 blur-2xl" />
      <div className="relative rounded-3xl border border-line bg-surface p-7 shadow-card">
        <div className="mb-5 flex items-center justify-between">
          <p className="text-sm font-semibold">Every product page includes</p>
          <span className="rounded-full bg-accent-soft px-2.5 py-1 text-xs font-medium text-accent">Editor reviewed</span>
        </div>
        <ul className="space-y-3">
          {anatomy.map((a) => (
            <li key={a.label} className="flex items-center gap-3 rounded-2xl border border-line bg-background/60 p-3.5">
              <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-accent-soft text-accent">
                <a.icon className="h-4 w-4" />
              </span>
              <span className="text-sm font-medium">{a.label}</span>
              <CheckCircle2 className="ml-auto h-4 w-4 text-green-600" />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default async function Home() {
  const latest = (await listArticles({ limit: 4 })).items;
  return (
    <>
      <section className="hero-glow border-b border-line">
        <div className="mx-auto grid max-w-[1600px] items-center gap-12 px-4 pb-16 pt-14 sm:px-6 sm:pb-20 sm:pt-20 lg:grid-cols-[1.2fr_1fr] lg:px-10">
          <div>
          <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3 py-1 text-xs font-medium text-muted shadow-card">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" /> AI tools · SaaS · Reviews · Comparisons
          </p>
          <h1 className="max-w-4xl text-4xl font-bold leading-[1.1] tracking-tight sm:text-6xl">
            Find the right AI tool — <span className="text-gradient">with facts you can check.</span>
          </h1>
          <p className="mt-5 max-w-3xl text-lg leading-relaxed text-muted">
            Research-based overviews, comparisons and alternatives for AI tools and SaaS products. Every pricing and
            feature claim links to its source and shows when it was last verified.
          </p>
          <div className="mt-8">
            <SearchForm />
          </div>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              href="/ai-tools/"
              className="inline-flex items-center gap-2 rounded-xl bg-accent px-5 py-3 font-medium text-white shadow-card transition hover:opacity-90"
            >
              Browse AI tools <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/compare/"
              className="inline-flex items-center gap-2 rounded-xl border border-line bg-surface px-5 py-3 font-medium transition hover:border-accent/50"
            >
              Compare tools
            </Link>
          </div>
          </div>
          <PageAnatomy />
        </div>
      </section>

      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-10 py-14">
        <section className="mb-16">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">AI tools by category</h2>
              <p className="mt-1 text-muted">Start with what you need to get done.</p>
            </div>
            <Link href="/ai-tools/" className="inline-flex items-center gap-1 text-sm font-medium text-accent">
              All AI tools <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <CategoryGrid base="/ai-tools" categories={aiCategories} />
        </section>

        {latest.length > 0 && (
          <section className="mb-16">
            <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
              <div>
                <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Latest reviews & comparisons</h2>
                <p className="mt-1 text-muted">Recently published after editorial review.</p>
              </div>
              <Link href="/reviews/" className="inline-flex items-center gap-1 text-sm font-medium text-accent">
                All reviews <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {latest.map((a) => (
                <li key={a._id}>
                  <ArticleCard article={a} />
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className="mb-16 rounded-3xl border border-line bg-surface p-6 shadow-card sm:p-10">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">How Toolora.ai works</h2>
          <p className="mt-1 max-w-2xl text-muted">Useful first. Here is what you can expect from every page.</p>
          <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {principles.map((p) => (
              <li key={p.title}>
                <span className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-accent-soft text-accent">
                  <p.icon className="h-5 w-5" />
                </span>
                <h3 className="font-semibold">{p.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-muted">{p.text}</p>
              </li>
            ))}
          </ul>
          <Link href="/how-we-review/" className="mt-8 inline-flex items-center gap-1 text-sm font-medium text-accent">
            Read how we review <ArrowRight className="h-4 w-4" />
          </Link>
        </section>

        <section>
          <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">SaaS by business function</h2>
              <p className="mt-1 text-muted">Software for teams, with a look at their AI features.</p>
            </div>
            <Link href="/saas/" className="inline-flex items-center gap-1 text-sm font-medium text-accent">
              All SaaS <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <CategoryGrid base="/saas" categories={saasCategories} />
        </section>
      </div>
    </>
  );
}
