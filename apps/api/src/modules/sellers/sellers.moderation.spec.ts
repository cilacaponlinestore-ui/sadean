import { NotFoundException } from '@nestjs/common';
import { SellerStatus } from '@prisma/client';
import { SellersService } from './sellers.service';

describe('SellersService moderation', () => {
  const prisma = {
    seller: { findUnique: jest.fn(), findMany: jest.fn(), update: jest.fn() },
  };
  const service = new SellersService(prisma as never);

  beforeEach(() => jest.clearAllMocks());

  it('approves a seller and records the reviewer', async () => {
    prisma.seller.findUnique.mockResolvedValue({ id: 'seller-1' });
    prisma.seller.update.mockResolvedValue({ id: 'seller-1', status: SellerStatus.VERIFIED });

    await service.approve('seller-1', 'admin-1');
    expect(prisma.seller.update).toHaveBeenCalledWith(expect.objectContaining({
      data: expect.objectContaining({
        status: SellerStatus.VERIFIED,
        isVerified: true,
        isActive: true,
        statusReason: null,
        reviewedById: 'admin-1',
      }),
    }));
  });

  it.each([
    ['reject', SellerStatus.REJECTED],
    ['suspend', SellerStatus.SUSPENDED],
  ] as const)('%s stores the reason and disables the seller', async (method, status) => {
    prisma.seller.findUnique.mockResolvedValue({ id: 'seller-1' });
    prisma.seller.update.mockResolvedValue({ id: 'seller-1', status });

    await service[method]('seller-1', 'admin-1', 'Moderation reason');
    expect(prisma.seller.update).toHaveBeenCalledWith(expect.objectContaining({
      data: expect.objectContaining({
        status,
        statusReason: 'Moderation reason',
        reviewedById: 'admin-1',
        isVerified: false,
        isActive: false,
      }),
    }));
  });

  it('activates a seller through the verified transition', async () => {
    prisma.seller.findUnique.mockResolvedValue({ id: 'seller-1' });
    prisma.seller.update.mockResolvedValue({ id: 'seller-1', status: SellerStatus.VERIFIED });

    await service.activate('seller-1', 'admin-1');
    expect(prisma.seller.update).toHaveBeenCalledWith(expect.objectContaining({
      data: expect.objectContaining({ status: SellerStatus.VERIFIED, isActive: true }),
    }));
  });

  it('returns only public seller fields for verified active stores', async () => {
    prisma.seller.findMany.mockResolvedValue([]);

    await service.findPublic();

    expect(prisma.seller.findMany).toHaveBeenCalledWith({
      where: { isActive: true, isVerified: true },
      select: {
        id: true,
        storeName: true,
        slug: true,
        description: true,
        logo: true,
        address: true,
        _count: { select: { products: true } },
      },
      orderBy: { storeName: 'asc' },
    });
  });

  it('rejects moderation of a missing seller', async () => {
    prisma.seller.findUnique.mockResolvedValue(null);
    await expect(service.approve('missing', 'admin-1')).rejects.toBeInstanceOf(NotFoundException);
    await expect(service.reject('missing', 'admin-1', 'Reason')).rejects.toBeInstanceOf(NotFoundException);
  });
});
