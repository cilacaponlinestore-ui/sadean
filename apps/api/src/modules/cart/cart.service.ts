import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

export interface CartItem {
  productId: string;
  quantity: number;
}

export interface Cart {
  items: CartItem[];
  sellerId: string | null;
}

@Injectable()
export class CartService {
  // In-memory cart storage (in production, use Redis)
  private carts: Map<string, Cart> = new Map();

  constructor(private prisma: PrismaService) {}

  async getCart(userId: string) {
    const cart = this.carts.get(userId) || { items: [], sellerId: null };
    
    // Get product details for each item
    const itemsWithDetails = await Promise.all(
      cart.items.map(async (item) => {
        const product = await this.prisma.product.findUnique({
          where: { id: item.productId },
          include: {
            seller: {
              select: {
                id: true,
                storeName: true,
              },
            },
            images: {
              where: { isPrimary: true },
              take: 1,
            },
          },
        });

        if (!product) {
          return null;
        }

        return {
          ...item,
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

    // Filter out null items (deleted products)
    const validItems = itemsWithDetails.filter((item) => item !== null);

    // Calculate totals
    const subtotal = validItems.reduce(
      (sum, item) => sum + Number(item.product.price) * item.quantity,
      0,
    );

    return {
      items: validItems,
      sellerId: cart.sellerId,
      total: subtotal,
      itemCount: validItems.reduce((sum, item) => sum + item.quantity, 0),
    };
  }

  async addItem(userId: string, productId: string, quantity: number = 1) {
    // Get product details
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    if (!product.isActive) {
      throw new BadRequestException('Product is not available');
    }

    if (product.stock < quantity) {
      throw new BadRequestException('Insufficient stock');
    }

    const cart = this.carts.get(userId) || { items: [], sellerId: null };

    // Check if adding from different seller
    if (cart.sellerId && cart.sellerId !== product.sellerId && cart.items.length > 0) {
      throw new BadRequestException(
        'Cannot add products from different sellers. Please clear cart first.',
      );
    }

    // Check if product already in cart
    const existingItemIndex = cart.items.findIndex(
      (item) => item.productId === productId,
    );

    if (existingItemIndex >= 0) {
      // Update quantity
      cart.items[existingItemIndex].quantity += quantity;
    } else {
      // Add new item
      cart.items.push({ productId, quantity });
    }

    cart.sellerId = product.sellerId;
    this.carts.set(userId, cart);

    return { message: 'Item added to cart' };
  }

  async updateQuantity(userId: string, productId: string, quantity: number) {
    const cart = this.carts.get(userId);

    if (!cart) {
      throw new NotFoundException('Cart not found');
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.productId === productId,
    );

    if (itemIndex < 0) {
      throw new NotFoundException('Item not found in cart');
    }

    // Check stock
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    if (product.stock < quantity) {
      throw new BadRequestException('Insufficient stock');
    }

    if (quantity <= 0) {
      // Remove item
      cart.items.splice(itemIndex, 1);
    } else {
      cart.items[itemIndex].quantity = quantity;
    }

    // Clear seller if cart is empty
    if (cart.items.length === 0) {
      cart.sellerId = null;
    }

    this.carts.set(userId, cart);

    return { message: 'Cart updated' };
  }

  async removeItem(userId: string, productId: string) {
    const cart = this.carts.get(userId);

    if (!cart) {
      throw new NotFoundException('Cart not found');
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.productId === productId,
    );

    if (itemIndex < 0) {
      throw new NotFoundException('Item not found in cart');
    }

    cart.items.splice(itemIndex, 1);

    // Clear seller if cart is empty
    if (cart.items.length === 0) {
      cart.sellerId = null;
    }

    this.carts.set(userId, cart);

    return { message: 'Item removed from cart' };
  }

  async clearCart(userId: string) {
    this.carts.delete(userId);
    return { message: 'Cart cleared' };
  }
}