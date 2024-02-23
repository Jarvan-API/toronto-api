import { Model } from "mongoose";
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
}
