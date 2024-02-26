import { Inject, Injectable, Logger } from "@nestjs/common";
import { Types } from "mongoose";

import { ICharacter, IMarryJam } from "src/domain/entities";
import { PORT } from "src/application/enums";
import { ICharacterRepository, IRedisRepository } from "src/domain/interfaces";
import { MarryJamNotFound, NotSufficientRolls } from "src/application/exceptions";

@Injectable()
export class RollMarry {
  private readonly logger = new Logger(RollMarry.name);

  constructor(
    @Inject(PORT.Redis) private readonly redisRepository: IRedisRepository,
    @Inject(PORT.Character) private readonly characterRepository: ICharacterRepository,
  ) {}

  async exec(userId: string): Promise<ICharacter> {
    const jamString = await this.redisRepository.get("marry_" + userId);
    if (!Boolean(jamString)) throw new MarryJamNotFound();

    const jam: IMarryJam = JSON.parse(jamString);

    if (jam.rolls <= 0) throw new NotSufficientRolls();

    const character = await this.characterRepository.findRandomCharacterExcludingIds(jam.exclude);

    jam.exclude.push(character._id.toString());
    jam.pool.push(character._id.toString());
    jam.rolls--;

    await this.redisRepository.set("marry_" + userId, JSON.stringify(jam));

    return character;
  }
}
