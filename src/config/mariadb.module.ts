import { Module } from '@nestjs/common';
import { MariadbProviders } from './providers/database/mariadb.providers';

@Module({
  providers: [...MariadbProviders],
  exports: [...MariadbProviders],
})
export class MariadbModule {}
