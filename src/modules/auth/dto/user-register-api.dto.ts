import {ApiProperty} from "@nestjs/swagger";
import {IsString} from "class-validator";

export class UserRegisterApiDto {
    @ApiProperty({
        description: '이름',
    })
    @IsString()
    name: string;

    @ApiProperty({
        description: '비밀번호',
    })
    @IsString()
    password: string;

    @ApiProperty({
        description: '핸드폰 번호',
    })
    @IsString()
    phone: string;

    @ApiProperty({
        description: '로그인 ID',
    })
    @IsString()
    loginId: string;
}
