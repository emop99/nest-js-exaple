import { IsBoolean, IsEnum, IsNumber, IsString } from 'class-validator';
import {
  MainPayPaymentServiceName,
  MainPayResponsePayMethod,
} from '../../../entity/main-pay-response.entity';

export class RegularCardPaymentResponseDto {
  @IsString()
  mbrRefNo: string;

  @IsString()
  mbrNo: string;

  @IsEnum(MainPayPaymentServiceName)
  paymentService: string;

  @IsNumber()
  amount: number;

  @IsNumber()
  taxAmt: number;

  @IsString()
  signature: string;

  @IsString()
  billKey: string;

  @IsBoolean()
  payAuto: boolean;

  @IsString()
  failMsg: string;

  @IsBoolean()
  isFail: boolean;

  @IsString()
  refNo: string;

  @IsString()
  timestamp: string;

  @IsEnum(MainPayResponsePayMethod)
  payMethod: string;

  @IsString()
  applyNo: string;

  @IsString()
  payType: string;

  @IsNumber()
  userId: number;
}
