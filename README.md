# Toolora.ai

AI tools discovery, reviews and comparisons (PDF: *Toolora AI SaaS Developer Guide*).

| Folder | Kya hai | Docs |
|---|---|---|
| `toolora-web/` | Next.js 15 website + `/admin` panel | [toolora-web/README.md](toolora-web/README.md) |
| `toolora-api/` | Express + MongoDB API (public, admin, n8n automation) | [toolora-api/README.md](toolora-api/README.md) |

## Local setup

```bash
# 1) API
cd toolora-api && npm install && cp .env.example .env   # values bharo
npm run create-admin
npm run dev            # http://localhost:4000

# 2) Website (naya terminal)
cd toolora-web && npm install && cp .env.example .env.local
npm run dev            # http://localhost:3000
```

Optional demo data: `cd toolora-api && npm run seed:demo` (hatana: `npm run seed:demo -- --clear`).

## Keyword research

`docs/keywords-brands.csv` (PDF ke 100 brands × 5 seed keywords) aur `docs/keywords-categories.csv` (18 categories). Search volume / difficulty columns keyword tool se bharne hain — andaaze nahi.

## Progress

1. Setup + foundation ✅
2. Data model + admin panel ✅
3. Page templates, search, filters ✅
3b. Blog redesign (reference: weblumbaai.com layout), logo, on-page SEO (canonical, OG, JSON-LD, sitemap.xml, robots.txt) ✅
4. SEO foundation (sitemap, schema, canonical) — next
5. Topic queue + keywords
6. n8n automation
7. Launch
