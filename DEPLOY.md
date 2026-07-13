# Deploy Guide — SADEAN

## Arsitektur

```
Vercel (Frontend) ←→ Railway/VPS (API) ←→ Supabase (DB + Storage)
```

---

## 1. Database — Sudah siap di Supabase

Tidak perlu setup apa-apa. DB udah running.

---

## 2. Backend — API (NestJS)

### Opsi A: Railway (recommended, gratis)
1. Push repo ke GitHub
2. Login https://railway.app → New Project → Deploy from GitHub
3. Pilih repo, set Root Directory = `apps/api`
4. Start Command: `node dist/main`
5. Set environment variables di dashboard Railway:
   ```
   NODE_ENV=production
   DATABASE_URL=postgresql://postgres.iwklzxtakqedshykjckf:[PASSWORD]@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres?schema=sadean&sslmode=require
   JWT_SECRET=<generate_random_64_char_hex>
   JWT_EXPIRATION=15m
   JWT_REFRESH_SECRET=<generate_different_random_64_char_hex>
   JWT_REFRESH_EXPIRATION=30d
   SUPABASE_URL=https://iwklzxtakqedshykjckf.supabase.co
   SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml3a2x6eHRha3FlZHNoeWtqY2tmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM5NTQ0NzMsImV4cCI6MjA5OTUzMDQ3M30.301TVSuXjswJ5KD9EFsSsWPaMUzqV1yPCQuKWj8IzLM
   SUPABASE_SERVICE_ROLE_KEY=<ambil_dari_dashboard_supabase>
   SUPABASE_STORAGE_BUCKET=sadean
   REDIS_URL=<optional>
   CORS_ORIGIN=<vercel_domain>
   THROTTLE_TTL=60000
   THROTTLE_LIMIT=100
   ```
6. **Ambil `SUPABASE_SERVICE_ROLE_KEY`**: Dashboard Supabase → Project Settings → API → `service_role` key
7. Railway auto-deploy tiap push ke main

### Opsi B: Docker VPS
```bash
docker build -t sadean-api apps/api
docker run -d --name sadean-api -p 3001:3001 \
  -e DATABASE_URL="..." \
  -e JWT_SECRET="..." \
  sadean-api
```

---

## 3. Frontend — Vercel

### Cara setup
1. Push repo ke GitHub
2. Login https://vercel.com → Add New Project
3. Import repository SADEAN
4. **Root Directory**: pilih `apps/web`
5. **Framework**: Next.js (otomatis terdeteksi)
6. Environment Variables:
   ```
   NEXT_PUBLIC_API_URL=https://api-anda.railway.app/api/v1
   NEXT_PUBLIC_APP_NAME=SADEAN
   NEXT_PUBLIC_APP_URL=https://sadean.vercel.app
   ```
7. Deploy

> `vercel.json` udah ada di `apps/web/vercel.json` — auto-configured.

---

## 4. Environment Variables (ringkasan)

### API (.env)
| Variable | Value |
|---|---|
| `DATABASE_URL` | `postgresql://postgres.iwklzxtakqedshykjckf:PASSWORD@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres?schema=sadean&sslmode=require` |
| `JWT_SECRET` | Generate a unique 64-character hexadecimal secret |
| `SUPABASE_URL` | `https://iwklzxtakqedshykjckf.supabase.co` |
| `SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` |
| `CORS_ORIGIN` | URL Vercel setelah deploy |

### Web (.env.local)
| Variable | Value |
|---|---|
| `NEXT_PUBLIC_API_URL` | URL API setelah deploy + `/api/v1` |
| `NEXT_PUBLIC_APP_NAME` | SADEAN |
| `NEXT_PUBLIC_APP_URL` | URL Vercel |

---

## 5. Setelah Deploy

1. **Update CORS**: Set `CORS_ORIGIN` di API ke domain Vercel
2. **Update `NEXT_PUBLIC_API_URL`** di Vercel env vars ke URL API yang sudah deploy
3. **Domain kustom** (opsional): Beli domain → pointing ke Vercel
4. **Test**: Buka website → register seller → upload produk → checkout

---

## 6. Monitoring

- Vercel Dashboard: Analytics, Logs
- Railway Dashboard: Metrics, Logs
- Supabase Dashboard: DB logs, Auth, Storage

---

## 7. Rollback

- **Vercel**: Instant rollback dari dashboard (pilih deployment sebelumnya)
- **Railway**: Deploy previous commit dari GitHub
- **Database**: `supabase_merge_branch` atau restore dari backup
