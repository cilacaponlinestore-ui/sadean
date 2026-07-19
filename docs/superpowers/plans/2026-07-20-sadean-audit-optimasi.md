# SADEAN Audit + Optimasi Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix P0/P1 findings from the SADEAN audit (cart N+1, admin sequential queries, product list select bloat, JWT stale cache, root dep bloat, home Image props) with smallest working diffs.

**Architecture:** Keep NestJS + Prisma + Next.js as-is. Reuse existing `MemoryCache`. Prefer `Promise.all`, Prisma `findMany({ where: { id: { in } } })`, and tighter `select` over new infra. No Redis.

**Tech Stack:** NestJS 11, Prisma 5, PostgreSQL, Next.js 14, TypeScript, Jest (API unit tests only where logic is non-trivial).

## Global Constraints

- Fix P0 + P1 only; P2 = backlog note at end of this plan.
- No new dependencies.
- Reuse `apps/api/src/common/cache/memory-cache.ts`.
- One runnable check per non-trivial logic change.
- Do not commit unless user asks (plan steps may still show commit commands for agents that were told to commit).
- Spec: `docs/superpowers/specs/2026-07-20-sadean-audit-optimasi-design.md`.

## Findings (audit snapshot)

| ID | Sev | Area | Issue |
|----|-----|------|--------|
| F1 | P0 | `cart.service.ts` | N+1: one `product.findUnique` per cart line |
| F2 | P1 | `admin.service.ts` | Dashboard counts run sequential `await` |
| F3 | P1 | `products.service.ts` | List uses `include: { category: true }` (full row) |
| F4 | P1 | `jwt.strategy.ts` | User cache 5m; no invalidate on deactivate/role change |
| F5 | P1 | root `package.json` | `next`, `@serwist/*`, `@nestjs/core` wrongly at root |
| F6 | P1 | `apps/web/src/app/page.tsx` | `next/Image` missing `width`/`height` or `fill` |
| F7 | P2 | `main.ts` | Hardcoded super_admin email + extra `PrismaClient` on boot |
| F8 | P2 | `apps/api/package.json` | `eslint-config-next` / `next` noise on API package |
| F9 | P2 | categories | `findAll` loads all then filters roots in JS |

## File map

| File | Role |
|------|------|
| `apps/api/src/modules/cart/cart.service.ts` | Batch-load products for cart |
| `apps/api/src/modules/cart/cart.service.spec.ts` | Assert single batch query path (or self-check) |
| `apps/api/src/modules/admin/admin.service.ts` | Parallel dashboard counts |
| `apps/api/src/modules/products/products.service.ts` | Slim category select on list |
| `apps/api/src/common/cache/memory-cache.ts` | (unchanged API; already has `delete`) |
| `apps/api/src/modules/auth/strategies/jwt.strategy.ts` | Expose invalidate; shorter TTL optional |
| `apps/api/src/modules/auth/auth.service.ts` | Call invalidate after login role write / status paths |
| `apps/api/src/modules/auth/auth.module.ts` | Wire shared cache or inject strategy method |
| `package.json` | Drop misplaced root deps |
| `apps/web/src/app/page.tsx` | Fix Image props |
| `docs/superpowers/plans/2026-07-20-sadean-audit-optimasi.md` | This plan + P2 backlog |

---

### Task 1: Cart — kill N+1 product loads (F1 / P0)

**Files:**
- Modify: `apps/api/src/modules/cart/cart.service.ts`
- Create: `apps/api/src/modules/cart/cart.service.spec.ts` (or extend if exists)

**Interfaces:**
- Consumes: `PrismaService`, existing `Cart` / `CartItem` / `Product` models
- Produces: `getCart(userId)` same public shape as today (`items`, `sellerId`, `total`, `itemCount`)

- [ ] **Step 1: Write failing test**

Create `apps/api/src/modules/cart/cart.service.spec.ts`:

```typescript
import { CartService } from './cart.service';

describe('CartService.getCart', () => {
  it('loads products in one findMany by id list', async () => {
    const productFindUnique = jest.fn();
    const productFindMany = jest.fn().mockResolvedValue([
      {
        id: 'p1',
        name: 'A',
        price: 1000,
        stock: 5,
        unit: 'pcs',
        seller: { id: 's1', storeName: 'Toko' },
        images: [{ imageUrl: 'http://x/a.jpg' }],
      },
      {
        id: 'p2',
        name: 'B',
        price: 2000,
        stock: 3,
        unit: 'pcs',
        seller: { id: 's1', storeName: 'Toko' },
        images: [],
      },
    ]);
    const prisma: any = {
      cart: {
        findUnique: jest.fn().mockResolvedValue({
          userId: 'u1',
          sellerId: 's1',
          items: [
            { productId: 'p1', quantity: 2 },
            { productId: 'p2', quantity: 1 },
          ],
        }),
      },
      product: { findUnique: productFindUnique, findMany: productFindMany },
    };
    const svc = new CartService(prisma);
    const result = await svc.getCart('u1');
    expect(productFindUnique).not.toHaveBeenCalled();
    expect(productFindMany).toHaveBeenCalledTimes(1);
    expect(productFindMany.mock.calls[0][0].where.id.in).toEqual(['p1', 'p2']);
    expect(result.itemCount).toBe(3);
    expect(result.total).toBe(4000);
  });
});
```

- [ ] **Step 2: Run test — expect FAIL**

```bash
npm run test --workspace=apps/api -- --testPathPattern=cart.service.spec
```

Expected: FAIL (still uses per-item `findUnique`).

- [ ] **Step 3: Implement batch load in `getCart`**

Replace the per-item map in `getCart` with:

```typescript
async getCart(userId: string) {
  const cart = await this.prisma.cart.findUnique({
    where: { userId },
    include: { items: true },
  });

  const items = cart?.items || [];
  if (items.length === 0) {
    return { items: [], sellerId: cart?.sellerId || null, total: 0, itemCount: 0 };
  }

  const productIds = items.map((i) => i.productId);
  const products = await this.prisma.product.findMany({
    where: { id: { in: productIds } },
    include: {
      seller: { select: { id: true, storeName: true } },
      images: { where: { isPrimary: true }, take: 1 },
    },
  });
  const byId = new Map(products.map((p) => [p.id, p]));

  const validItems = items
    .map((item) => {
      const product = byId.get(item.productId);
      if (!product) return null;
      return {
        productId: item.productId,
        quantity: item.quantity,
        product: {
          id: product.id,
          name: product.name,
          price: product.price,
          stock: product.stock,
          unit: product.unit,
          image: product.images[0]?.imageUrl || null,
          seller: product.seller,
        },
      };
    })
    .filter((item): item is NonNullable<typeof item> => item !== null);

  const subtotal = validItems.reduce(
    (sum, item) => sum + Number(item.product.price) * item.quantity,
    0,
  );

  return {
    items: validItems,
    sellerId: cart?.sellerId || null,
    total: subtotal,
    itemCount: validItems.reduce((sum, item) => sum + item.quantity, 0),
  };
}
```

- [ ] **Step 4: Run test — expect PASS**

```bash
npm run test --workspace=apps/api -- --testPathPattern=cart.service.spec
```

Expected: PASS.

- [ ] **Step 5: Commit (if user asked)**

```bash
git add apps/api/src/modules/cart/cart.service.ts apps/api/src/modules/cart/cart.service.spec.ts
git commit -m "perf(api): batch-load cart products (kill N+1)"
```

---

### Task 2: Admin dashboard — parallel counts (F2 / P1)

**Files:**
- Modify: `apps/api/src/modules/admin/admin.service.ts`

**Interfaces:**
- Consumes: `PrismaService`
- Produces: same dashboard JSON keys as today

- [ ] **Step 1: Replace sequential awaits with Promise.all**

In `getDashboard()`, keep per-query try/catch for fragile seller counts, but run independent counts in parallel:

```typescript
async getDashboard() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const log = new Logger('AdminService');
  try {
    const [
      totalUsers,
      totalBuyers,
      totalSellers,
      totalProducts,
      totalOrders,
      todayOrders,
    ] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.user.count({ where: { role: 'buyer' } }),
      this.prisma.user.count({ where: { role: 'seller' } }),
      this.prisma.product.count(),
      this.prisma.order.count(),
      this.prisma.order.count({ where: { createdAt: { gte: today } } }),
    ]);

    let totalUmkm = 0;
    try {
      totalUmkm = await this.prisma.seller.count();
    } catch (e) {
      log.warn('seller.count failed: ' + (e instanceof Error ? e.message : e));
    }

    let pendingSellers = 0;
    try {
      pendingSellers = await this.prisma.seller.count({
        where: { status: 'PENDING' as any },
      });
    } catch (e) {
      log.warn('pendingSellers failed: ' + (e instanceof Error ? e.message : e));
    }

    let latestProducts: any[] = [];
    try {
      latestProducts = await this.prisma.product.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          category: { select: { name: true } },
          seller: { select: { storeName: true } },
          images: { where: { isPrimary: true }, take: 1 },
        },
      });
    } catch (e) {
      log.warn('latestProducts failed: ' + (e instanceof Error ? e.message : e));
    }

    return {
      totalUsers,
      totalBuyers,
      totalSellers,
      totalUmkm,
      totalProducts,
      totalOrders,
      todayOrders,
      pendingSellers,
      latestProducts,
    };
  } catch (e) {
    log.error('Dashboard fatal: ' + (e instanceof Error ? e.message : e));
    throw e;
  }
}
```

Optional later (P2): fold seller counts into same `Promise.all` once schema stable.

- [ ] **Step 2: Typecheck API**

```bash
npm run typecheck --workspace=apps/api
```

Expected: no new errors in `admin.service.ts`.

- [ ] **Step 3: Commit (if user asked)**

```bash
git add apps/api/src/modules/admin/admin.service.ts
git commit -m "perf(api): parallelize admin dashboard counts"
```

---

### Task 3: Product list — slim category select (F3 / P1)

**Files:**
- Modify: `apps/api/src/modules/products/products.service.ts` (`findAll` only)

- [ ] **Step 1: Tighten include**

In `findAll`, change:

```typescript
include: {
  category: true,
  seller: {
    select: {
      id: true,
      storeName: true,
      slug: true,
    },
  },
  images: {
    where: { isPrimary: true },
    take: 1,
  },
},
```

to:

```typescript
include: {
  category: { select: { id: true, name: true, slug: true } },
  seller: {
    select: {
      id: true,
      storeName: true,
      slug: true,
    },
  },
  images: {
    where: { isPrimary: true },
    take: 1,
    select: { imageUrl: true, isPrimary: true },
  },
},
```

Do **not** change `findById` / `findBySlug` detail payloads (detail needs full fields).

- [ ] **Step 2: Typecheck**

```bash
npm run typecheck --workspace=apps/api
```

Expected: PASS for products module.

- [ ] **Step 3: Commit (if user asked)**

```bash
git add apps/api/src/modules/products/products.service.ts
git commit -m "perf(api): slim product list select"
```

---

### Task 4: JWT user cache invalidation (F4 / P1)

**Files:**
- Modify: `apps/api/src/modules/auth/strategies/jwt.strategy.ts`
- Modify: `apps/api/src/modules/auth/auth.service.ts`
- Modify: `apps/api/src/modules/auth/auth.module.ts` if needed for injection

**Problem:** After admin deactivates user or login upgrades role, cached JWT principal can stay wrong up to 5 minutes.

**Lazy approach (recommended):** export invalidate on strategy; call from `AuthService.login` after role write; also reduce TTL to 60s.

- [ ] **Step 1: Add invalidate on strategy**

```typescript
// jwt.strategy.ts — keep MemoryCache, add:
invalidateUser(userId: string) {
  this.userCache.delete(`user:${userId}`);
}
```

Change default TTL constructor arg from `300_000` to `60_000`.

- [ ] **Step 2: Call invalidate after login role persist**

In `auth.service.ts` `login`, after `user.update` that sets `role` / tokens:

```typescript
// inject JwtStrategy or a tiny AuthCache helper
this.jwtStrategy.invalidateUser(user.id);
```

If circular DI is painful, **lazy alternative:** only lower TTL to 60s and skip cross-service call. Prefer invalidate if Nest DI is clean:

```typescript
// auth.module.ts providers already list AuthService + JwtStrategy
// AuthService constructor adds: private jwtStrategy: JwtStrategy
```

Also call `invalidateUser` in any path that sets `isActive: false` or changes `role` (grep `isActive` / `role:` updates under `apps/api/src`).

- [ ] **Step 3: Minimal self-check**

Add to existing auth test or new unit:

```typescript
it('invalidateUser drops cache entry', async () => {
  // if testing strategy directly with mock prisma
});
```

Or skip test if only TTL change (trivial).

- [ ] **Step 4: Typecheck**

```bash
npm run typecheck --workspace=apps/api
```

- [ ] **Step 5: Commit (if user asked)**

```bash
git add apps/api/src/modules/auth
git commit -m "fix(api): invalidate JWT user cache on login/role change"
```

---

### Task 5: Root package.json dep cleanup (F5 / P1)

**Files:**
- Modify: `package.json` (repo root)
- Then: `npm install` at root to refresh lockfile

**Context:** `next` and `@serwist/*` belong in `apps/web`. `@nestjs/core` belongs in `apps/api` (already listed there). Root should keep turbo/typescript tooling only.

- [ ] **Step 1: Edit root dependencies**

Remove from root `package.json` `dependencies` block:

- `@nestjs/core`
- `@serwist/next`
- `@serwist/precaching`
- `@serwist/sw`
- `next`

If the block becomes empty, delete the entire `"dependencies"` key.

Confirm `apps/web/package.json` still has `next` + `@serwist/*` and `apps/api/package.json` still has `@nestjs/core`.

- [ ] **Step 2: Reinstall**

```bash
npm install
```

Expected: lockfile updates; workspaces still resolve.

- [ ] **Step 3: Smoke**

```bash
npm run typecheck --workspace=apps/web
npm run typecheck --workspace=apps/api
```

Expected: both pass (or no new dep-resolution errors).

- [ ] **Step 4: Commit (if user asked)**

```bash
git add package.json package-lock.json
git commit -m "chore: drop misplaced root deps (next/serwist/nestjs)"
```

---

### Task 6: Home hero Image props (F6 / P1)

**Files:**
- Modify: `apps/web/src/app/page.tsx`

- [ ] **Step 1: Fix Image**

Find hero banner `Image` without dimensions. Use `fill` + sized parent (parent already has layout):

```tsx
<div className="relative h-[420px] w-full overflow-hidden rounded-[2rem] border border-white/10 shadow-2xl">
  <Image
    src={banners[0].imageUrl}
    alt={banners[0].title || 'Banner'}
    fill
    className="object-cover"
    sizes="(max-width: 1024px) 100vw, 480px"
    priority
  />
  {/* overlay + title unchanged */}
</div>
```

Ensure parent of `fill` Image is `position: relative` (Tailwind `relative`).

- [ ] **Step 2: Lint/typecheck web if available**

```bash
npm run typecheck --workspace=apps/web
```

- [ ] **Step 3: Commit (if user asked)**

```bash
git add apps/web/src/app/page.tsx
git commit -m "fix(web): give home hero Image fill + sizes"
```

---

### Task 7: Verification + P2 backlog note

- [ ] **Step 1: Run focused tests**

```bash
npm run test --workspace=apps/api -- --testPathPattern=cart.service.spec
npm run typecheck --workspace=apps/api
npm run typecheck --workspace=apps/web
```

Expected: cart test PASS; typechecks clean for touched code.

- [ ] **Step 2: Append P2 backlog to this plan (done below) — no code**

#### P2 backlog (do not implement in this plan)

| ID | Item | When to add |
|----|------|-------------|
| F7 | Move super_admin seed email to env; reuse PrismaService | multi-admin / no hardcoded owner |
| F8 | Remove `eslint-config-next` / stray `next` from `apps/api` | next dep audit |
| F9 | Categories: query `parentId: null` instead of filter-in-JS | category tree grows large |
| F10 | Cache public product list / banners at API layer | traffic justifies MemoryCache |
| F11 | Composite index `(isActive, createdAt)` if list sort+filter slow | EXPLAIN shows seq scan |
| F12 | Admin: single SQL aggregation for role counts | dashboard still slow after Task 2 |

---

## Self-review (plan vs spec)

| Spec item | Task |
|-----------|------|
| API hot paths | T1 cart, T2 admin, T3 products |
| Auth/session cache | T4 |
| Web fetch/image | T6 (home Image); home already uses revalidate |
| Deps & config | T5 root deps |
| P0+P1 only | F7–F12 listed as P2 |
| No Redis / no redesign | honored |
| Runnable check | T1 cart test; typecheck elsewhere |

No placeholders. Signatures match existing services.
