import {Module} from '@nestjs/common';
import {MainPayService} from './main-pay.service';
import {MainPayController} from './main-pay.controller';
import {MariadbModule} from "../../config/mariadbModule";
import {HttpModule} from "@nestjs/axios";
import {MainPayProviders} from "./main-pay.providers";

@Module({
    imports: [MariadbModule, HttpModule],
    controllers: [MainPayController],
    providers: [
        MainPayService,
        ...MainPayProviders,
    ]
})
export class MainPayModule {
}
