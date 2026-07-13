import { IsString, IsArray, ArrayMinSize, ValidateNested, IsUUID, IsInt, Min, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

class OrderItemDto {
  @ApiProperty({ example: 'uuid-product-id' })
  @IsUUID()
  productId: string;

  @ApiProperty({ example: 2 })
  @IsInt()
  @Min(1)
  quantity: number;
}

export class CreateOrderDto {
  @ApiProperty({ example: 'uuid-seller-id' })
  @IsUUID()
  sellerId: string;

  @ApiProperty({ type: [OrderItemDto] })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];

  @ApiProperty({ example: 'John Doe' })
  @IsString()
  shippingName: string;

  @ApiProperty({ example: '081234567890' })
  @IsString()
  shippingPhone: string;

  @ApiProperty({ example: 'Jl. Merdeka No. 1, Cilacap' })
  @IsString()
  shippingAddress: string;

  @ApiPropertyOptional({ example: 'Tolong packing yang rapi' })
  @IsOptional()
  @IsString()
  notes?: string;
}