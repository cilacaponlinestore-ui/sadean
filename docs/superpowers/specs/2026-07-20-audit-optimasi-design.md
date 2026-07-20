# SADEAN Audit + Optimasi (Hot-path) — Design

**Date:** 2026-07-20  
**Approach:** B — Hot-path first + laporan ringkas  
**Output:** Laporan P0–P2 + fix high-impact

## Goal

Perbaiki bottleneck performance/security pre-deploy yang ROI tinggi tanpa rewrite stack atau dependency baru.

## Scope

### In (fix)

1. **Cart N+1** — `CartService.getCart` loop `product.findUnique` per item → satu `findMany` + Map
2. **Products list over-fetch** — `findAll` `category: true` → `select: { id, name, slug }`
3. **Public MemoryCache** — banners TTL 60s, categories TTL 300s; invalidate on write
4. **Bootstrap harden** — Swagger off di production (kecuali `SWAGGER_ENABLED=true`); `SUPER_ADMIN_EMAIL` dari env
5. **Laporan** — `docs/audit-optimasi-2026-07-20.md`

### Out

Redis, RLS Supabase rewrite, UI redesign, Lighthouse deep, admin rewrite, Prisma schema changes, Docker changes.

## Success criteria

- Cart: 1 query produk per `getCart` (bukan N)
- List products: category payload hanya id/name/slug
- Public GET banners/categories cache hit dalam TTL; clear setelah mutate
- Production: `/api/docs` tidak ter-setup kecuali flag
- Source: tidak ada email super_admin hardcode
- `npm test --workspace=apps/api` hijau

## Residual (laporan only)

| P | Item |
|---|------|
| P1 | Deploy env production (`CORS_ORIGIN`, `NEXT_PUBLIC_API_URL`, `APP_URL`) |
| P1 | Supabase RLS (akses via Nest — accepted risk atau enable later) |
| P2 | Search `contains` tanpa full-text index |
| P2 | Products count + findMany double query |
| P2 | Redis multi-instance ganti MemoryCache |
| P2 | Web image sizes / bundle audit |

## Risk

- Cache stale max 60–300s jika invalidate miss — mitigated by clear on write
- Seed super_admin no-op jika env kosong — operator set `SUPER_ADMIN_EMAIL` di prod
