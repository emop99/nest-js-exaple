import {IsNumber, IsString} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";

export class HandWritingPaymentApiDto {
    @ApiProperty({
        description: '카드 번호'
    })
    @IsString()
    cardNo: string;

    @ApiProperty({
        description: '생년월일'
    })
    @IsString()
    expd: string;

    @ApiProperty({
        description: '할부 개월 수 (2자리)',
        default: '00',
    })
    @IsString()
    installment: string;

    @ApiProperty({
        description: '결제 금액',
        default: '1000',
    })
    @IsString()
    amount: string;

    @ApiProperty({
        description: '상품명',
        default: 'TEST Goods',
    })
    @IsString()
    goodsName: string;
}
