import { IsString, IsOptional, IsBoolean, IsNumber, IsDateString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateBannerDto {
  @ApiProperty({ example: 'Promo Spesial' })
  @IsString()
  title: string;

  @ApiProperty({ example: 'https://example.com/banner.jpg' })
  @IsString()
  imageUrl: string;

  @ApiPropertyOptional({ example: '/products/uuid' })
  @IsOptional()
  @IsString()
  link?: string;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @IsNumber()
  sortOrder?: number;

  @ApiPropertyOptional({ example: '2026-07-01' })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiPropertyOptional({ example: '2026-07-31' })
  @IsOptional()
  @IsDateString()
  endDate?: string;
}