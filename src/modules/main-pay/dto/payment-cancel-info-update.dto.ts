import { IsNumber, IsString } from 'class-validator';

export class PaymentCancelInfoUpdateDto {
  @IsString()
  mbrRefNo: string;

  @IsNumber()
  isCancel: boolean;

  @IsString()
  cancelMsg: string;
}
