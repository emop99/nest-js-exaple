import { Body, Controller, Get, HttpCode, Post, Request, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { DefaultLogger } from "../../config/logger/default.logger";
import { BoardService } from "./board.service";
import { ListApiDto } from "./dto/list-api.dto";
import { Query } from "@nestjs/common/decorators/http/route-params.decorator";
import { JwtAuthGuard } from "../auth/guard/jwt-auth.guard";
import { WriteApiDto } from "./dto/write-api.dto";
import { ViewApiDto } from "./dto/view-api.dto";

@Controller('board')
@ApiTags('Board')
export class BoardController {
  private logger = new DefaultLogger('board', '/board');

  constructor(private readonly boardService: BoardService) {}

  @Get('list')
  @ApiOperation({
    description: '게시판 목록 가져오기',
  })
  @HttpCode(200)
  async getList(@Request() request, @Query() requestBody: ListApiDto) {
    return this.boardService.getList(requestBody);
  }

  @Post('write')
  @ApiOperation({
    description: '게시글 작성',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async write(@Request() req, @Body() requestBody: WriteApiDto) {
    await this.boardService.write({
      contents: requestBody.contents,
      subject: requestBody.subject,
      userId: req.user.id,
      writerId: req.user.loginId,
      writerName: req.user.name,
    });
  }

  @Get()
  @ApiOperation({
    description: '게시글 가져오기',
  })
  @HttpCode(200)
  async view(@Request() req, @Query() requestBody: ViewApiDto) {
    return await this.boardService.viewBoard(requestBody.no);
  }
}
