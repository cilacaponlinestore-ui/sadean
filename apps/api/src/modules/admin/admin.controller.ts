import { Controller, Delete, Get, Param, Patch, Query, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Roles } from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminService } from './admin.service';
import { AuditService } from '../../common/audit/audit.service';

@ApiTags('Admin')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
@Controller('admin')
export class AdminController {
  constructor(private adminService: AdminService, private auditService: AuditService) {}

  @Get('dashboard')
  @ApiOperation({ summary: 'Get admin dashboard analytics' })
  getDashboard() {
    return this.adminService.getDashboard();
  }

  @Get('products')
  @ApiOperation({ summary: 'Get products for admin moderation' })
  getProducts(@Query('page') page?: number, @Query('limit') limit?: number) {
    return this.adminService.getProducts(page, limit);
  }

  @Patch('products/:id/toggle-active')
  @ApiOperation({ summary: 'Toggle product active status' })
  async toggleProduct(@Param('id') id: string, @Req() req: any) {
    const result = await this.adminService.toggleProduct(id);
    await this.auditService.record({ actorId: req.user.sub, action: 'PRODUCT_TOGGLE_ACTIVE', entity: 'Product', entityId: id, metadata: { isActive: result.isActive } });
    return result;
  }

  @Delete('products/:id')
  @ApiOperation({ summary: 'Delete product through admin moderation' })
  async deleteProduct(@Param('id') id: string, @Req() req: any) {
    const result = await this.adminService.deleteProduct(id);
    await this.auditService.record({ actorId: req.user.sub, action: 'PRODUCT_DELETE', entity: 'Product', entityId: id });
    return result;
  }
}
