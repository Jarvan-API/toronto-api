import { Inject, Injectable, Logger } from "@nestjs/common";
import { Types } from "mongoose";

import { IMarryJam } from "src/domain/entities";
import { PORT } from "src/application/enums";
import { ICharacterRepository, IHaremRepository, IRedisRepository, IUserRepository } from "src/domain/interfaces";
import { MarryJamNotFound, UnableToMarry, UserNotFound } from "src/application/exceptions";

@Injectable()
export class Marry {
  private readonly logger = new Logger(Marry.name);

  constructor(
    @Inject(PORT.Redis) private readonly redisRepository: IRedisRepository,
    @Inject(PORT.User) private readonly userRepository: IUserRepository,
    @Inject(PORT.Character) private readonly characterRepository: ICharacterRepository,
    @Inject(PORT.Harem) private readonly haremRepository: IHaremRepository,
  ) {}

  async exec(userId: string, characterId: string): Promise<void> {
    const jamString = await this.redisRepository.get("marry_" + userId);
    if (!Boolean(jamString)) throw new MarryJamNotFound();

    const jam: IMarryJam = JSON.parse(jamString);

    if (jam.rolls !== 0 || !jam.pool.includes(characterId)) throw new UnableToMarry();

    const user = await this.userRepository.findOne({ query: { _id: new Types.ObjectId(userId) } });

    if (!Boolean(user)) throw new UserNotFound();

    await this.characterRepository.update(characterId, { owner: new Types.ObjectId(userId) });
    await this.haremRepository.update(user.harem.toString(), { $addToSet: { characters: new Types.ObjectId(characterId) } });
  }
}
