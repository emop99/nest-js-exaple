import {Module} from '@nestjs/common';
import {MainPayService} from './main-pay.service';
import {MainPayController} from './main-pay.controller';
import {MariadbModule} from "../../config/mariadb.module";
import {HttpModule} from "@nestjs/axios";
import {MainPayProviders} from "./main-pay.providers";
import {AuthModule} from "../auth/auth.module";

@Module({
    imports: [MariadbModule, HttpModule, AuthModule],
    controllers: [MainPayController],
    providers: [
        MainPayService,
        ...MainPayProviders,
    ]
})
export class MainPayModule {
}
