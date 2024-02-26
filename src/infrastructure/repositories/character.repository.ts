import { Model, Types } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { Injectable } from "@nestjs/common";

import { Repository } from "./repository";
import { Entity } from "src/application/enums";
import { Character, ICharacter } from "src/domain/entities";
import { ICharacterRepository } from "src/domain/interfaces";

@Injectable()
export class CharacterRepository extends Repository<ICharacter> implements ICharacterRepository {
  constructor(@InjectModel(Entity.Character) private readonly characterModel: Model<Character>) {
    super(characterModel);
  }

  async findCharactersWithOwners(): Promise<ICharacter[]> {
    return await this.characterModel.find({ owner: { $exists: true, $ne: null } });
  }

  async findRandomCharacterExcludingIds(excludedIds: string[]): Promise<Character | null> {
    const excludedObjectIds = excludedIds.map(id => new Types.ObjectId(id));
    const characters = await this.characterModel.aggregate([{ $match: { _id: { $nin: excludedObjectIds } } }, { $sample: { size: 1 } }]);

    return characters.length > 0 ? characters[0] : null;
  }
}
