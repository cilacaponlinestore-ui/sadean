import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  UseGuards,
  Req,
  Query,
  NotFoundException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { SellersService } from './sellers.service';
import { CreateSellerDto } from './dto/create-seller.dto';
import { UpdateSellerDto } from './dto/update-seller.dto';
import { ModerateSellerDto } from './dto/moderate-seller.dto';
import { AuditService } from '../../common/audit/audit.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@ApiTags('Sellers')
@Controller('sellers')
export class SellersController {
  constructor(private sellersService: SellersService, private auditService: AuditService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create seller profile' })
  @ApiResponse({ status: 201, description: 'Seller profile created' })
  async create(@Req() req: any, @Body() dto: CreateSellerDto) {
    return this.sellersService.create(req.user.sub, dto);
  }

  @Get('my-store')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('seller')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get my store profile' })
  async getMyStore(@Req() req: any) {
    const store = await this.sellersService.findByUserIdSafe(req.user.sub);
    if (!store) throw new NotFoundException('Anda belum mendaftarkan toko');
    return store;
  }

  @Get('dashboard')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('seller')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get seller dashboard' })
  async getDashboard(@Req() req: any) {
    const seller = await this.sellersService.findByUserIdSafe(req.user.sub);
    if (!seller) {
      return { stats: { totalProducts: 0, totalOrders: 0, pendingOrders: 0, totalRevenue: 0 }, recentOrders: [] };
    }
    return this.sellersService.getDashboard(seller.id);
  }

  @Get('public')
  @ApiOperation({ summary: 'Get verified active sellers' })
  async findPublic() {
    return this.sellersService.findPublic();
  }

  @Get(':slug')
  @ApiOperation({ summary: 'Get seller by slug' })
  async findBySlug(@Param('slug') slug: string) {
    return this.sellersService.findBySlug(slug);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all sellers (Admin only)' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'status', required: false })
  @ApiQuery({ name: 'search', required: false })
  async findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('status') status?: string,
    @Query('search') search?: string,
  ) {
    return this.sellersService.findAll({ page, limit, status, search });
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update seller profile' })
  async update(
    @Param('id') id: string,
    @Req() req: any,
    @Body() dto: UpdateSellerDto,
  ) {
    return this.sellersService.update(id, req.user.sub, dto);
  }

  @Put(':id/verify')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Verify seller (Admin only)' })
  async verify(@Param('id') id: string, @Req() req: any) {
    const result = await this.sellersService.approve(id, req.user.sub);
    await this.auditService.record({ actorId: req.user.sub, action: 'SELLER_APPROVE', entity: 'Seller', entityId: id });
    return result;
  }

  @Put(':id/toggle-active')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Toggle seller active status (Admin only)' })
  async toggleActive(@Param('id') id: string, @Req() req: any) {
    const result = await this.sellersService.toggleActive(id, req.user.sub);
    await this.auditService.record({ actorId: req.user.sub, action: result.isActive ? 'SELLER_ACTIVATE' : 'SELLER_SUSPEND', entity: 'Seller', entityId: id, metadata: { isActive: result.isActive } });
    return result;
  }

  @Put(':id/approve')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  async approve(@Param('id') id: string, @Req() req: any) {
    const result = await this.sellersService.approve(id, req.user.sub);
    await this.auditService.record({ actorId: req.user.sub, action: 'SELLER_APPROVE', entity: 'Seller', entityId: id });
    return result;
  }

  @Put(':id/reject')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  async reject(@Param('id') id: string, @Req() req: any, @Body() dto: ModerateSellerDto) {
    const result = await this.sellersService.reject(id, req.user.sub, dto.reason);
    await this.auditService.record({ actorId: req.user.sub, action: 'SELLER_REJECT', entity: 'Seller', entityId: id, metadata: { reason: dto.reason } });
    return result;
  }

  @Put(':id/suspend')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  async suspend(@Param('id') id: string, @Req() req: any, @Body() dto: ModerateSellerDto) {
    const result = await this.sellersService.suspend(id, req.user.sub, dto.reason);
    await this.auditService.record({ actorId: req.user.sub, action: 'SELLER_SUSPEND', entity: 'Seller', entityId: id, metadata: { reason: dto.reason } });
    return result;
  }

  @Put(':id/activate')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  async activate(@Param('id') id: string, @Req() req: any) {
    const result = await this.sellersService.activate(id, req.user.sub);
    await this.auditService.record({ actorId: req.user.sub, action: 'SELLER_ACTIVATE', entity: 'Seller', entityId: id });
    return result;
  }
}
