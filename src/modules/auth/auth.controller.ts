import {Body, Controller, HttpCode, Post, Res, UnauthorizedException} from '@nestjs/common';
import {AuthService} from "./auth.service";
import {ApiOperation, ApiTags} from "@nestjs/swagger";
import {UserLoginApiDto} from "./dto/user-login-api.dto";
import {IUserLoginResponse} from "./interface/login.interface";
import {Response} from "express";
import {UserRegisterApiDto} from "./dto/user-register-api.dto";

@Controller('auth')
@ApiTags('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
    ) {
    }

    @HttpCode(200)
    @Post('userLogin')
    @ApiOperation({
        description: '유저 로그인',
    })
    async userLogin(
        @Body() requestBody: UserLoginApiDto,
        @Res() res: Response,
    ) {
        const token = await this.authService.userLogin(requestBody);
        if (!token) {
            throw new UnauthorizedException({'reason': '아이디 혹은 패스워드를 확인해주세요.'});
        }
        res.setHeader('Set-Cookie', token);
        return res.json({token: token} as IUserLoginResponse);
    };

    @HttpCode(200)
    @Post('userRegister')
    @ApiOperation({
        description: '유저 회원가입',
    })
    async userRegister(
        @Body() requestBody: UserRegisterApiDto
    ) {
        if (!await this.authService.idCheck(requestBody.loginId)) {
            throw new UnauthorizedException({'reason': '중복된 아이디 입니다.'});
        }

        try {
            requestBody.password = await this.authService.transformPassword(requestBody.password);
            await this.authService.userRegister(requestBody);
        } catch (e) {
            throw new UnauthorizedException({'reason': '저장 중 오류가 발생하였습니다.'});
        }
    };
}
