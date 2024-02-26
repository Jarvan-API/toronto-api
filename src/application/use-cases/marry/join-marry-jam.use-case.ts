import { Inject, Injectable, Logger } from "@nestjs/common";
import { Types } from "mongoose";

import { IMarryJam } from "src/domain/entities";
import { PORT } from "src/application/enums";
import { IRedisRepository, IUserRepository } from "src/domain/interfaces";
import { CannotJoinJam, MarryJamNotFound, UserNotFound } from "src/application/exceptions";

@Injectable()
export class JoinMarryJam {
  private readonly logger = new Logger(JoinMarryJam.name);

  constructor(
    @Inject(PORT.Redis) private readonly redisRepository: IRedisRepository,
    @Inject(PORT.User) private readonly userRepository: IUserRepository,
  ) {}

  async exec(userId: string, hostUserId: string): Promise<any> {
    if (userId === hostUserId) throw new CannotJoinJam();

    const user = await this.userRepository.findOne({ query: { _id: new Types.ObjectId(hostUserId) } });
    if (!Boolean(user)) throw new UserNotFound();

    const jamString = await this.redisRepository.get("marry_" + hostUserId);
    if (!Boolean(jamString)) throw new MarryJamNotFound();

    const jam: IMarryJam = JSON.parse(jamString);
    jam.spectators.push(userId);

    await this.redisRepository.set("marry_" + hostUserId, JSON.stringify(jam));
  }
}
