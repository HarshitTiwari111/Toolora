# Toolora.ai — API (Express + MongoDB)

Backend for Toolora.ai. Next.js frontend (`../toolora-web`) aur n8n automation isi API se data lenge/bhejenge.

## Run locally

```bash
npm install
cp .env.example .env   # values check karein
npm run dev            # http://localhost:4000
```

MongoDB local service (`mongodb://127.0.0.1:27017/toolora`) ya MongoDB Atlas URI.

## Endpoints

**Public** (website ke liye, sirf `active` products aur `published` articles)

| Method | Path |
|---|---|
| GET | `/api/health` |
| GET | `/api/public/products?type=ai&category=writing&pricing=freemium` |
| GET | `/api/public/products/:slug` (facts + published articles ke saath) |
| GET | `/api/public/articles?articleType=review&productType=ai` |
| GET | `/api/public/articles/:productType/:articleType/:slug` |
| GET | `/api/public/inventory` (sitemap + internal-link URLs) |

**Admin** (`Authorization: Bearer <jwt>`, login se milta hai)

`POST /api/admin/auth/login` · `GET /auth/me` · `GET /stats` · products CRUD + `/products/:id/facts` ·
articles CRUD + `POST /articles/:id/status` · `/articles/:id/links` · topics CRUD + status · `GET /logs`

**Automation / n8n** (`x-api-key: AUTOMATION_API_KEY`) — sirf drafts, kabhi publish nahi

| Method | Path | PDF node |
|---|---|---|
| GET | `/api/automation/topics/next?limit=5` | 2, 4 |
| POST | `/api/automation/topics` (dedupe by topicKey) | 3 |
| POST | `/api/automation/topics/:id/status` (research/brief_ready/draft/qa only) | — |
| POST | `/api/automation/facts` (`productSlug` + fact) | 5 |
| POST | `/api/automation/articles/draft` (idempotent by topicKey) | 9 |
| POST | `/api/automation/articles/:id/links` | 8 |
| POST | `/api/automation/logs` | 10 |

## Publish gates (PDF section 7)

Article `published` tabhi hoga jab: body, meta title, meta description, kam se kam 1 source, disclosure aur
reviewer ho, aur koi open QA flag / claim-needing-review na ho. Warna API `422` deti hai.

## Admin user

`.env` me `ADMIN_EMAIL` / `ADMIN_PASSWORD` set karo, phir `npm run create-admin` (dobara chalane par password reset).

## Scripts

- `npm run dev` — watch mode (tsx)
- `npm run build` — TypeScript → `dist/`
- `npm start` — production run
- `npm run typecheck`
- `npm run create-admin` — admin user banao / password reset

## Security rules (PDF section 2)

- `.env` kabhi commit mat karo; keys sirf env me.
- CORS sirf `CORS_ORIGINS` wale frontend URLs ke liye.
- Drafts kabhi public endpoints se nahi niklenge (Part 2 me enforce hoga).
