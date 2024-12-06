import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import configuration from '../config/configuration';
import { PostgresModule } from './postgres/postgres.module';
import { LoggerModule } from './logger/logger.module';
import { RepositoryModule } from './repository/repository.module';
import { CategoryModule } from './category/category.module';
import { FileStorageModule } from './file-storage/file-storage.module';
import { CallsModule } from './calls/calls.module';
import { RedisModule } from './redis/redis.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),
    PostgresModule,
    LoggerModule,
    RepositoryModule,
    CategoryModule,
    CallsModule,
    FileStorageModule,
    RedisModule,
  ],
})
export class AppModule {}
