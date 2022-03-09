import {Inject, Injectable} from '@nestjs/common';
import {JwtService} from "@nestjs/jwt";
import {UserLoginApiDto} from "./dto/user-login-api.dto";
import {Repository} from "typeorm";
import {UserEntity} from "../../entity/user.entity";
import * as bcrypt from 'bcrypt';
import {IUserLoginPayload} from "./interface/login.interface";
import {UserRegisterApiDto} from "./dto/user-register-api.dto";

@Injectable()
export class AuthService {
    constructor(
        @Inject('USER_REPOSITORY')
        private userRepository: Repository<UserEntity>,
        private jwtService: JwtService,
    ) {
    }

    async userLogin(params: UserLoginApiDto): Promise<string> {
        const userInfo = await this.userRepository.findOne({
            where: {
                loginId: params.userId,
            }
        });

        if (!userInfo) {
            return '';
        }

        const match = await bcrypt.compare(params.password, userInfo.password);

        if (!match) {
            return '';
        }

        const payload = {
            id: userInfo.id,
            name: userInfo.name,
            loginId: userInfo.loginId,
            phone: userInfo.phone,
        } as IUserLoginPayload

        return this.jwtService.sign(payload);
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
}

