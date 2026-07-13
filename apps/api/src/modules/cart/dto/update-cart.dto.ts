import { IsNumber, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateCartDto {
  @ApiProperty({ example: 2 })
  @IsNumber()
  @Min(0)
  quantity: number;
}