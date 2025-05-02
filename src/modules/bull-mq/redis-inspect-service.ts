// src/redis/redis-inspect-service.ts
import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisInspectService {
  private readonly redis: Redis;

  constructor() {
    this.redis = new Redis({
      host: process.env.REDIS_HOST,
      port: Number(process.env.REDIS_PORT) || 6380,
      password: process.env.REDIS_PASSWORD,
      tls: {},
    });
  }

  async getAllKeys(pattern = '*'): Promise<string[]> {
    return this.redis.keys(pattern);
  }

  async getValueByKey(key: string): Promise<any> {
    const type = await this.redis.type(key);
    switch (type) {
      case 'string':
        return this.redis.get(key);
      case 'hash':
        return this.redis.hgetall(key);
      case 'list':
        return this.redis.lrange(key, 0, -1);
      case 'set':
        return this.redis.smembers(key);
      case 'zset':
        return this.redis.zrange(key, 0, -1, 'WITHSCORES');
      default:
        return `Unknown type for key: ${key}`;
    }
  }

  async getAllKeysWithValues(pattern = '*') {
    const keys = await this.getAllKeys(pattern);
    const result = {};
    for (const key of keys) {
      result[key] = await this.getValueByKey(key);
    }
    return result;
  }
}
