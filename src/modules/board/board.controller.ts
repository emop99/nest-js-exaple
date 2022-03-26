import {Body, Controller, Get, HttpCode, Request} from '@nestjs/common';
import {ApiOperation, ApiTags} from "@nestjs/swagger";
import {DefaultLogger} from "../../config/logger/default.logger";
import {BoardService} from "./board.service";
import {ListApiDto} from "./dto/list-api.dto";
import {Query} from "@nestjs/common/decorators/http/route-params.decorator";

@Controller('board')
@ApiTags('Board')
export class BoardController {
    private logger = new DefaultLogger('board', '/board');

    constructor(
        private readonly boardService: BoardService
    ) {
    }

    @Get('list')
    @ApiOperation({
        description: '게시판 목록 가져오기',
    })
    @HttpCode(200)
    async getList(
        @Request() request,
        @Query() requestBody: ListApiDto
    ) {
        return this.boardService.getList(requestBody);
    }
}
