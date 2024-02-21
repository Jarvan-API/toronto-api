import { FilterQuery, UpdateQuery } from "mongoose";

import { ICreateDocument } from "src/application/types";

import { ICharacter } from "../entities";

export interface ICharacterRepository {
  create: (data: ICreateDocument<ICharacter> | ICharacter) => Promise<ICharacter>;
  findAll: (filter?: FilterQuery<ICharacter>) => Promise<ICharacter[]>;
  update: (_id: string, data: UpdateQuery<ICharacter>) => Promise<any>;
  delete: (_id: string) => Promise<any>;
}
