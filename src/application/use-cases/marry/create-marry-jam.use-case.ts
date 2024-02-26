import { Inject, Injectable, Logger } from "@nestjs/common";
import { Types } from "mongoose";

import { EActionType, IHaremHistory, IMarryJam } from "src/domain/entities";
import { PORT } from "src/application/enums";
import { ICharacterRepository, IHaremRepository, IRedisRepository, IUserRepository } from "src/domain/interfaces";
import { InsufficientKakera, MarryJamAlreadyStarted } from "src/application/exceptions";

@Injectable()
export class CreateMarryJam {
  private readonly logger = new Logger(CreateMarryJam.name);
  private readonly kakeraCost = 1500;

  constructor(
    @Inject(PORT.Redis) private readonly redisRepository: IRedisRepository,
    @Inject(PORT.Character) private readonly characterRepository: ICharacterRepository,
    @Inject(PORT.User) private readonly userRepository: IUserRepository,
    @Inject(PORT.Harem) private readonly haremRepository: IHaremRepository,
  ) {}

  async exec(userId: string, reason: string): Promise<IMarryJam> {
    // reduce kakera
    const user = await this.userRepository.findOne({ query: { _id: new Types.ObjectId(userId) }, populate: "harem" });

    const kakera = user.harem?.["kakera"];

    if (kakera < this.kakeraCost) throw new InsufficientKakera();

    const haremHistory: IHaremHistory = {
      notes: reason,
      kakera: this.kakeraCost,
      types: EActionType.KAKERA_WITHDRAW,
    };

    await this.haremRepository.updateKakera(user.harem, -this.kakeraCost, haremHistory);

    // find jam
    const currentJam = await this.redisRepository.get("marry_" + userId);

    if (Boolean(currentJam)) throw new MarryJamAlreadyStarted();

    // create jam
    const repeated = await this.characterRepository.findCharactersWithOwners();

    const jam: IMarryJam = {
      host: userId,
      spectators: [],
      createdAt: new Date(),
      rolls: 10,
      exclude: repeated.map(character => character._id.toString()),
      pool: [],
      reason,
    };

    await this.redisRepository.set("marry_" + userId, JSON.stringify(jam));

    return jam;
  }
}
