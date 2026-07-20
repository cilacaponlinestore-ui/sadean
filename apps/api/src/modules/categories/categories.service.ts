import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { MemoryCache } from '../../common/cache/memory-cache';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  private listCache = new MemoryCache<any[]>(300_000);

  constructor(private prisma: PrismaService) {}

  async create(dto: CreateCategoryDto) {
    // Generate slug from name
    const slug = dto.name
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');

    // Check if slug exists
    const existingSlug = await this.prisma.category.findUnique({
      where: { slug },
    });

    if (existingSlug) {
      throw new ConflictException('Category name already exists');
    }

    const row = await this.prisma.category.create({
      data: {
        ...dto,
        slug,
      },
    });
    this.listCache.clear();
    return row;
  }

  async findAll() {
    const hit = this.listCache.get('roots');
    if (hit) return hit;
    const categories = await this.prisma.category.findMany({
      where: { isActive: true },
      include: {
        children: {
          where: { isActive: true },
          orderBy: { sortOrder: 'asc' },
        },
      },
      orderBy: { sortOrder: 'asc' },
    });

    // Return only root categories with children
    const roots = categories.filter((cat) => !cat.parentId);
    this.listCache.set('roots', roots);
    return roots;
  }

  async findById(id: string) {
    const category = await this.prisma.category.findUnique({
      where: { id },
      include: {
        children: {
          where: { isActive: true },
          orderBy: { sortOrder: 'asc' },
        },
        parent: true,
      },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    return category;
  }

  async findBySlug(slug: string) {
    const category = await this.prisma.category.findUnique({
      where: { slug },
      include: {
        children: {
          where: { isActive: true },
          orderBy: { sortOrder: 'asc' },
        },
      },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    return category;
  }

  async update(id: string, dto: UpdateCategoryDto) {
    const category = await this.prisma.category.findUnique({
      where: { id },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    // If name is updated, update slug
    let slug = category.slug;
    if (dto.name && dto.name !== category.name) {
      slug = dto.name
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');

      // Check if new slug exists
      const existingSlug = await this.prisma.category.findFirst({
        where: { slug, id: { not: id } },
      });

      if (existingSlug) {
        throw new ConflictException('Category name already exists');
      }
    }

    const row = await this.prisma.category.update({
      where: { id },
      data: {
        ...dto,
        slug,
      },
    });
    this.listCache.clear();
    return row;
  }

  async delete(id: string) {
    const category = await this.prisma.category.findUnique({
      where: { id },
      include: {
        products: true,
        children: true,
      },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    if (category.products.length > 0) {
      throw new ConflictException('Cannot delete category with products');
    }

    if (category.children.length > 0) {
      throw new ConflictException('Cannot delete category with subcategories');
    }

    await this.prisma.category.delete({
      where: { id },
    });
    this.listCache.clear();

    return { message: 'Category deleted successfully' };
  }
}