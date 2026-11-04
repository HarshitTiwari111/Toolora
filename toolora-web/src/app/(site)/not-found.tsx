import Link from "next/link";
import { SearchX } from "lucide-react";

// Page ke andar notFound() (jaise draft product) => ye UI, (site) layout ke header/footer ke saath.
export default function SiteNotFound() {
  return (
    <div className="mx-auto w-full max-w-[1600px] px-4 py-24 text-center sm:px-6 lg:px-10">
      <span className="mx-auto mb-5 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-accent-soft text-accent">
        <SearchX className="h-7 w-7" />
      </span>
      <p className="text-sm font-semibold text-accent">404</p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight">Page not found</h1>
      <p className="mx-auto mt-3 max-w-md text-muted">
        This page doesn&apos;t exist, or it isn&apos;t published yet.
      </p>
      <div className="mt-7 flex flex-wrap justify-center gap-3">
        <Link href="/" className="rounded-xl bg-accent px-5 py-2.5 font-medium text-white">Back to home</Link>
        <Link href="/ai-tools/" className="rounded-xl border border-line bg-surface px-5 py-2.5 font-medium">Browse AI tools</Link>
      </div>
    </div>
  );
}
