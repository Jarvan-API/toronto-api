import { Inject, Injectable, Logger } from "@nestjs/common";
import { Types } from "mongoose";

import { PORT } from "src/application/enums";
import { InvalidToken, UserNotFound } from "src/application/exceptions";
import { IRedisRepository, IUserRepository } from "src/domain/interfaces";
import { BcryptService } from "src/infrastructure/config";

@Injectable()
export class ChangePassword {
  private readonly logger = new Logger(ChangePassword.name);

  constructor(
    @Inject(PORT.User) private readonly userRepository: IUserRepository,
    @Inject(PORT.Redis) private readonly redisRepository: IRedisRepository,
    private readonly bcryptService: BcryptService,
  ) {}

  async exec(password: string, token: string): Promise<any> {
    try {
      const userId = await this.redisRepository.get(token);
      console.log(userId);
      if (!Boolean(userId)) throw new InvalidToken();

      const user = await this.userRepository.findOne({ _id: new Types.ObjectId(userId) });

      if (!Boolean(user)) throw new UserNotFound();

      const hashedPassword = await this.bcryptService.encriptPassword(password);

      await this.userRepository.update(userId, { password: hashedPassword });

      await this.redisRepository.del(token);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
