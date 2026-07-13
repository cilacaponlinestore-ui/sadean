import { IsString, IsOptional, MinLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateSellerDto {
  @ApiPropertyOptional({ example: 'Toko Dodol Mak Updated' })
  @IsOptional()
  @IsString()
  @MinLength(3)
  storeName?: string;

  @ApiPropertyOptional({ example: 'Updated description' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: 'Jl. Updated No. 2' })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({ example: '081234567891' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({ example: '6281234567891' })
  @IsOptional()
  @IsString()
  whatsapp?: string;

  @ApiPropertyOptional({ example: 'https://xyz.supabase.co/storage/v1/object/public/sadean/logos/uuid.jpg' })
  @IsOptional()
  @IsString()
  logo?: string;
}