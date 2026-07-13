import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class FavoritesService {
  constructor(private prisma: PrismaService) {}

  async toggle(userId: string, productId: string) {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });
    if (!product) throw new NotFoundException('Product not found');

    const existing = await this.prisma.favorite.findUnique({
      where: { userId_productId: { userId, productId } },
    });

    if (existing) {
      await this.prisma.favorite.delete({ where: { id: existing.id } });
      return { favorited: false };
    }

    await this.prisma.favorite.create({ data: { userId, productId } });
    return { favorited: true };
  }

  async list(userId: string) {
    const favorites = await this.prisma.favorite.findMany({
      where: { userId },
      include: {
        product: {
          include: {
            images: { where: { isPrimary: true }, take: 1 },
            seller: { select: { id: true, storeName: true, slug: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return favorites.map((f) => ({
      id: f.id,
      productId: f.productId,
      createdAt: f.createdAt,
      product: {
        id: f.product.id,
        name: f.product.name,
        slug: f.product.slug,
        price: f.product.price,
        stock: f.product.stock,
        image: f.product.images[0]?.imageUrl || null,
        seller: f.product.seller,
      },
    }));
  }

  async check(userId: string, productId: string) {
    const existing = await this.prisma.favorite.findUnique({
      where: { userId_productId: { userId, productId } },
    });
    return { favorited: !!existing };
  }
}
