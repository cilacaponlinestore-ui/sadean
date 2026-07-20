# Audit + Optimasi Hot-path Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix cart N+1, tighten product list select, cache public banners/categories, harden bootstrap (Swagger + SUPER_ADMIN_EMAIL), write audit report.

**Architecture:** Minimal diffs in existing Nest services. Reuse `MemoryCache` (no Redis). TDD for cart. Env-driven super-admin; Swagger gated by NODE_ENV / SWAGGER_ENABLED.

**Tech Stack:** NestJS, Prisma, Jest, existing `MemoryCache` in `apps/api/src/common/cache/memory-cache.ts`

## Global Constraints

- No new dependencies
- Fewest files possible; no unrequested abstractions
- No Redis; MemoryCache only
- Do not change Prisma schema
- Do not rewrite web UI
- Commit only if user explicitly asks
- Run `npm test --workspace=apps/api` after API tasks

## File map

| File | Role |
|------|------|
| `apps/api/src/modules/cart/cart.service.ts` | Fix N+1 in `getCart` |
| `apps/api/src/modules/cart/cart.service.spec.ts` | New unit tests for getCart batch load |
| `apps/api/src/modules/products/products.service.ts` | Tighten category select in `findAll` |
| `apps/api/src/modules/banners/banners.service.ts` | MemoryCache + invalidate |
| `apps/api/src/modules/categories/categories.service.ts` | MemoryCache + invalidate |
| `apps/api/src/main.ts` | Swagger gate; env-based seed |
| `apps/api/src/modules/auth/auth.service.ts` | SUPER_ADMIN_EMAIL from env |
| `.env.example` | Document SUPER_ADMIN_EMAIL, SWAGGER_ENABLED |
| `docs/audit-optimasi-2026-07-20.md` | Audit report |

---

### Task 1: Cart N+1 + test

**Files:**
- Create: `apps/api/src/modules/cart/cart.service.spec.ts`
- Modify: `apps/api/src/modules/cart/cart.service.ts` (`getCart` method)
- Test: `apps/api/src/modules/cart/cart.service.spec.ts`

**Interfaces:**
- Consumes: `PrismaService` mock pattern from `orders.service.spec.ts`
- Produces: `getCart(userId)` still returns `{ items, sellerId, total, itemCount }` with same item shape

- [ ] **Step 1: Write the failing test**

Create `apps/api/src/modules/cart/cart.service.spec.ts`:

```typescript
import { CartService } from './cart.service';

describe('CartService.getCart', () => {
  function setup(items: { id: string; productId: string; quantity: number }[]) {
    const products = [
      {
        id: 'p1',
        name: 'A',
        price: 1000,
        stock: 5,
        unit: 'pcs',
        seller: { id: 's1', storeName: 'Toko' },
        images: [{ imageUrl: 'https://x/a.jpg' }],
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
    ];
    const prisma = {
      cart: {
        findUnique: jest.fn().mockResolvedValue({
          id: 'cart-1',
          userId: 'u1',
          sellerId: 's1',
          items,
        }),
      },
      product: {
        findMany: jest.fn().mockResolvedValue(products.filter((p) => items.some((i) => i.productId === p.id))),
        findUnique: jest.fn(),
      },
    };
    return { service: new CartService(prisma as never), prisma };
  }

  it('loads products in a single findMany (not N findUnique)', async () => {
    const items = [
      { id: 'i1', productId: 'p1', quantity: 2 },
      { id: 'i2', productId: 'p2', quantity: 1 },
    ];
    const { service, prisma } = setup(items);

    const cart = await service.getCart('u1');

    expect(prisma.product.findMany).toHaveBeenCalledTimes(1);
    expect(prisma.product.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: { in: expect.arrayContaining(['p1', 'p2']) } },
      }),
    );
    expect(prisma.product.findUnique).not.toHaveBeenCalled();
    expect(cart.itemCount).toBe(3);
    expect(cart.total).toBe(4000);
    expect(cart.items).toHaveLength(2);
  });

  it('filters out cart lines whose product is missing', async () => {
    const items = [
      { id: 'i1', productId: 'p1', quantity: 1 },
      { id: 'i2', productId: 'gone', quantity: 1 },
    ];
    const { service, prisma } = setup(items);
    prisma.product.findMany.mockResolvedValue([
      {
        id: 'p1',
        name: 'A',
        price: 1000,
        stock: 5,
        unit: 'pcs',
        seller: { id: 's1', storeName: 'Toko' },
        images: [],
      },
    ]);

    const cart = await service.getCart('u1');

    expect(cart.items).toHaveLength(1);
    expect(cart.items[0].productId).toBe('p1');
    expect(cart.total).toBe(1000);
  });

  it('returns empty cart when no cart row', async () => {
    const prisma = {
      cart: { findUnique: jest.fn().mockResolvedValue(null) },
      product: { findMany: jest.fn(), findUnique: jest.fn() },
    };
    const service = new CartService(prisma as never);

    const cart = await service.getCart('u1');

    expect(cart).toEqual({ items: [], sellerId: null, total: 0, itemCount: 0 });
    expect(prisma.product.findMany).not.toHaveBeenCalled();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test --workspace=apps/api -- --testPathPattern=cart.service.spec`

Expected: FAIL — either file missing or `findMany` not used / `findUnique` still called

- [ ] **Step 3: Implement getCart batch load**

Replace `getCart` body in `apps/api/src/modules/cart/cart.service.ts` with:

```typescript
  async getCart(userId: string) {
    const cart = await this.prisma.cart.findUnique({
      where: { userId },
      include: { items: true },
    });

    const items = cart?.items || [];
    if (items.length === 0) {
      return {
        items: [],
        sellerId: cart?.sellerId || null,
        total: 0,
        itemCount: 0,
      };
    }

    const productIds = items.map((item) => item.productId);
    const products = await this.prisma.product.findMany({
      where: { id: { in: productIds } },
      include: {
        seller: {
          select: { id: true, storeName: true },
        },
        images: {
          where: { isPrimary: true },
          take: 1,
        },
      },
    });
    const productById = new Map(products.map((p) => [p.id, p]));

    const validItems = items
      .map((item) => {
        const product = productById.get(item.productId);
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

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test --workspace=apps/api -- --testPathPattern=cart.service.spec`

Expected: PASS (all 3 tests)

- [ ] **Step 5: Commit only if user asked** — skip unless requested

---

### Task 2: Products list category select

**Files:**
- Modify: `apps/api/src/modules/products/products.service.ts` (`findAll` include block ~190–203)

**Interfaces:**
- Consumes: existing `findAll` signature unchanged
- Produces: products with `category: { id, name, slug }` only

- [ ] **Step 1: Tighten select**

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
            category: {
              select: { id: true, name: true, slug: true },
            },
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

- [ ] **Step 2: Typecheck/lint touch**

Run: `npm run typecheck --workspace=apps/api` (or project equivalent if available)

Expected: no new errors related to products list

- [ ] **Step 3: Commit only if user asked**

---

### Task 3: Public MemoryCache for banners + categories

**Files:**
- Modify: `apps/api/src/modules/banners/banners.service.ts`
- Modify: `apps/api/src/modules/categories/categories.service.ts`

**Interfaces:**
- Consumes: `MemoryCache` from `../../common/cache/memory-cache` (or correct relative path)
- Produces: same return shapes for `findAll`; writes clear cache

- [ ] **Step 1: Cache banners**

At top of `banners.service.ts` add import and private field:

```typescript
import { MemoryCache } from '../../common/cache/memory-cache';

// inside class:
  private listCache = new MemoryCache<Awaited<ReturnType<BannersService['findAllUncached']>>>(60_000);

  private findAllUncached() {
    return this.prisma.banner.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
    });
  }

  async findAll() {
    const cached = this.listCache.get('active');
    if (cached) return cached;
    const rows = await this.findAllUncached();
    this.listCache.set('active', rows);
    return rows;
  }
```

Call `this.listCache.clear()` at end of `create`, `update`, `delete` (after successful mutate).

Alternatively (lazier, same effect): keep `findAll` body inline with cache get/set; on create/update/delete call `this.listCache.clear()`. Prefer minimal:

```typescript
import { MemoryCache } from '../../common/cache/memory-cache';

@Injectable()
export class BannersService {
  private activeCache = new MemoryCache<any[]>(60_000);

  constructor(private prisma: PrismaService) {}

  async create(dto: CreateBannerDto) {
    const row = await this.prisma.banner.create({ data: dto });
    this.activeCache.clear();
    return row;
  }

  async findAll() {
    const hit = this.activeCache.get('active');
    if (hit) return hit;
    const rows = await this.prisma.banner.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
    });
    this.activeCache.set('active', rows);
    return rows;
  }

  // findAllAdmin, findById unchanged

  async update(id: string, dto: UpdateBannerDto) {
    // ... existing not-found check ...
    const row = await this.prisma.banner.update({ where: { id }, data: dto });
    this.activeCache.clear();
    return row;
  }

  async delete(id: string) {
    // ... existing not-found check ...
    await this.prisma.banner.delete({ where: { id } });
    this.activeCache.clear();
    return { message: 'Banner deleted successfully' };
  }
}
```

- [ ] **Step 2: Cache categories**

In `categories.service.ts`:

```typescript
import { MemoryCache } from '../../common/cache/memory-cache';

// class field:
  private listCache = new MemoryCache<any[]>(300_000);

  async findAll() {
    const hit = this.listCache.get('roots');
    if (hit) return hit;
    const categories = await this.prisma.category.findMany({
      where: { isActive: true },
      include: {
        children: {
          where: { isActive: true },
          orderBy: { sortOrder: 'asc' },
        },
      },
      orderBy: { sortOrder: 'asc' },
    });
    const roots = categories.filter((cat) => !cat.parentId);
    this.listCache.set('roots', roots);
    return roots;
  }
```

Call `this.listCache.clear()` after successful `create`, `update`, `delete` (and any soft-deactivate if present).

- [ ] **Step 3: Smoke mental check**

- Two consecutive `findAll` → second hits cache (no DB) — acceptable without automated test for this trivial wrapper
- After create → cache cleared → next findAll hits DB

- [ ] **Step 4: Commit only if user asked**

---

### Task 4: Bootstrap harden (Swagger + SUPER_ADMIN_EMAIL)

**Files:**
- Modify: `apps/api/src/main.ts`
- Modify: `apps/api/src/modules/auth/auth.service.ts`
- Modify: `.env.example`

**Interfaces:**
- Consumes: `process.env.SUPER_ADMIN_EMAIL`, `process.env.NODE_ENV`, `process.env.SWAGGER_ENABLED`
- Produces: seed only when email set; Swagger only when not production OR flag true

- [ ] **Step 1: main.ts seed + swagger**

Replace hardcode seed and swagger setup:

```typescript
async function seedSuperAdmin() {
  const email = process.env.SUPER_ADMIN_EMAIL?.trim().toLowerCase();
  if (!email) return;

  const prisma = new PrismaClient();
  try {
    const sa = await prisma.user.findUnique({ where: { email } });
    if (sa && sa.role !== 'super_admin') {
      await prisma.user.update({ where: { email }, data: { role: 'super_admin' } });
      console.log(`Seeded super_admin: ${email}`);
    }
  } catch (e) {
    console.warn('super_admin seed skipped:', (e as Error).message);
  } finally {
    await prisma.$disconnect();
  }
}

// inside bootstrap, after ValidationPipe/filters:
  const swaggerEnabled =
    process.env.SWAGGER_ENABLED === 'true' ||
    process.env.NODE_ENV !== 'production';

  if (swaggerEnabled) {
    const config = new DocumentBuilder()
      .setTitle('SADEAN API')
      .setDescription('API untuk SADEAN - Platform Digital UMKM Cilacap')
      .setVersion('1.0')
      .addBearerAuth()
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document);
  }
```

Remove the always-on Swagger block and the hardcode email in seed.

- [ ] **Step 2: auth.service.ts env email**

Replace:

```typescript
const SUPER_ADMIN_EMAIL = 'daniadhisaputro@gmail.com';
```

with:

```typescript
function superAdminEmail(): string | undefined {
  return process.env.SUPER_ADMIN_EMAIL?.trim().toLowerCase() || undefined;
}
```

And in `roleForEmail`:

```typescript
  private roleForEmail(email: string, fallback: string) {
    const sa = superAdminEmail();
    return sa && email.trim().toLowerCase() === sa ? 'super_admin' : fallback;
  }
```

(Match existing method name/signature exactly — only swap hardcode for env.)

- [ ] **Step 3: .env.example**

Add under APP or JWT section:

```
# Super admin bootstrap (optional). If set, that user is promoted to super_admin on API boot / Google login path.
SUPER_ADMIN_EMAIL=

# Swagger: off in production unless true
SWAGGER_ENABLED=false
```

- [ ] **Step 4: Ensure local .env still works**

Do **not** commit real `.env`. Operator should set `SUPER_ADMIN_EMAIL=daniadhisaputro@gmail.com` in local/prod secrets if they still want that account promoted. Mention in audit report.

- [ ] **Step 5: Commit only if user asked**

---

### Task 5: Audit report + full API test suite

**Files:**
- Create: `docs/audit-optimasi-2026-07-20.md`

- [ ] **Step 1: Write report**

```markdown
# SADEAN Audit + Optimasi — 2026-07-20

## Fixed this session

| P | Area | Change |
|---|------|--------|
| P0 | Cart N+1 | `getCart` uses single `product.findMany` |
| P1 | Products list | category select id/name/slug only |
| P1 | Public cache | banners 60s, categories 300s + clear on write |
| P1 | Bootstrap | Swagger gated; SUPER_ADMIN_EMAIL from env |

## Residual

| P | Item | Notes |
|---|------|-------|
| P1 | Deploy env | Set CORS_ORIGIN, NEXT_PUBLIC_API_URL, APP_URL for production |
| P1 | Supabase RLS | Tables without RLS; access via Nest only — accepted until enable |
| P2 | Search contains | No full-text index |
| P2 | Products count+findMany | Fine at small scale |
| P2 | Redis | Env has REDIS_URL; multi-instance needs shared cache |
| P2 | Web images/bundle | Later |

## Ops follow-up

1. Set `SUPER_ADMIN_EMAIL` in production secrets
2. Keep `SWAGGER_ENABLED=false` (or unset) in production
3. Confirm pooler `DATABASE_URL` from Supabase dashboard
```

- [ ] **Step 2: Run full API tests**

Run: `npm test --workspace=apps/api`

Expected: all suites pass (including new cart.service.spec)

- [ ] **Step 3: Commit only if user asked**

---

## Spec coverage check

| Spec item | Task |
|-----------|------|
| Cart N+1 | Task 1 |
| Products list select | Task 2 |
| Public MemoryCache banners/categories | Task 3 |
| Swagger + SUPER_ADMIN_EMAIL | Task 4 |
| Laporan | Task 5 |
| Residual only in report | Task 5 |

## Placeholder scan

None intentional. Paths and code are concrete.

## Execution handoff

Plan complete. Two options:

1. **Subagent-Driven (recommended)** — fresh subagent per task, review between tasks  
2. **Inline Execution** — this session, executing-plans with checkpoints
