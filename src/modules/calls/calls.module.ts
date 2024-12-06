import { Module } from '@nestjs/common';
import { CallsService } from './services/calls.service';
import { CallsController } from './calls.controller';
import { FileStorageModule } from '../file-storage/file-storage.module';
import { AudioService } from './services/audio.service';
import { TranscriptionService } from './services/transcription.service';
import { CallEntity } from '../../database/entities/call.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoggerService } from '../logger/logger.service';
import { HttpModule } from '@nestjs/axios';
import Sentiment from 'sentiment';
import { CategoryEntity } from '../../database/entities/category.entity';
import { RedisModule } from '../redis/redis.module';
import { RedisService } from '../redis/redis.service';
import { BullModule } from '@nestjs/bull';
import { CallProcessor } from './services/calls.processor';
import { CallRepository } from '../repository/services/call.repository';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    FileStorageModule,
    HttpModule,
    TypeOrmModule.forFeature([CategoryEntity, CallEntity, CallRepository]),
    RedisModule,
    BullModule.registerQueueAsync({
      imports: [],
      name: 'callQueue',
      useFactory: async (configService: ConfigService) => ({
        redis: {
          host: configService.get('redis.host'),
          port: configService.get('redis.port'),
          password: configService.get('redis.password'),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [CallsController],
  providers: [
    CallsService,
    AudioService,
    TranscriptionService,
    LoggerService,
    RedisService,
    CallProcessor,
    {
      provide: 'Sentiment',
      useFactory: () => {
        return new Sentiment();
      },
    },
  ],
})
export class CallsModule {}
