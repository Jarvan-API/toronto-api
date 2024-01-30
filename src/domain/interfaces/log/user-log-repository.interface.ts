import { FilterQuery, UpdateQuery } from "mongoose";

import { IUserLog } from "src/domain/entities";

export interface IUserLogRepository {
  create: (userLog: IUserLog) => Promise<IUserLog>;
  findAll: (filter?: FilterQuery<IUserLog>) => Promise<IUserLog[]>;
  findOne: (filters: FilterQuery<IUserLog>) => Promise<IUserLog>;
  update: (_id: string, data: UpdateQuery<IUserLog>) => Promise<any>;
}
