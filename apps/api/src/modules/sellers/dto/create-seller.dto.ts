import { IsString, IsOptional, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateSellerDto {
  @ApiProperty({ example: 'Toko Dodol Mak' })
  @IsString()
  @MinLength(3)
  storeName: string;

  @ApiPropertyOptional({ example: 'Dodol khas Cilacap' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: 'Jl. Merdeka No. 1' })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({ example: '081234567890' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({ example: '6281234567890' })
  @IsOptional()
  @IsString()
  whatsapp?: string;
}