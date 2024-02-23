import { Inject, Injectable, Logger } from "@nestjs/common";
import { v4 } from "uuid";

import { PORT } from "src/application/enums";
import { IRedisRepository, IUserRepository } from "src/domain/interfaces";

@Injectable()
export class RequestRecovery {
  private readonly logger = new Logger(RequestRecovery.name);

  constructor(
    @Inject(PORT.User) private readonly userRepository: IUserRepository,
    @Inject(PORT.Redis) private readonly redisRepository: IRedisRepository,
  ) {}

  async exec(email: string): Promise<string> {
    const user = await this.userRepository.findOne({ query: { email } });
    const token = v4();

    if (!Boolean(user)) return token;

    await this.redisRepository.set(token, JSON.stringify({ userId: user._id }));

    return token;
  }
}
