import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * Main Pay Bill Key Create API DTO
 */
export class RegularCardRegisterApiDto {
  @ApiProperty({
    description: '생년월일',
  })
  @IsString()
  readonly birthDay: string;

  @ApiProperty({
    description: '카드번호',
  })
  @IsString()
  readonly cardNo: string;

  @ApiProperty({
    description: '유효기간',
  })
  @IsString()
  readonly expd: string;
}
