import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';
import {SwaggerModule} from "@nestjs/swagger";
import {SwaggerProviders} from "./config/providers/swagger.providers";

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    // Swagger Document
    SwaggerModule.setup('api/v1/docs', app, SwaggerModule.createDocument(app, (new SwaggerProviders()).init()));

    await app.listen(process.env.PORT);
}

bootstrap();
