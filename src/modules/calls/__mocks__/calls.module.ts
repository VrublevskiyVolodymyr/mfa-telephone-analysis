import { RedisService } from '../../redis/redis.service';
import { FileStorageService } from '../../file-storage/services/file-storage.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CallEntity } from '../../../database/entities/call.entity';
import { CategoryEntity } from '../../../database/entities/category.entity';
import { callServiceMock } from './calls.service';
import { AudioService } from '../services/audio.service';
import { CallsService } from '../services/calls.service';

export const callMockProviders = [
  {
    provide: CallsService,
    useValue: callServiceMock,
  },
  {
    provide: AudioService,
  },
  {
    provide: RedisService,
  },
  {
    provide: FileStorageService,
  },
  {
    provide: getRepositoryToken(CallEntity),
  },
  {
    provide: getRepositoryToken(CategoryEntity),
  },
];
