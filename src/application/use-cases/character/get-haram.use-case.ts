import { Inject, Injectable, Logger } from "@nestjs/common";

import { PORT } from "src/application/enums";
import { IMarry } from "src/application/presentations/character.presentations";
import { Character } from "src/domain/entities";
import { IUserRepository } from "src/domain/interfaces";
import { IMarryRepository } from "src/domain/interfaces/character-repository.interfaces";

@Injectable()
export class GetHaram {
  private readonly logger = new Logger(GetHaram.name);

  constructor(
    @Inject(PORT.Marry) private readonly marryRepository: IMarryRepository,
    @Inject(PORT.User) private readonly userRepository: IUserRepository,
  ) {}

  async exec(userId: string): Promise<IMarry[]> {
    const marrys = await this.userRepository.findAll(await this.userId.findOne(filter).populate(Character));
    return marrys;
  }
}
