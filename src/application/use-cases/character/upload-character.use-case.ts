import { Inject, Injectable, Logger } from "@nestjs/common";

import { PORT } from "src/application/enums";
import { EGender, ICharacter } from "src/domain/entities";
import { ICharacterRepository } from "src/domain/interfaces";

@Injectable()
export class UploadCharacter {
  private readonly logger = new Logger(UploadCharacter.name);

  constructor(@Inject(PORT.Character) private readonly characterRepository: ICharacterRepository) {}

  async exec(name: string, age: number, gender: EGender.MALE, picture?: string): Promise<ICharacter> {
    const character: ICharacter = {
      name,
      age,
      gender,
      picture,
    };

    const result = await this.characterRepository.create(character);

    return result;
  }
}
