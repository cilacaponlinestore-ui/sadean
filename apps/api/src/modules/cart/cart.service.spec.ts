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
