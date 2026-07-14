import { BadRequestException } from '@nestjs/common';
import { OrdersService } from './orders.service';

describe('OrdersService', () => {
  const user = { id: 'user-1', name: 'Dani' };
  const seller = { id: 'seller-1', storeName: 'Toko', whatsapp: '6281', isVerified: true, isActive: true };
  const product = {
    id: 'product-1',
    name: 'Produk',
    price: 10000,
    stock: 2,
    sellerId: seller.id,
  };
  const dto = {
    sellerId: seller.id,
    items: [{ productId: product.id, quantity: 2 }],
    shippingName: 'Dani',
    shippingPhone: '0812',
    shippingAddress: 'Cilacap',
  };

  function setup(stockUpdated = 1) {
    const tx = {
      product: { updateMany: jest.fn().mockResolvedValue({ count: stockUpdated }) },
      order: {
        create: jest.fn().mockResolvedValue({
          id: 'order-1',
          orderNumber: 'ORD-1',
          total: 20000,
          items: [],
        }),
      },
    };
    const prisma = {
      user: { findUnique: jest.fn().mockResolvedValue(user) },
      seller: { findUnique: jest.fn().mockResolvedValue(seller) },
      product: { findMany: jest.fn().mockResolvedValue([product]) },
      $transaction: jest.fn(async (callback: (client: typeof tx) => unknown) => callback(tx)),
    };
    return { service: new OrdersService(prisma as never), prisma, tx };
  }

  it('decrements stock and creates the order in one transaction', async () => {
    const { service, prisma, tx } = setup();

    const order = await service.create(user.id, dto);

    expect(prisma.$transaction).toHaveBeenCalledTimes(1);
    expect(tx.product.updateMany).toHaveBeenCalledWith({
      where: { id: product.id, stock: { gte: 2 } },
      data: { stock: { decrement: 2 } },
    });
    expect(tx.order.create).toHaveBeenCalledTimes(1);
    expect(order.whatsappLink).toContain('https://wa.me/6281');
  });

  it('rejects checkout when atomic stock update fails', async () => {
    const { service, tx } = setup(0);

    await expect(service.create(user.id, dto)).rejects.toBeInstanceOf(BadRequestException);
    expect(tx.order.create).not.toHaveBeenCalled();
  });

  it('prevents a buyer from setting seller fulfillment statuses', async () => {
    const prisma = {
      order: {
        findUnique: jest.fn().mockResolvedValue({
          id: 'order-1',
          userId: user.id,
          status: 'pending',
          seller: { userId: 'seller-user-1' },
        }),
        update: jest.fn(),
      },
    };
    const service = new OrdersService(prisma as never);

    await expect(service.updateStatus('order-1', user.id, 'confirmed')).rejects.toThrow(
      'You cannot set this order status',
    );
    expect(prisma.order.update).not.toHaveBeenCalled();
  });
});
