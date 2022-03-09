import {IsString} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";

export class UserLoginApiDto {
    @ApiProperty({
        description: 'id',
    })
    @IsString()
    userId: string;

    @ApiProperty({
        description: 'password',
    })
    @IsString()
    password: string;
}
