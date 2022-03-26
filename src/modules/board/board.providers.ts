import {Connection} from "typeorm";
import {BoardEntity} from "../../entity/board.entity";

export const BoardProviders = [
    {
        provide: 'BOARD_REPOSITORY',
        useFactory: (connection: Connection) => connection.getRepository(BoardEntity),
        inject: ['DATABASE_CONNECTION'],
    }
]
