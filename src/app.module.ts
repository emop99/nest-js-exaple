import {Module} from '@nestjs/common';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {ConfigModule} from '@nestjs/config';
import {MainPayModule} from './modules/main-pay/main-pay.module';
import {MariadbModule} from "./config/mariadbModule";
import {AuthModule} from './modules/auth/auth.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: process.env.APP_ENV === 'dev' ? '.env.dev' : '.env.local',
            ignoreEnvFile: process.env.APP_ENV === 'prod',
        }),
        MariadbModule,
        MainPayModule,
        AuthModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {
}
