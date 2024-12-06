import { Inject, Injectable } from '@nestjs/common';
import { Redis } from 'ioredis';

import { REDIS_CLIENT } from './redis.constants';

@Injectable()
export class RedisService {
  constructor(
    @Inject(REDIS_CLIENT)
    private readonly redisClient: Redis,
  ) {}

  public async set(key: string, value: string): Promise<void> {
    await this.redisClient.set(key, value);
  }

  public async get(key: string): Promise<string | null> {
    return this.redisClient.get(key);
  }

  public async del(key: string): Promise<void> {
    await this.redisClient.del(key);
  }
}
