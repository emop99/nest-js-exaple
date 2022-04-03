import { ApiProperty } from "@nestjs/swagger";
import { IsNumber } from "class-validator";

export class ViewApiDto {
  @ApiProperty({
    description: '글 번호',
  })
  @IsNumber()
  no: number;
}
