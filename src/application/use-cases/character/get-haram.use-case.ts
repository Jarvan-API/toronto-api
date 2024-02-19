import { Inject, Injectable, Logger } from "@nestjs/common";

import { PORT } from "src/application/enums";
import { IHaram } from "src/application/presentations/character.presentations";
import { ICharacter } from "src/domain/entities";
import { IUserRepository } from "src/domain/interfaces";
import { IMarryRepository } from "src/domain/interfaces/character-repository.interfaces";

@Injectable()
export class GetHaram {
  private readonly logger = new Logger(GetHaram.name);

  constructor(
    @Inject(PORT.Marry) private readonly marryRepository: IMarryRepository,
    @Inject(PORT.User) private readonly userRepository: IUserRepository,
  ) {}

  async exec(userId: string): Promise<ICharacter[]> {
    const marrys = await this.userRepository.findAll(await this.userModel.findOne(filter).populate(Character));
  }
}
