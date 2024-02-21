import { FilterQuery, UpdateQuery } from "mongoose";

import { ICreateDocument } from "src/application/types";

import { IHarem } from "../entities";

export interface IHaremRepository {
  create: (data: ICreateDocument<IHarem> | IHarem) => Promise<IHarem>;
  findAll: (filter?: FilterQuery<IHarem>) => Promise<IHarem[]>;
  findOne: (filter?: FilterQuery<IHarem>, populate?: string) => Promise<IHarem>;
  update: (_id: string, data: UpdateQuery<IHarem>) => Promise<any>;
  delete: (_id: string) => Promise<any>;
}
