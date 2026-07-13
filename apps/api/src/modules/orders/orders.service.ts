import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, dto: CreateOrderDto) {
    // Get user info
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Get seller info
    const seller = await this.prisma.seller.findUnique({
      where: { id: dto.sellerId },
    });

    if (!seller) {
      throw new NotFoundException('Seller not found');
    }

    // Validate products and calculate totals
    let subtotal = 0;
    const orderItems = [];

    const products = await this.prisma.product.findMany({
      where: { id: { in: dto.items.map((item) => item.productId) } },
    });
    const productsById = new Map(products.map((product) => [product.id, product]));

    for (const item of dto.items) {
      const product = productsById.get(item.productId);

      if (!product) {
        throw new NotFoundException(`Product ${item.productId} not found`);
      }

      if (product.sellerId !== dto.sellerId) {
        throw new BadRequestException('Product does not belong to this seller');
      }

      if (product.stock < item.quantity) {
        throw new BadRequestException(`Insufficient stock for ${product.name}`);
      }

      const itemSubtotal = Number(product.price) * item.quantity;
      subtotal += itemSubtotal;

      orderItems.push({
        productId: product.id,
        productName: product.name,
        productPrice: product.price,
        quantity: item.quantity,
        subtotal: itemSubtotal,
      });
    }

    // Generate order number
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const random = Math.floor(Math.random() * 10000)
      .toString()
      .padStart(4, '0');
    const orderNumber = `ORD-${year}${month}${day}-${random}`;

    const order = await this.prisma.$transaction(async (tx) => {
      for (const item of dto.items) {
        const updated = await tx.product.updateMany({
          where: { id: item.productId, stock: { gte: item.quantity } },
          data: { stock: { decrement: item.quantity } },
        });
        if (updated.count !== 1) {
          throw new BadRequestException(`Insufficient stock for ${productsById.get(item.productId)?.name}`);
        }
      }

      return tx.order.create({
        data: {
          orderNumber,
          userId,
          sellerId: dto.sellerId,
          subtotal,
          total: subtotal,
          notes: dto.notes,
          shippingName: dto.shippingName,
          shippingPhone: dto.shippingPhone,
          shippingAddress: dto.shippingAddress,
          items: { create: orderItems },
        },
        include: {
          items: true,
          seller: { select: { id: true, storeName: true, whatsapp: true } },
        },
      });
    });

    // Generate WhatsApp link
    const whatsappMessage = this.generateWhatsAppMessage(
      seller.storeName,
      order.orderNumber,
      orderItems,
      Number(order.total),
      user.name,
    );

    const whatsappLink = `https://wa.me/${seller.whatsapp?.replace('+', '')}?text=${encodeURIComponent(whatsappMessage)}`;

    return {
      ...order,
      whatsappLink,
    };
  }

  async findById(id: string, userId: string) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: {
        items: true,
        seller: {
          select: {
            id: true,
            storeName: true,
            whatsapp: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    // Check if user is owner or seller
    if (order.userId !== userId) {
      // Check if user owns the seller profile
      const sellerProfile = await this.prisma.seller.findFirst({
        where: { userId, id: order.sellerId },
      });
      if (!sellerProfile) {
        throw new NotFoundException('Order not found');
      }
    }

    return order;
  }

  async findByUser(userId: string, params: { page?: number; limit?: number; status?: string }) {
    const { page = 1, limit = 20, status } = params;

    const where: any = { userId };

    if (status) {
      where.status = status;
    }

    const [orders, total] = await Promise.all([
      this.prisma.order.findMany({
        where,
        include: {
          seller: {
            select: {
              id: true,
              storeName: true,
              whatsapp: true,
            },
          },
          items: true,
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.order.count({ where }),
    ]);

    return {
      orders,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findBySeller(sellerId: string, params: { page?: number; limit?: number; status?: string }) {
    const { page = 1, limit = 20, status } = params;

    const where: any = { sellerId };

    if (status) {
      where.status = status;
    }

    const [orders, total] = await Promise.all([
      this.prisma.order.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              phone: true,
            },
          },
          items: true,
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.order.count({ where }),
    ]);

    return {
      orders,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async updateStatus(id: string, userId: string, status: string) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: {
        seller: true,
      },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    // Check if user is buyer or seller
    const isBuyer = order.userId === userId;
    const isSeller = order.seller.userId === userId;

    if (!isBuyer && !isSeller) {
      throw new NotFoundException('Order not found');
    }

    const buyerStatuses = ['cancelled', 'completed'];
    const sellerStatuses = ['confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];
    if ((isBuyer && !buyerStatuses.includes(status)) || (isSeller && !sellerStatuses.includes(status))) {
      throw new BadRequestException('You cannot set this order status');
    }

    // Validate status transition
    const validTransitions: Record<string, string[]> = {
      pending: ['confirmed', 'cancelled'],
      confirmed: ['processing', 'cancelled'],
      processing: ['shipped', 'cancelled'],
      shipped: ['delivered'],
      delivered: ['completed'],
      completed: [],
      cancelled: [],
    };

    if (!validTransitions[order.status]?.includes(status)) {
      throw new BadRequestException(`Cannot transition from ${order.status} to ${status}`);
    }

    // Update status with timestamp
    const updateData: any = { status };

    switch (status) {
      case 'confirmed':
        updateData.confirmedAt = new Date();
        break;
      case 'processing':
        updateData.processingAt = new Date();
        break;
      case 'shipped':
        updateData.shippedAt = new Date();
        break;
      case 'delivered':
        updateData.deliveredAt = new Date();
        break;
      case 'completed':
        updateData.completedAt = new Date();
        break;
      case 'cancelled': {
        updateData.cancelledAt = new Date();
        // Restore stock
        const items = await this.prisma.orderItem.findMany({
          where: { orderId: id },
        });
        for (const item of items) {
          await this.prisma.product.update({
            where: { id: item.productId },
            data: {
              stock: {
                increment: item.quantity,
              },
            },
          });
        }
        break;
      }
    }

    return this.prisma.order.update({
      where: { id },
      data: updateData,
      include: {
        items: true,
      },
    });
  }

  async findAll(params: { page?: number; limit?: number; status?: string }) {
    const { page = 1, limit = 20, status } = params;

    const where: any = {};

    if (status) {
      where.status = status;
    }

    const [orders, total] = await Promise.all([
      this.prisma.order.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              name: true,
            },
          },
          seller: {
            select: {
              id: true,
              storeName: true,
            },
          },
          items: true,
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.order.count({ where }),
    ]);

    return {
      orders,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getDashboard(sellerId: string) {
    const [totalOrders, pendingOrders, totalRevenue] = await Promise.all([
      this.prisma.order.count({
        where: { sellerId },
      }),
      this.prisma.order.count({
        where: { sellerId, status: 'pending' },
      }),
      this.prisma.order.aggregate({
        where: {
          sellerId,
          status: { in: ['confirmed', 'processing', 'shipped', 'delivered', 'completed'] },
        },
        _sum: { total: true },
      }),
    ]);

    return {
      totalOrders,
      pendingOrders,
      totalRevenue: totalRevenue._sum.total || 0,
    };
  }

  private generateWhatsAppMessage(
    storeName: string,
    orderNumber: string,
    items: any[],
    total: number,
    buyerName: string,
  ): string {
    const itemList = items
      .map((item) => `- ${item.productName} x${item.quantity}`)
      .join('\n');

    return `Halo ${storeName},\n\nSaya ingin memesan melalui SADEAN.\n\nOrder: ${orderNumber}\n\nProduk:\n${itemList}\n\nTotal: Rp${total.toLocaleString('id-ID')}\n\nNama: ${buyerName}\n\nTerima kasih.`;
  }
}