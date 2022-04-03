import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class WriteApiDto {
  @ApiProperty({
    description: '글 제목',
  })
  @IsString()
  subject: string;

  @ApiProperty({
    description: '글 내용',
  })
  @IsString()
  contents: string;
}
