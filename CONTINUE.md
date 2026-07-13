# Cara Melanjutkan Sesi

Buka opencode di terminal lalu jalankan:

```
opencode
```

Lalu cukup ketik:

> **lanjut**

---

## Yang Perlu Diketahui untuk Sesi Baru

### Stack
- Monorepo Turborepo: `apps/web` (Next.js 14), `apps/api` (NestJS 11)
- Database: Supabase PostgreSQL (schema `sadean`)
- Storage: Supabase Storage (bucket `sadean`)
- ORM: Prisma 5
- PWA: @serwist/next v9

### Build
```powershell
# API
cd apps/api && npm run build

# Web
cd apps/web && npm run build
```

### Env
- `apps/web/.env.local` — `NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1`
- `.env`, `apps/api/.env` — Supabase credentials + DATABASE_URL

### Catatan Penting
- Koneksi lokal ke Supabase PostgreSQL tidak bisa (IPv6-only), akses via MCP tools / Supabase API
- Semua perubahan schema DB via `supabase_apply_migration` (bukan prisma migrate)
- Prisma sudah `db pull` & `db generate`, model di `schema.prisma` harus sinkron dengan DB Supabase
- JWT cookie name: `sadean_token`
- Format harga: IDR (Intl.NumberFormat 'id-ID')
- Global prefix API: `/api/v1`
- Health check: `GET /api/v1/health`

### 🔧 Fix sebelum deploy (SUDAH)
- ✅ `DATABASE_URL` → pooler Supabase (session mode port 5432)
- ✅ `binaryTargets` Prisma → `["native", "linux-musl"]` untuk Docker Alpine
- ✅ JWT secrets → random 64-char hex
- ✅ `NODE_ENV=production` di `.env`
- ✅ `.dockerignore` — exclude node_modules, .next, dist, git
- ✅ ESLint `ignoreDuringBuilds: true` di next.config.js
- ✅ `@typescript-eslint` plugin di root devDependencies
- ✅ Health check endpoint `GET /api/v1/health`
- ✅ CI deploy steps — Prisma migrate + build untuk staging/production
- ✅ `.env.example` — update pakai Supabase Storage (bukan MinIO)

### ⚠️ Perlu dicek manual sebelum deploy
- 🔲 **Pooler connection** — coba konek dari Supabase dashboard → Connect → Session pooler, copy URL langsung
- 🔲 **CORS_ORIGIN** — set ke domain production (contoh: `https://sadean.com`)
- 🔲 **Supabase RLS** — 13 table tanpa RLS, tapi akses via API backend (NestJS) jadi tidak terekspos langsung
- 🔲 **NEXT_PUBLIC_API_URL** — set ke production API URL
- 🔲 **APP_URL / CORS_ORIGIN di .env** — ganti dari localhost ke domain production

### Fitur yang SUDAH selesai
- Auth (login/register/logout, JWT, role-based)
- CRUD produk + upload gambar (Supabase Storage)
- CRUD kategori
- Cart (persistent DB) + Checkout
- Orders (buyer list, seller list, detail page) + Pagination
- Favorites
- Homepage (banner slider, featured products, latest sellers)
- Seller store profile (edit) + register (with logo upload)
- Dashboard (buyer, seller, admin)
- Admin panels (users, sellers moderation, products, banners)
- Search produk (debounced, filter kategori)
- Navbar (mobile hamburger + desktop dropdown)
- Profile user (edit) + avatar upload
- PWA (service worker, manifest, offline page)
- ISR (products/[slug] 60s, sellers/[slug] 120s)
- Middleware route protection (cookie-based)
- Upload banner/gambar di form admin — integrasi Supabase Storage
- Image gallery/carousel di product detail page

### Testing
- API: 8 test suites, 23 tests (✅ lulus semua)
- Utils: 17 tests (✅ lulus semua)
- Health check: `GET /api/v1/health`

### Deploy Readiness
Semua fitur inti selesai + build sukses.  
Sebelum deploy production: set `CORS_ORIGIN`, `NEXT_PUBLIC_API_URL`, `APP_URL` ke domain aktual.
