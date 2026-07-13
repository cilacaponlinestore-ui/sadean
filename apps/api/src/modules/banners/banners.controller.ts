import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { BannersService } from './banners.service';
import { CreateBannerDto } from './dto/create-banner.dto';
import { UpdateBannerDto } from './dto/update-banner.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { AuditService } from '../../common/audit/audit.service';

@ApiTags('Banners')
@Controller('banners')
export class BannersController {
  constructor(private bannersService: BannersService, private auditService: AuditService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create new banner (Admin only)' })
  @ApiResponse({ status: 201, description: 'Banner created' })
  async create(@Body() dto: CreateBannerDto, @Req() req: any) {
    const result = await this.bannersService.create(dto);
    await this.auditService.record({ actorId: req.user.sub, action: 'BANNER_CREATE', entity: 'Banner', entityId: result.id });
    return result;
  }

  @Get()
  @ApiOperation({ summary: 'Get active banners' })
  async findAll() {
    return this.bannersService.findAll();
  }

  @Get('admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all banners (Admin only)' })
  async findAllAdmin() {
    return this.bannersService.findAllAdmin();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get banner by ID' })
  async findById(@Param('id') id: string) {
    return this.bannersService.findById(id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update banner (Admin only)' })
  async update(@Param('id') id: string, @Body() dto: UpdateBannerDto, @Req() req: any) {
    const result = await this.bannersService.update(id, dto);
    await this.auditService.record({ actorId: req.user.sub, action: 'BANNER_UPDATE', entity: 'Banner', entityId: id });
    return result;
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete banner (Admin only)' })
  async delete(@Param('id') id: string, @Req() req: any) {
    const result = await this.bannersService.delete(id);
    await this.auditService.record({ actorId: req.user.sub, action: 'BANNER_DELETE', entity: 'Banner', entityId: id });
    return result;
  }
}
