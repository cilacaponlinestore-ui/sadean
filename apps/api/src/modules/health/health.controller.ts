import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { PrismaService } from '../../prisma/prisma.service';

@ApiTags('Health')
@Controller()
export class HealthController {
  constructor(private prisma: PrismaService) {}

  @Get('health')
  @ApiOperation({ summary: 'Health check endpoint' })
  async check() {
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      return { status: 'ok', db: 'connected', timestamp: new Date().toISOString() };
    } catch {
      return { status: 'error', db: 'disconnected', timestamp: new Date().toISOString() };
    }
  }
}
