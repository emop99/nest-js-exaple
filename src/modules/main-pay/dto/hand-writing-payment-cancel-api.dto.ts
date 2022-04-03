import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class HandWritingPaymentCancelApiDto {
  @ApiProperty({
    description: '결제 코드',
  })
  @IsString()
  mbrRefNo: string;
}
