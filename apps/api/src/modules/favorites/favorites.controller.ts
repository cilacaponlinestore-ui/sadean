import { Controller, Get, Post, Param, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { FavoritesService } from './favorites.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Favorites')
@Controller('favorites')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class FavoritesController {
  constructor(private favoritesService: FavoritesService) {}

  @Get()
  @ApiOperation({ summary: 'Get user favorites' })
  async list(@Req() req: any) {
    return this.favoritesService.list(req.user.sub);
  }

  @Post(':productId/toggle')
  @ApiOperation({ summary: 'Toggle product favorite' })
  async toggle(@Req() req: any, @Param('productId') productId: string) {
    return this.favoritesService.toggle(req.user.sub, productId);
  }

  @Get(':productId/check')
  @ApiOperation({ summary: 'Check if product is favorited' })
  async check(@Req() req: any, @Param('productId') productId: string) {
    return this.favoritesService.check(req.user.sub, productId);
  }
}
