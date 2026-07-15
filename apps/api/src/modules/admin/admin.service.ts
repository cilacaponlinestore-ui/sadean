import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { SellerStatus } from '@prisma/client';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async getDashboard() {
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const [totalUsers, totalBuyers, totalSellers, totalUmkm, totalProducts, totalOrders, todayOrders, pendingSellers, latestProducts] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.user.count({ where: { role: 'buyer' } }),
      this.prisma.user.count({ where: { role: 'seller' } }),
      this.prisma.seller.count(),
      this.prisma.product.count(),
      this.prisma.order.count(),
      this.prisma.order.count({ where: { createdAt: { gte: today } } }),
      this.prisma.seller.count({ where: { status: 'PENDING' as any } }),
      this.prisma.product.findMany({ take: 5, orderBy: { createdAt: 'desc' }, include: { category: { select: { name: true } }, seller: { select: { storeName: true } }, images: { where: { isPrimary: true }, take: 1 } } }),
    ]);
    return { totalUsers, totalBuyers, totalSellers, totalUmkm, totalProducts, totalOrders, todayOrders, pendingSellers, latestProducts };
  }

  async getProducts(page = 1, limit = 20) {
    const [products, total] = await Promise.all([
      this.prisma.product.findMany({
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          category: { select: { name: true } },
          seller: { select: { storeName: true } },
          images: { where: { isPrimary: true }, take: 1 },
        },
      }),
      this.prisma.product.count(),
    ]);

    return {
      products,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  async toggleProduct(id: string) {
    const product = await this.prisma.product.findUnique({ where: { id } });
    if (!product) throw new NotFoundException('Product not found');

    return this.prisma.product.update({
      where: { id },
      data: { isActive: !product.isActive },
      select: { id: true, isActive: true },
    });
  }

  async deleteProduct(id: string) {
    const product = await this.prisma.product.findUnique({ where: { id } });
    if (!product) throw new NotFoundException('Product not found');

    await this.prisma.product.delete({ where: { id } });
    return { message: 'Product deleted successfully' };
  }
}
