import { Inject, Injectable, Logger } from "@nestjs/common";

import { PORT } from "src/application/enums";
import { IRedisRepository } from "src/domain/interfaces";
import { MarryJamNotFound } from "src/application/exceptions";

@Injectable()
export class CloseMarryJam {
  private readonly logger = new Logger(CloseMarryJam.name);

  constructor(@Inject(PORT.Redis) private readonly redisRepository: IRedisRepository) {}

  async exec(userId: string): Promise<void> {
    const currentJam = await this.redisRepository.get("marry_" + userId);

    if (!Boolean(currentJam)) throw new MarryJamNotFound();

    await this.redisRepository.del("marry_" + userId);
  }
}
