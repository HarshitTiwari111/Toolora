import Link from "next/link";
import type { ArticleSummary } from "@/lib/content";
import { articleCategory, articleTypeLabels, fmtDate, initials } from "@/lib/labels";
import IllustratedCover from "./IllustratedCover";
import { categoryPhoto, photoSrcSet, photoUrl } from "@/lib/photos";

// Unsplash URL ho to alag widths ka srcset (mobile par chhoti file).
function unsplashSrcSet(url: string) {
  if (!url.startsWith("https://images.unsplash.com/")) return undefined;
  const base = url.split("?")[0];
  return [480, 800, 1200, 1600].map((w) => `${base}?auto=format&fit=crop&w=${w}&h=${Math.round((w * 9) / 16)}&q=75 ${w}w`).join(", ");
}

// Cover image ya (image na ho to) category icon wala gradient placeholder.
export function Cover({
  article: a,
  className = "",
  sizes = "(min-width: 1024px) 33vw, 100vw",
  priority = false,
  big = false,
}: {
  article: Omit<ArticleSummary, "products">;
  className?: string;
  sizes?: string;
  priority?: boolean;
  big?: boolean;
}) {
  const cat = articleCategory(a);
  // Khud ki cover image na ho to category ki Unsplash photo (har card alag dikhe).
  const photo = a.coverImageUrl ? undefined : categoryPhoto(cat?.slug);
  return (
    <div className={`relative overflow-hidden bg-ink ${className}`}>
      {a.coverImageUrl || photo ? (
        // eslint-disable-next-line @next/next/no-img-element -- editor kisi bhi host ki image URL de sakta hai
        <img
          src={a.coverImageUrl || photoUrl(photo!, 1200, 675)}
          srcSet={a.coverImageUrl ? unsplashSrcSet(a.coverImageUrl) : photoSrcSet(photo!)}
          alt={a.coverImageUrl ? a.coverImageAlt || a.title : photo!.alt}
          sizes={sizes}
          loading={priority ? "eager" : "lazy"}
          fetchPriority={priority ? "high" : "auto"}
          decoding="async"
          className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
        />
      ) : (
        <IllustratedCover category={cat?.slug} label={cat?.name.replace(/^AI /, "")} big={big} className="transition duration-500 group-hover:scale-[1.03]" />
      )}
      {(a.coverImageUrl || photo) && (
        <span aria-hidden className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/55 via-transparent to-ink/25" />
      )}
      {cat && (
        <span className="absolute left-3 top-3 rounded-md bg-ink/85 px-2 py-1 text-[11px] font-bold uppercase tracking-wider text-white backdrop-blur">
          {cat.name.replace(/^AI /, "")}
        </span>
      )}
      <span className="absolute bottom-3 left-3 rounded-md bg-label px-2 py-1 text-[11px] font-extrabold uppercase tracking-wider text-ink">
        {articleTypeLabels[a.articleType]}
      </span>
    </div>
  );
}

export function Byline({ author, date }: { author?: string; date?: string | null }) {
  const name = author || "Toolora Editorial Team";
  return (
    <div className="flex items-center gap-2.5 text-xs">
      <span aria-hidden className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-ink text-[11px] font-bold text-label">
        {initials(name)}
      </span>
      <span className="leading-tight">
        <span className="block font-semibold text-foreground">By {name}</span>
        {date && <span className="text-muted">Updated {fmtDate(date)}</span>}
      </span>
    </div>
  );
}

export default function ArticleCard({ article: a, priority = false }: { article: ArticleSummary; priority?: boolean }) {
  const cat = articleCategory(a);
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-surface shadow-card transition hover:-translate-y-0.5 hover:shadow-lg">
      <Link href={a.url} tabIndex={-1} aria-hidden>
        <Cover article={a} className="aspect-[16/9]" priority={priority} />
      </Link>
      <div className="flex flex-1 flex-col p-5">
        {cat && (
          <Link href={cat.href} className="mb-2 text-sm font-medium text-accent hover:underline">
            {cat.name}
          </Link>
        )}
        <h3 className="text-lg font-bold leading-snug">
          <Link href={a.url} className="hover:text-accent">
            {a.title}
          </Link>
        </h3>
        {a.excerpt && <p className="mt-2 line-clamp-2 text-sm text-muted">{a.excerpt}</p>}
        <div className="mt-auto border-t border-line pt-4">
          <div className="mt-0">
            <Byline author={a.author} date={a.updatedAt ?? a.publishedAt} />
          </div>
        </div>
      </div>
    </article>
  );
}

// Blog page ka bada featured card (image left, text right).
export function FeaturedCard({ article: a }: { article: ArticleSummary }) {
  const cat = articleCategory(a);
  return (
    <article className="group grid overflow-hidden rounded-2xl border border-line bg-surface shadow-card md:grid-cols-[1.05fr_1fr]">
      <Link href={a.url} tabIndex={-1} aria-hidden>
        <Cover article={a} className="aspect-[16/9] h-full md:aspect-auto md:min-h-[300px]" sizes="(min-width: 768px) 50vw, 100vw" priority />
      </Link>
      <div className="flex flex-col justify-center p-6 sm:p-8">
        {cat && (
          <Link href={cat.href} className="mb-2 text-sm font-medium text-accent hover:underline">
            {cat.name}
          </Link>
        )}
        <h2 className="font-serif text-2xl font-bold leading-tight sm:text-3xl">
          <Link href={a.url} className="hover:text-accent">
            {a.title}
          </Link>
        </h2>
        {a.excerpt && <p className="mt-3 text-muted">{a.excerpt}</p>}
        <div className="mt-5 border-t border-line pt-4">
          <Byline author={a.author} date={a.updatedAt ?? a.publishedAt} />
        </div>
      </div>
    </article>
  );
}

// Numbered list (Latest guides / Latest reviews boxes).
export function NumberedList({ title, items }: { title: string; items: ArticleSummary[] }) {
  return (
    <section className="overflow-hidden rounded-2xl border-2 border-ink bg-surface">
      <h2 className="bg-ink px-5 py-3 text-center text-sm font-extrabold uppercase tracking-widest text-label">{title}</h2>
      <ol>
        {items.map((a, i) => (
          <li key={a._id} className={`flex gap-4 border-t border-line px-5 py-4 ${i === 0 ? "bg-ink text-white" : ""}`}>
            <span className={`font-serif text-3xl font-bold leading-none ${i === 0 ? "text-label" : "text-muted"}`}>{i + 1}</span>
            <Link href={a.url} className={`font-semibold leading-snug hover:underline ${i === 0 ? "text-white" : ""}`}>
              {a.title}
            </Link>
          </li>
        ))}
      </ol>
    </section>
  );
}
