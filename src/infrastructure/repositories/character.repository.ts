import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { Injectable } from "@nestjs/common";

import { Repository } from "./repository";
import { Entity } from "src/application/enums";
import { Character, ICharacter } from "src/domain/entities";

@Injectable()
export class CharacterRepository extends Repository<ICharacter> implements ICharacterRep {
  constructor(@InjectModel(Entity.Character) private readonly characterModel: Model<Character>) {
    super(characterModel);
  }
}
