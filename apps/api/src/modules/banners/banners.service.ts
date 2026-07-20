import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { MemoryCache } from '../../common/cache/memory-cache';
import { CreateBannerDto } from './dto/create-banner.dto';
import { UpdateBannerDto } from './dto/update-banner.dto';

@Injectable()
export class BannersService {
  private activeCache = new MemoryCache<any[]>(60_000);

  constructor(private prisma: PrismaService) {}

  async create(dto: CreateBannerDto) {
    const row = await this.prisma.banner.create({
      data: dto,
    });
    this.activeCache.clear();
    return row;
  }

  async findAll() {
    const hit = this.activeCache.get('active');
    if (hit) return hit;
    const rows = await this.prisma.banner.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
    });
    this.activeCache.set('active', rows);
    return rows;
  }

  async findAllAdmin() {
    return this.prisma.banner.findMany({
      orderBy: { sortOrder: 'asc' },
    });
  }

  async findById(id: string) {
    const banner = await this.prisma.banner.findUnique({
      where: { id },
    });

    if (!banner) {
      throw new NotFoundException('Banner not found');
    }

    return banner;
  }

  async update(id: string, dto: UpdateBannerDto) {
    const banner = await this.prisma.banner.findUnique({
      where: { id },
    });

    if (!banner) {
      throw new NotFoundException('Banner not found');
    }

    const row = await this.prisma.banner.update({
      where: { id },
      data: dto,
    });
    this.activeCache.clear();
    return row;
  }

  async delete(id: string) {
    const banner = await this.prisma.banner.findUnique({
      where: { id },
    });

    if (!banner) {
      throw new NotFoundException('Banner not found');
    }

    await this.prisma.banner.delete({
      where: { id },
    });
    this.activeCache.clear();

    return { message: 'Banner deleted successfully' };
  }
}
