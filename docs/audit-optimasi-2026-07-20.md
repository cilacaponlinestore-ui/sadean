# SADEAN Audit + Optimasi — 2026-07-20

## Fixed this session

| P | Area | Change |
|---|------|--------|
| P0 | Cart N+1 | `getCart` uses single `product.findMany` + Map |
| P1 | Products list | category select `id`/`name`/`slug` only |
| P1 | Public cache | banners 60s, categories 300s + clear on write |
| P1 | Bootstrap | Swagger gated by `NODE_ENV` / `SWAGGER_ENABLED`; `SUPER_ADMIN_EMAIL` from env |

## Residual

| P | Item | Notes |
|---|------|-------|
| P1 | Deploy env | Set `CORS_ORIGIN`, `NEXT_PUBLIC_API_URL`, `APP_URL` for production |
| P1 | Supabase RLS | Tables without RLS; access via Nest only — accepted until enable |
| P2 | Search `contains` | No full-text index |
| P2 | Products count+findMany | Fine at small scale |
| P2 | Redis | Env has `REDIS_URL`; multi-instance needs shared cache |
| P2 | Web images/bundle | Later |

## Ops follow-up

1. Set `SUPER_ADMIN_EMAIL` in local and production secrets (was previously hardcoded)
2. Keep `SWAGGER_ENABLED=false` (or unset) in production; set `true` only if needed
3. If local `.env` has `NODE_ENV=production`, Swagger is off unless `SWAGGER_ENABLED=true` — prefer `NODE_ENV=development` for local
4. Confirm pooler `DATABASE_URL` from Supabase dashboard

## Files touched

- `apps/api/src/modules/cart/cart.service.ts` + `cart.service.spec.ts`
- `apps/api/src/modules/products/products.service.ts`
- `apps/api/src/modules/banners/banners.service.ts`
- `apps/api/src/modules/categories/categories.service.ts`
- `apps/api/src/main.ts`
- `apps/api/src/modules/auth/auth.service.ts`
- `.env.example`
- Spec/plan: `docs/superpowers/specs/2026-07-20-audit-optimasi-design.md`, `docs/superpowers/plans/2026-07-20-audit-optimasi.md`
