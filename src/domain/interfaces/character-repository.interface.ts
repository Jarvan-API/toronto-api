import { UpdateQuery } from "mongoose";

import { ICreateDocument } from "src/application/types";
import { FilterQuery } from "src/infrastructure/repositories";

import { ICharacter } from "../entities";

export interface ICharacterRepository {
  create: (data: ICreateDocument<ICharacter> | ICharacter) => Promise<ICharacter>;
  findAll: (filter?: FilterQuery<ICharacter>) => Promise<ICharacter[]>;
  findOne: (filter?: FilterQuery<ICharacter>) => Promise<ICharacter>;
  update: (_id: string, data: UpdateQuery<ICharacter>) => Promise<any>;
  delete: (_id: string) => Promise<any>;
  count: (filter?: FilterQuery<ICharacter>) => Promise<number>;
  findCharactersWithOwners: () => Promise<ICharacter[]>;
  findRandomCharacterExcludingIds: (excludedIds: string[]) => Promise<ICharacter | null>;
}
