# SADEAN — Audit + Optimasi (P0/P1)

**Date:** 2026-07-20  
**Status:** approved design  
**Approach:** A — full-stack audit pass, fix only P0/P1 high-ROI

## Goal

One audit pass over the SADEAN monorepo. Fix correctness, security, and real performance issues with small diffs. Leave P2 as a backlog list only.

## Scope

| In | Out |
|----|-----|
| API latency / query shape | UI redesign |
| Prisma selects, N+1, indexes | New product features |
| Existing MemoryCache reuse | Redis / shared cache infra |
| Buyer/seller/admin hot paths | Formal load-test suite |
| Easy security wins (auth, secrets, validation) | Major Next/Nest upgrades |
| Dead weight / mis-placed deps | CDN redesign |

**Apps:** `apps/api` (NestJS + Prisma + PostgreSQL), `apps/web` (Next.js 14).

**Baseline already in tree (do not redo without cause):** JWT `MemoryCache`, next/Image migration, admin per-query error handling, PWA/image headers.

## Method

1. **API hot paths** — products list/detail, cart, orders, admin/seller dashboard: sequential vs parallel queries, include bloat, missing indexes.
2. **Auth/session** — JWT strategy + cache TTL/invalidation; role guards.
3. **Web** — home/catalog/dashboard fetch pattern, middleware cost, client bundle weight, cache headers.
4. **Deps & config** — odd package placement (e.g. `next` on root/api), throttler, helmet, Prisma logging/connection.
5. **Classify** — P0 (broken / security), P1 (measurable perf or reliability, small fix), P2 (nice-to-have, document only).

## Fix policy

- Implement **P0 + P1 only**.
- Prefer stdlib / existing helpers (`MemoryCache`, `Promise.all`, Prisma `select`).
- No new dependencies for what a few lines solve.
- One runnable check per non-trivial logic change.
- Do not commit unless explicitly requested.

## Deliverables

1. This design doc (committed).
2. Implementation plan (writing-plans).
3. Working tree fixes for P0/P1.
4. Short findings table (P0–P2) in the plan or a follow-up note under `docs/superpowers/`.

## Success criteria

- P0 findings resolved or blocked with explicit reason.
- P1 hot-path improvements landed where evidence supports them.
- No scope creep into redesign or new features.
- Lint/typecheck for touched packages still pass when runnable.

## Out of scope (explicit)

Redis, multi-instance cache coherence, APM product install, marketing copy, new dashboards.
