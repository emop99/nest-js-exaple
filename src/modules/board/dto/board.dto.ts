import { IsNumber, IsString } from "class-validator";

export class BoardDto {
  @IsString()
  writerName: string;

  @IsString()
  writerId: string;

  @IsString()
  subject: string;

  @IsString()
  contents: string;

  @IsNumber()
  userId: number;
}
