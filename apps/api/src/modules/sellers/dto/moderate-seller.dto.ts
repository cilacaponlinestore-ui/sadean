import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ModerateSellerDto {
  @ApiProperty({ example: 'Dokumen usaha tidak lengkap' })
  @IsString()
  @IsNotEmpty()
  reason: string;
}
