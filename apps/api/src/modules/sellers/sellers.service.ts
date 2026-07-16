import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateSellerDto } from './dto/create-seller.dto';
import { UpdateSellerDto } from './dto/update-seller.dto';
import { SellerStatus } from '@prisma/client';

@Injectable()
export class SellersService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, dto: CreateSellerDto) {
    // Check if user already has a seller profile
    const existingSeller = await this.prisma.seller.findUnique({
      where: { userId },
    });

    if (existingSeller) {
      throw new ConflictException('User already has a seller profile');
    }

    // Generate slug from store name
    const slug = dto.storeName
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');

    // Check if slug exists
    const existingSlug = await this.prisma.seller.findUnique({
      where: { slug },
    });

    if (existingSlug) {
      throw new ConflictException('Store name already exists');
    }

    return this.prisma.seller.create({
      data: {
        userId,
        ...dto,
        slug,
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
    });
  }

  async findById(id: string) {
    const seller = await this.prisma.seller.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
        _count: {
          select: {
            products: true,
          },
        },
      },
    });

    if (!seller) {
      throw new NotFoundException('Seller not found');
    }

    return seller;
  }

  async findByUserId(userId: string) {
    const seller = await this.prisma.seller.findUnique({
      where: { userId },
      include: {
        _count: {
          select: {
            products: true,
          },
        },
      },
    });

    if (!seller) {
      throw new NotFoundException('Seller profile not found');
    }

    return seller;
  }

  async findByUserIdSafe(userId: string) {
    return this.prisma.seller.findUnique({
      where: { userId },
      include: { _count: { select: { products: true } } },
    });
  }

  async findBySlug(slug: string) {
    const seller = await this.prisma.seller.findUnique({
      where: { slug },
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
        products: {
          where: { isActive: true },
          take: 10,
          orderBy: { createdAt: 'desc' },
        },
        _count: {
          select: {
            products: true,
          },
        },
      },
    });

    if (!seller) {
      throw new NotFoundException('Seller not found');
    }

    return seller;
  }

  async findPublic() {
    return this.prisma.seller.findMany({
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
  }

  async update(id: string, userId: string, dto: UpdateSellerDto) {
    const seller = await this.prisma.seller.findUnique({
      where: { id },
    });

    if (!seller) {
      throw new NotFoundException('Seller not found');
    }

    if (seller.userId !== userId) {
      throw new NotFoundException('Not your store');
    }

    return this.prisma.seller.update({
      where: { id },
      data: dto,
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
    });
  }

  async updateLogo(id: string, userId: string, logoUrl: string) {
    const seller = await this.prisma.seller.findUnique({
      where: { id },
    });

    if (!seller) {
      throw new NotFoundException('Seller not found');
    }

    if (seller.userId !== userId) {
      throw new NotFoundException('Not your store');
    }

    return this.prisma.seller.update({
      where: { id },
      data: { logo: logoUrl },
      select: {
        id: true,
        logo: true,
      },
    });
  }

  async findAll(params: {
    page?: number;
    limit?: number;
    status?: string;
    search?: string;
  }) {
    const { page = 1, limit = 20, status, search } = params;

    const where: any = {};

    const normalizedStatus = status?.toUpperCase();
    if (normalizedStatus && Object.values(SellerStatus).includes(normalizedStatus as SellerStatus)) {
      where.status = normalizedStatus;
    } else if (status === 'verified') {
      where.isVerified = true;
    } else if (status === 'pending') {
      where.isVerified = false;
    } else if (status === 'inactive') {
      where.isActive = false;
    }

    if (search) {
      where.OR = [
        { storeName: { contains: search, mode: 'insensitive' } },
        { user: { name: { contains: search, mode: 'insensitive' } } },
      ];
    }

    const [sellers, total] = await Promise.all([
      this.prisma.seller.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              email: true,
              name: true,
            },
          },
          _count: {
            select: {
              products: true,
            },
          },
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.seller.count({ where }),
    ]);

    return {
      sellers,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async approve(id: string, reviewedById: string) {
    const seller = await this.prisma.seller.findUnique({
      where: { id },
    });

    if (!seller) {
      throw new NotFoundException('Seller not found');
    }

    return this.prisma.seller.update({
      where: { id },
      data: {
        isVerified: true,
        isActive: true,
        verifiedAt: new Date(),
        status: SellerStatus.VERIFIED,
        statusReason: null,
        reviewedAt: new Date(),
        reviewedById,
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
    });
  }

  async reject(id: string, reviewedById: string, reason: string) {
    return this.moderate(id, SellerStatus.REJECTED, reviewedById, reason);
  }

  async suspend(id: string, reviewedById: string, reason: string) {
    return this.moderate(id, SellerStatus.SUSPENDED, reviewedById, reason);
  }

  async activate(id: string, reviewedById: string) {
    return this.approve(id, reviewedById);
  }

  private async moderate(id: string, status: SellerStatus, reviewedById: string, reason: string) {
    const seller = await this.prisma.seller.findUnique({ where: { id } });
    if (!seller) throw new NotFoundException('Seller not found');

    return this.prisma.seller.update({
      where: { id },
      data: {
        status,
        statusReason: reason,
        reviewedAt: new Date(),
        reviewedById,
        isVerified: false,
        isActive: false,
      },
      include: { user: { select: { id: true, email: true, name: true } } },
    });
  }

  async toggleActive(id: string, reviewedById: string) {
    const seller = await this.prisma.seller.findUnique({
      where: { id },
    });

    if (!seller) {
      throw new NotFoundException('Seller not found');
    }

    if (seller.isActive) {
      return this.moderate(id, SellerStatus.SUSPENDED, reviewedById, 'Dinonaktifkan oleh admin');
    }
    return this.activate(id, reviewedById);
  }

  async getDashboard(sellerId: string) {
    const seller = await this.prisma.seller.findUnique({
      where: { id: sellerId },
    });

    if (!seller) {
      throw new NotFoundException('Seller not found');
    }

    const [totalProducts, totalOrders, pendingOrders, totalRevenue] =
      await Promise.all([
        this.prisma.product.count({
          where: { sellerId, isActive: true },
        }),
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

    const recentOrders = await this.prisma.order.findMany({
      where: { sellerId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
        items: true,
      },
      orderBy: { createdAt: 'desc' },
      take: 5,
    });

    return {
      stats: {
        totalProducts,
        totalOrders,
        pendingOrders,
        totalRevenue: totalRevenue._sum.total || 0,
      },
      recentOrders,
    };
  }
}
