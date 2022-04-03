import { Module } from '@nestjs/common';
import { BoardController } from './board.controller';
import { BoardService } from './board.service';
import { BoardProviders } from './board.providers';
import { AuthModule } from '../auth/auth.module';
import { MariadbModule } from '../../config/mariadb.module';

@Module({
  imports: [AuthModule, MariadbModule],
  controllers: [BoardController],
  providers: [BoardService, ...BoardProviders],
})
export class BoardModule {}
