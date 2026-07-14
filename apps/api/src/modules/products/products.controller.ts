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
  Query,
  ForbiddenException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@ApiTags('Products')
@Controller('products')
export class ProductsController {
  constructor(private productsService: ProductsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('seller')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create new product (Seller only)' })
  @ApiResponse({ status: 201, description: 'Product created' })
  async create(@Req() req: any, @Body() dto: CreateProductDto) {
    const seller = req.user.seller;
    if (!seller) throw new ForbiddenException('Seller profile not found');
    if (!seller.isVerified) throw new ForbiddenException('Akun seller Anda belum diverifikasi. Produk hanya bisa ditambahkan setelah toko disetujui admin.');
    if (!seller.isActive) throw new ForbiddenException('Akun seller Anda sedang dinonaktifkan. Hubungi admin.');
    return this.productsService.create(seller.id, dto);
  }

  @Get('my-products')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('seller')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get my products (Seller only)' })
  async getMyProducts(@Req() req: any) {
    const seller = req.user.seller;
    if (!seller) throw new ForbiddenException('Seller profile not found');
    return this.productsService.findBySellerId(seller.id);
  }

  @Get()
  @ApiOperation({ summary: 'Get all products' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'category', required: false })
  @ApiQuery({ name: 'seller', required: false })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'minPrice', required: false })
  @ApiQuery({ name: 'maxPrice', required: false })
  @ApiQuery({ name: 'sort', required: false })
  async findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('category') category?: string,
    @Query('seller') seller?: string,
    @Query('search') search?: string,
    @Query('minPrice') minPrice?: number,
    @Query('maxPrice') maxPrice?: number,
    @Query('sort') sort?: string,
  ) {
    return this.productsService.findAll({
      page,
      limit,
      category,
      seller,
      search,
      minPrice,
      maxPrice,
      sort,
    });
  }

  @Get('slug/:slug')
  @ApiOperation({ summary: 'Get product by slug' })
  async findBySlug(@Param('slug') slug: string) {
    return this.productsService.findBySlug(slug);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get product by ID' })
  async findById(@Param('id') id: string) {
    return this.productsService.findById(id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('seller')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update product (Seller only)' })
  async update(
    @Param('id') id: string,
    @Req() req: any,
    @Body() dto: UpdateProductDto,
  ) {
    const seller = req.user.seller;
    if (!seller) throw new ForbiddenException('Seller profile not found');
    return this.productsService.update(id, seller.id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('seller')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete product (Seller only)' })
  async delete(@Param('id') id: string, @Req() req: any) {
    const seller = req.user.seller;
    if (!seller) throw new ForbiddenException('Seller profile not found');
    return this.productsService.delete(id, seller.id);
  }

  @Post(':id/images')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('seller')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Add product image (Seller only)' })
  async addImage(
    @Param('id') id: string,
    @Req() req: any,
    @Body('imageUrl') imageUrl: string,
    @Body('isPrimary') isPrimary?: boolean,
  ) {
    const seller = req.user.seller;
    if (!seller) throw new ForbiddenException('Seller profile not found');
    return this.productsService.addImage(id, seller.id, imageUrl, isPrimary);
  }

  @Delete(':id/images/:imageId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('seller')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete product image (Seller only)' })
  async deleteImage(
    @Param('id') id: string,
    @Param('imageId') imageId: string,
    @Req() req: any,
  ) {
    const seller = req.user.seller;
    if (!seller) throw new ForbiddenException('Seller profile not found');
    return this.productsService.deleteImage(imageId, seller.id);
  }
}