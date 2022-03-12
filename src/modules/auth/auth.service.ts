import {Inject, Injectable, UnauthorizedException} from '@nestjs/common';
import {JwtService} from "@nestjs/jwt";
import {UserLoginApiDto} from "./dto/user-login-api.dto";
import {Repository} from "typeorm";
import {UserEntity} from "../../entity/user.entity";
import * as bcrypt from 'bcrypt';
import {IUserLoginInterface, IUserLoginPayload} from "./interface/login.interface";
import {UserRegisterApiDto} from "./dto/user-register-api.dto";

@Injectable()
export class AuthService {
    constructor(
        @Inject('USER_REPOSITORY')
        private userRepository: Repository<UserEntity>,
        private jwtService: JwtService,
    ) {
    }

    async userLogin(params: UserLoginApiDto): Promise<IUserLoginInterface> {
        const userInfo = await this.validateUser(params.loginId, params.password);

        const payload = {
            id: userInfo.id,
            name: userInfo.name,
            loginId: userInfo.loginId,
            phone: userInfo.phone,
            password: userInfo.password,
        } as IUserLoginPayload

        return {
            userInfo: payload,
            access_token: this.jwtService.sign(payload),
        };
    };

    async userRegister(userInfo: UserRegisterApiDto) {
        await this.userRepository.save(userInfo);
    };

    async idCheck(id: string): Promise<boolean> {
        return !await this.userRepository.findOne({where: {loginId: id}});
    };

    async transformPassword(password: string): Promise<string> {
        return await bcrypt.hash(password, 10);
    }

    async validateUser(loginId: string, password: string): Promise<UserEntity> {
        const userInfo = await this.userRepository.findOne({where: {loginId: loginId}});
        if (!userInfo) {
            throw new UnauthorizedException({'reason': '아이디 혹은 패스워드를 확인해주세요.'});
        }
        const match = await bcrypt.compare(password, userInfo.password);
        if (!match) {
            throw new UnauthorizedException({'reason': '아이디 혹은 패스워드를 확인해주세요.'});
        }
        return userInfo;
    }
}

