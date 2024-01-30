import { FilterQuery } from "mongoose";

import { ICreateDocument } from "src/application/types";

import { ISession } from "../entities";

export interface ISessionRepository {
  create: (data: ICreateDocument<ISession>) => Promise<ISession>;
  findOne: (filters: FilterQuery<ISession>) => Promise<ISession>;
  delete: (_id: string) => Promise<any>;
}
