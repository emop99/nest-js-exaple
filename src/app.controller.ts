import {Controller, Get, NotFoundException, Post, UnauthorizedException} from '@nestjs/common';
import {AppService} from './app.service';

@Controller()
export class AppController {
    constructor(private readonly appService: AppService) {
    }

    @Get()
    firstPage() {
        throw new NotFoundException();
    };
}
