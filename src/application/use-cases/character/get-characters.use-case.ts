import { Inject, Injectable, Logger } from "@nestjs/common";

import { PaginationQuery } from "src/application/dtos";
import { PORT } from "src/application/enums";
import { IGetCharacters, IPaginatedList } from "src/application/presentations";
import { ICharacter } from "src/domain/entities";
import { ICharacterRepository } from "src/domain/interfaces";
import { FilterQuery } from "src/infrastructure/repositories";

@Injectable()
export class GetCharacters {
  private readonly logger = new Logger(GetCharacters.name);

  constructor(@Inject(PORT.Character) private readonly characterRepository: ICharacterRepository) {}

  async exec({ page, size }: PaginationQuery): Promise<IPaginatedList<IGetCharacters>> {
    const query: FilterQuery<ICharacter> = { query: {}, populate: "owner", skip: page, limit: size };
    const characters = await this.characterRepository.findAll(query);
    const count = await this.characterRepository.count(query);
    const pages = Math.ceil(count / size) | 1;

    const items: IGetCharacters[] = characters.map(character => {
      return {
        name: character.name,
        age: character.age,
        gender: character.gender,
        picture: character.picture,
        owner: {
          name: character.owner?.["name"],
          picture: character.owner?.["picture"],
        },
      };
    });

    return {
      page: page | 1,
      items,
      count: items.length,
      pages: pages | 1,
    };
  }
}
