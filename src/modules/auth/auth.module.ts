import {Module} from '@nestjs/common';
import {AuthService} from "./auth.service";
import {AuthController} from "./auth.controller";
import {JwtModule} from "@nestjs/jwt";
import {AuthProviders} from "./auth.providers";
import {MariadbModule} from "../../config/mariadbModule";
import {PassportModule} from "@nestjs/passport";
import {JwtStrategy} from "./strategies/jwt-auth.strategy";

@Module({
    imports: [
        MariadbModule,
        AuthModule,
        PassportModule,
        JwtModule.registerAsync({
            useFactory: () => ({
                secret: process.env.JWT_SECRET,
                signOptions: { expiresIn: '3600s' },
            }),
        }),
    ],
    controllers: [AuthController],
    providers: [AuthService, ...AuthProviders, JwtStrategy],

})
export class AuthModule {
}
