import { Types, UpdateQuery } from "mongoose";

import { ICreateDocument } from "src/application/types";
import { FilterQuery } from "src/infrastructure/repositories";

import { IHarem, IHaremHistory } from "../entities";

export interface IHaremRepository {
  create: (data: ICreateDocument<IHarem> | IHarem) => Promise<IHarem>;
  findAll: (filter?: FilterQuery<IHarem>) => Promise<IHarem[]>;
  findOne: (filter?: FilterQuery<IHarem>) => Promise<IHarem>;
  update: (_id: string, data: UpdateQuery<IHarem>) => Promise<any>;
  delete: (_id: string) => Promise<any>;
  updateKakera: (_id: Types.ObjectId, amount: number, history: IHaremHistory) => Promise<number>;
}
