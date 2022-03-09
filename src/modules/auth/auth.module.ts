import {Module} from '@nestjs/common';
import {AuthService} from "./auth.service";
import {AuthController} from "./auth.controller";
import {JwtModule} from "@nestjs/jwt";
import {AuthProviders} from "./auth.providers";
import {MariadbModule} from "../../config/mariadbModule";

@Module({
    imports: [
        MariadbModule,
        AuthModule,
        JwtModule.registerAsync({
            useFactory: () => ({
                secret: process.env.JWT_SECRET,
                signOptions: { expiresIn: '3600s' },
            }),
        }),
    ],
    controllers: [AuthController],
    providers: [AuthService, ...AuthProviders],

})
export class AuthModule {
}
