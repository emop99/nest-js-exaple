import { Inject, Injectable } from "@nestjs/common";
import { BoardEntity } from "../../entity/board.entity";
import { Repository } from "typeorm";
import { ListApiDto } from "./dto/list-api.dto";
import { ListSearchKey } from "./interface/list.interface";
import { BoardDto } from "./dto/board.dto";

@Injectable()
export class BoardService {
  constructor(
    @Inject('BOARD_REPOSITORY')
    private boardRepository: Repository<BoardEntity>,
  ) {}

  public async getList(searchData: ListApiDto) {
    let searchTextWhere = {};
    if (searchData.searchText) {
      switch (searchData.searchKey) {
        case ListSearchKey.writerName:
          searchTextWhere = { writerName: searchData.searchText };
          break;
        case ListSearchKey.subject:
          searchTextWhere = { subject: searchData.searchText };
          break;
        case ListSearchKey.contents:
          searchTextWhere = { contents: searchData.searchText };
          break;
      }
    }
    return this.boardRepository.find({
      where: searchTextWhere,
    });
  }

  public async write(boardDto: BoardDto): Promise<void> {
    await this.boardRepository.save(boardDto);
  }

  public async viewBoard(no: number) {
    await this.viewCountUp(no);
    return await this.boardRepository.findOne(no);
  }

  public async viewCountUp(no: number) {
    await this.boardRepository.increment({ id: no }, 'viewCnt', 1);
  }
}
