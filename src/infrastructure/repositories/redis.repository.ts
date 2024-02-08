import { Inject, Injectable, Logger } from "@nestjs/common";
import { Redis } from "ioredis";

import { Entity } from "src/application/enums";
import { IRedisRepository } from "src/domain/interfaces";

@Injectable()
export class RedisRepository implements IRedisRepository {
  private readonly logger: Logger = new Logger(RedisRepository.name);

  constructor(@Inject(Entity.Redis) private readonly client: Redis) {}

  async set(key: string, value: any, ttl?: number): Promise<void> {
    await this.client.set(key, value);
  }

  async get(key: string): Promise<any> {
    return await this.client.get(key);
  }

  async del(key: string): Promise<void> {
    this.client.del(key);
  }
}
