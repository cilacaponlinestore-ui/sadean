import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class CartService {
  constructor(private prisma: PrismaService) {}

  private async getOrCreateCart(userId: string) {
    let cart = await this.prisma.cart.findUnique({
      where: { userId },
      include: { items: true },
    });
    if (!cart) {
      cart = await this.prisma.cart.create({
        data: { userId },
        include: { items: true },
      });
    }
    return cart;
  }

  async getCart(userId: string) {
    const cart = await this.prisma.cart.findUnique({
      where: { userId },
      include: { items: true },
    });

    const items = cart?.items || [];

    const itemsWithDetails = await Promise.all(
      items.map(async (item) => {
        const product = await this.prisma.product.findUnique({
          where: { id: item.productId },
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
      }),
    );

    const validItems = itemsWithDetails.filter((item) => item !== null);
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

  async addItem(userId: string, productId: string, quantity: number = 1) {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) throw new NotFoundException('Product not found');
    if (!product.isActive) throw new BadRequestException('Product is not available');
    if (product.stock < quantity) throw new BadRequestException('Insufficient stock');

    const cart = await this.getOrCreateCart(userId);

    if (cart.sellerId && cart.sellerId !== product.sellerId && cart.items.length > 0) {
      throw new BadRequestException(
        'Cannot add products from different sellers. Please clear cart first.',
      );
    }

    const existingItem = cart.items.find((item) => item.productId === productId);

    if (existingItem) {
      await this.prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + quantity },
      });
    } else {
      await this.prisma.cartItem.create({
        data: { cartId: cart.id, productId, quantity },
      });
    }

    await this.prisma.cart.update({
      where: { id: cart.id },
      data: { sellerId: product.sellerId },
    });

    return { message: 'Item added to cart' };
  }

  async updateQuantity(userId: string, productId: string, quantity: number) {
    const cart = await this.prisma.cart.findUnique({
      where: { userId },
      include: { items: true },
    });

    if (!cart) throw new NotFoundException('Cart not found');

    const item = cart.items.find((i) => i.productId === productId);
    if (!item) throw new NotFoundException('Item not found in cart');

    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });
    if (!product) throw new NotFoundException('Product not found');
    if (product.stock < quantity) throw new BadRequestException('Insufficient stock');

    if (quantity <= 0) {
      await this.prisma.cartItem.delete({ where: { id: item.id } });
    } else {
      await this.prisma.cartItem.update({
        where: { id: item.id },
        data: { quantity },
      });
    }

    const remainingItems = await this.prisma.cartItem.count({
      where: { cartId: cart.id },
    });

    if (remainingItems === 0) {
      await this.prisma.cart.update({
        where: { id: cart.id },
        data: { sellerId: null },
      });
    }

    return { message: 'Cart updated' };
  }

  async removeItem(userId: string, productId: string) {
    const cart = await this.prisma.cart.findUnique({
      where: { userId },
      include: { items: true },
    });

    if (!cart) throw new NotFoundException('Cart not found');

    const item = cart.items.find((i) => i.productId === productId);
    if (!item) throw new NotFoundException('Item not found in cart');

    await this.prisma.cartItem.delete({ where: { id: item.id } });

    const remainingItems = await this.prisma.cartItem.count({
      where: { cartId: cart.id },
    });

    if (remainingItems === 0) {
      await this.prisma.cart.update({
        where: { id: cart.id },
        data: { sellerId: null },
      });
    }

    return { message: 'Item removed from cart' };
  }

  async clearCart(userId: string) {
    const cart = await this.prisma.cart.findUnique({
      where: { userId },
    });

    if (cart) {
      await this.prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
      await this.prisma.cart.update({
        where: { id: cart.id },
        data: { sellerId: null },
      });
    }

    return { message: 'Cart cleared' };
  }
}
