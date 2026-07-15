import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { SellerStatus } from '@prisma/client';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async getDashboard() {
    const today = new Date(); today.setHours(0, 0, 0, 0);
    try {
      const totalUsers = await this.prisma.user.count();
      const totalBuyers = await this.prisma.user.count({ where: { role: 'buyer' } });
      const totalSellers = await this.prisma.user.count({ where: { role: 'seller' } });
      let totalUmkm = 0; try { totalUmkm = await this.prisma.seller.count(); } catch (e) { new Logger('AdminService').warn('seller.count failed: ' + (e instanceof Error ? e.message : e)); }
      const totalProducts = await this.prisma.product.count();
      const totalOrders = await this.prisma.order.count();
      const todayOrders = await this.prisma.order.count({ where: { createdAt: { gte: today } } });
      let pendingSellers = 0; try { pendingSellers = await this.prisma.seller.count({ where: { status: 'PENDING' as any } }); } catch (e) { new Logger('AdminService').warn('pendingSellers failed: ' + (e instanceof Error ? e.message : e)); }
      let latestProducts: any[] = []; try { latestProducts = await this.prisma.product.findMany({ take: 5, orderBy: { createdAt: 'desc' }, include: { category: { select: { name: true } }, seller: { select: { storeName: true } }, images: { where: { isPrimary: true }, take: 1 } } }); } catch (e) { new Logger('AdminService').warn('latestProducts failed: ' + (e instanceof Error ? e.message : e)); }
      return { totalUsers, totalBuyers, totalSellers, totalUmkm, totalProducts, totalOrders, todayOrders, pendingSellers, latestProducts };
    } catch (e) { new Logger('AdminService').error('Dashboard fatal: ' + (e instanceof Error ? e.message : e)); throw e; }
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
