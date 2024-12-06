import { MockServiceType } from '../../../../test/types/mock-service.type';
import { RedisService } from '../redis.service';

export const redisServiceMock: MockServiceType<RedisService> = {
  set: jest.fn(),
  get: jest.fn(),
  del: jest.fn(),
};
