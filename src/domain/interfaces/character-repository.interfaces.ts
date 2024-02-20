import { FilterQuery, UpdateQuery } from "mongoose";

import { ICreateDocument } from "src/application/types";

import { ICharacter } from "../entities";

export interface IMarryRepository {
  create: (data: ICreateDocument<ICharacter> | ICharacter) => Promise<ICharacter>;
  findAll: (filter?: FilterQuery<{ userId: string }>) => Promise<ICharacter[]>;
  update: (_id: string, data: UpdateQuery<ICharacter>) => Promise<any>;
  delete: (_id: string) => Promise<any>;
}
