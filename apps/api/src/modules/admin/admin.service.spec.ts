import { NotFoundException } from '@nestjs/common';
import { AdminService } from './admin.service';

describe('AdminService', () => {
  const prisma = {
    user: { count: jest.fn() },
    seller: { count: jest.fn() },
    product: {
      count: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    order: { count: jest.fn() },
  };
  const service = new AdminService(prisma as never);

  beforeEach(() => jest.clearAllMocks());

  it('returns dashboard aggregates', async () => {
    prisma.user.count.mockResolvedValueOnce(10).mockResolvedValueOnce(6).mockResolvedValueOnce(3);
    prisma.seller.count.mockResolvedValueOnce(3).mockResolvedValueOnce(1);
    prisma.product.count.mockResolvedValue(20);
    prisma.order.count.mockResolvedValueOnce(8).mockResolvedValueOnce(2);
    prisma.product.findMany.mockResolvedValue([{ id: 'product-1' }]);

    await expect(service.getDashboard()).resolves.toMatchObject({
      totalUsers: 10,
      totalBuyers: 6,
      totalSellers: 3,
      totalUmkm: 3,
      totalProducts: 20,
      totalOrders: 8,
      todayOrders: 2,
      pendingSellers: 1,
      latestProducts: [{ id: 'product-1' }],
    });
    expect(prisma.order.count.mock.calls[1][0].where.createdAt.gte).toBeInstanceOf(Date);
  });

  it('returns paginated products', async () => {
    prisma.product.findMany.mockResolvedValue([{ id: 'product-1' }]);
    prisma.product.count.mockResolvedValue(21);

    await expect(service.getProducts(2, 10)).resolves.toEqual({
      products: [{ id: 'product-1' }],
      pagination: { page: 2, limit: 10, total: 21, totalPages: 3 },
    });
    expect(prisma.product.findMany).toHaveBeenCalledWith(expect.objectContaining({ skip: 10, take: 10 }));
  });

  it('toggles a product status', async () => {
    prisma.product.findUnique.mockResolvedValue({ id: 'product-1', isActive: true });
    prisma.product.update.mockResolvedValue({ id: 'product-1', isActive: false });

    await expect(service.toggleProduct('product-1')).resolves.toEqual({
      id: 'product-1',
      isActive: false,
    });
    expect(prisma.product.update).toHaveBeenCalledWith(expect.objectContaining({
      where: { id: 'product-1' },
      data: { isActive: false },
    }));
  });

  it('rejects moderation of a missing product', async () => {
    prisma.product.findUnique.mockResolvedValue(null);
    await expect(service.toggleProduct('missing')).rejects.toBeInstanceOf(NotFoundException);
    await expect(service.deleteProduct('missing')).rejects.toBeInstanceOf(NotFoundException);
  });
});
