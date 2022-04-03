import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UserLoginApiDto {
  @ApiProperty({
    description: 'id',
    example: 'emop',
  })
  @IsString()
  loginId: string;

  @ApiProperty({
    description: 'password',
    example: '1234',
  })
  @IsString()
  password: string;
}
