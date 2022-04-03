import { IsNumber, IsString } from 'class-validator';

/**
 * Main Pay Bill Key Database Insert DTO
 */
export class RegularCardRegisterDto {
  @IsString()
  readonly billKey: string;

  @IsString()
  readonly cardName: string;

  @IsString()
  readonly cardNo: string;

  @IsString()
  readonly customerName: string;

  @IsString()
  readonly customerTelNo: string;

  @IsString()
  readonly mbrNo: string;

  @IsString()
  readonly mbrRefNo: string;

  @IsString()
  readonly refNo: string;

  @IsNumber()
  readonly userId: number;
}
