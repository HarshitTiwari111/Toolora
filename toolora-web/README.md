# Toolora.ai — web (Next.js)

Toolora.ai ka frontend: Next.js 15 (React 19, App Router) + TypeScript + Tailwind.
Data `../toolora-api` (Express + MongoDB) se aata hai.

## Stack (SEO-safe MERN)

| Layer | Tech | Folder |
|---|---|---|
| Database | MongoDB | local service / Atlas |
| Backend API | Express + Node + Mongoose | `toolora-api` |
| Frontend | Next.js (server-rendered React) | `toolora-web` |

## Run locally

```bash
# 1) API (alag terminal me)
cd ../toolora-api && npm install && npm run dev

# 2) Web
npm install
cp .env.example .env.local
npm run dev
```

Open http://localhost:3000. Connection check: http://localhost:3000/api-test/

Admin panel: http://localhost:3000/admin/ (login `toolora-api/.env` ke `ADMIN_EMAIL` / `ADMIN_PASSWORD` se; user `npm run create-admin` se banta hai).

## Environment variables

| Variable | Kaam |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | Site ka public URL |
| `NEXT_PUBLIC_SITE_INDEXABLE` | `true` sirf launch par; warna poori site `noindex` |
| `API_URL` | toolora-api ka URL (server-only) |

## Routes (PDF section 3)

- AI: `/ai-tools/`, `/ai-tools/{category or brand}/`, `/reviews/{brand}-review/`, `/compare/{a}-vs-{b}/`, `/alternatives/{brand}/`, `/guides/{topic}/`
- SaaS: `/saas/`, `/saas/{category or brand}/`, `/saas-reviews/`, `/saas-compare/`, `/saas-alternatives/`, `/saas-guides/`
- Trust: `/about/`, `/editorial-policy/`, `/how-we-review/`, `/contact/`, `/privacy-policy/`, `/terms/`, `/affiliate-disclosure/`, `/corrections/`

Categories `src/lib/site.ts` me hain.

## Public pages (Part 3)

- `/ai-tools/{category}/`, `/saas/{category}/` — active products, pricing / platform / use case filters (filtered URLs `noindex`).
- `/search/?q=` — site search (active products + published articles), `noindex`.
- `/ai-tools/{brand}/`, `/saas/{brand}/` — profile: at a glance, verified facts (source + checked date), related articles, alternatives.
- `/reviews|compare|alternatives|guides/{slug}/` (+ `saas-*`) — published articles only; compare articles get a side-by-side table.
- Article HTML `src/lib/sanitize.ts` se saaf hota hai (scripts, iframes, event handlers hat jaate hain).
- Affiliate links `rel="sponsored nofollow"` + disclosure.
- Admin me save/publish/unpublish → `revalidateTag("content")` → website turant update.
- Content pages request par render hote hain (`connection()`), isliye build ke waqt API ki zaroorat nahi.

## Admin panel (`/admin`)

- Login sirf editors ke liye; JWT httpOnly cookie me (path `/admin`), browser API se seedha baat nahi karta.
- Pages: Dashboard, Articles (draft → in review → approved → published), Products + source facts, Topic queue, Workflow logs.
- Poora `/admin` noindex (`X-Robots-Tag` + meta robots).

## Project parts

1. **Setup + foundation** ← done (layout, routes, API + MongoDB connection)
2. **Data model + admin panel** ← done (6 models, public/admin/automation API, /admin)
3. **Page templates** ← done (category hubs + filters, product profiles, article pages, sanitized HTML, instant refresh)
4. SEO foundation (sitemap, schema, canonical)
5. Topic queue + keywords
6. n8n automation
7. Launch
