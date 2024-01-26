import { FilterQuery } from "mongoose";

import { ISession } from "../entities";

export interface ISessionRepository {
  create: (user: ISession) => Promise<ISession>;
  findOne: (filters: FilterQuery<ISession>) => Promise<ISession>;
  delete: (_id: string) => Promise<any>;
}
