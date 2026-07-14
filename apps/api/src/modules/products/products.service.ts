import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async create(sellerId: string, dto: CreateProductDto) {
    // Generate slug from product name
    const slug = dto.name
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');

    // Check if slug exists
    const existingSlug = await this.prisma.product.findUnique({
      where: { slug },
    });

    if (existingSlug) {
      // Append random string to slug
      const randomStr = Math.random().toString(36).substring(2, 8);
      const newSlug = `${slug}-${randomStr}`;
      
      return this.prisma.product.create({
        data: {
          sellerId,
          ...dto,
          slug: newSlug,
        },
        include: {
          category: true,
          seller: {
            select: {
              id: true,
              storeName: true,
            },
          },
          images: true,
        },
      });
    }

    return this.prisma.product.create({
      data: {
        sellerId,
        ...dto,
        slug,
      },
      include: {
        category: true,
        seller: {
          select: {
            id: true,
            storeName: true,
          },
        },
        images: true,
      },
    });
  }

  async findById(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        seller: {
          select: {
            id: true,
            storeName: true,
            slug: true,
            whatsapp: true,
            user: {
              select: {
                name: true,
              },
            },
          },
        },
        images: {
          orderBy: { sortOrder: 'asc' },
        },
      },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return product;
  }

  async findBySlug(slug: string) {
    const product = await this.prisma.product.findUnique({
      where: { slug },
      include: {
        category: true,
        seller: {
          select: { id: true, storeName: true, slug: true, whatsapp: true },
        },
        images: { orderBy: { sortOrder: 'asc' } },
      },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return product;
  }

  async findBySellerId(sellerId: string) {
    return this.prisma.product.findMany({
      where: { sellerId },
      include: {
        category: true,
        images: {
          where: { isPrimary: true },
          take: 1,
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findAll(params: {
    page?: number;
    limit?: number;
    category?: string;
    seller?: string;
    search?: string;
    minPrice?: number;
    maxPrice?: number;
    sort?: string;
  }) {
    const {
      page = 1,
      limit = 20,
      category,
      seller,
      search,
      minPrice,
      maxPrice,
      sort,
    } = params;

    const where: any = {
      isActive: true,
      seller: { isActive: true, isVerified: true },
    };

    if (category) {
      where.categoryId = category;
    }

    if (seller) {
      where.sellerId = seller;
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = minPrice;
      if (maxPrice) where.price.lte = maxPrice;
    }

    let orderBy: any = { createdAt: 'desc' };

    if (sort === 'price_asc') {
      orderBy = { price: 'asc' };
    } else if (sort === 'price_desc') {
      orderBy = { price: 'desc' };
    } else if (sort === 'oldest') {
      orderBy = { createdAt: 'asc' };
    }

    const [products, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        include: {
          category: true,
          seller: {
            select: {
              id: true,
              storeName: true,
              slug: true,
            },
          },
          images: {
            where: { isPrimary: true },
            take: 1,
          },
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy,
      }),
      this.prisma.product.count({ where }),
    ]);

    return {
      products,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async update(id: string, sellerId: string, dto: UpdateProductDto) {
    const product = await this.prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    if (product.sellerId !== sellerId) {
      throw new ForbiddenException('Not your product');
    }

    return this.prisma.product.update({
      where: { id },
      data: dto,
      include: {
        category: true,
        images: true,
      },
    });
  }

  async delete(id: string, sellerId: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    if (product.sellerId !== sellerId) {
      throw new ForbiddenException('Not your product');
    }

    await this.prisma.product.delete({
      where: { id },
    });

    return { message: 'Product deleted successfully' };
  }

  async addImage(productId: string, sellerId: string, imageUrl: string, isPrimary = false) {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    if (product.sellerId !== sellerId) {
      throw new ForbiddenException('Not your product');
    }

    // If this is primary, unset other primary images
    if (isPrimary) {
      await this.prisma.productImage.updateMany({
        where: { productId, isPrimary: true },
        data: { isPrimary: false },
      });
    }

    // Get sort order
    const lastImage = await this.prisma.productImage.findFirst({
      where: { productId },
      orderBy: { sortOrder: 'desc' },
    });

    return this.prisma.productImage.create({
      data: {
        productId,
        imageUrl,
        isPrimary,
        sortOrder: (lastImage?.sortOrder || 0) + 1,
      },
    });
  }

  async deleteImage(imageId: string, sellerId: string) {
    const image = await this.prisma.productImage.findUnique({
      where: { id: imageId },
      include: { product: true },
    });

    if (!image) {
      throw new NotFoundException('Image not found');
    }

    if (image.product.sellerId !== sellerId) {
      throw new ForbiddenException('Not your product');
    }

    await this.prisma.productImage.delete({
      where: { id: imageId },
    });

    return { message: 'Image deleted successfully' };
  }
}