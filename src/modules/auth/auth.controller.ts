import {Body, Controller, Get, HttpCode, Post, Res, UnauthorizedException, UseGuards, Request, Logger} from '@nestjs/common';
import {AuthService} from "./auth.service";
import {ApiBearerAuth, ApiOperation, ApiTags} from "@nestjs/swagger";
import {UserLoginApiDto} from "./dto/user-login-api.dto";
import {Response} from "express";
import {UserRegisterApiDto} from "./dto/user-register-api.dto";
import {JwtAuthGuard} from "./guard/jwt-auth.guard";
import {DefaultLogger} from "../../config/logger/default.logger";

@Controller('auth')
@ApiTags('auth')
export class AuthController {
    private logger = new DefaultLogger('auth');

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
        const loginResult = await this.authService.userLogin(requestBody);
        res.setHeader('Authorization', 'Bearer ' + loginResult.access_token);
        return res.json(loginResult.userInfo);
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
            this.logger.error('userRegister::Error', e);
            throw new UnauthorizedException({'reason': '저장 중 오류가 발생하였습니다.'});
        }
    };

    @HttpCode(200)
    @Get('loginCheck')
    @ApiOperation({
        description: '유저 로그인 여부 체크',
    })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    async loginCheck(@Request() req) {
        return req.user;
    };
}
