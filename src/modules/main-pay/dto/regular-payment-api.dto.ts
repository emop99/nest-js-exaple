import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class RegularPaymentApiDto {
  @ApiProperty({
    description: '결제 금액',
  })
  @IsNumber()
  amount: number;

  @ApiProperty({
    description: '상품명',
  })
  @IsString()
  goodsName: string;
}
