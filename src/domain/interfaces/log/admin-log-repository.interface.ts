import { FilterQuery, UpdateQuery } from "mongoose";

import { IAdminLog } from "src/domain/entities";

export interface IAdminLogRepository {
  create: (user: IAdminLog) => Promise<IAdminLog>;
  findAll: (filter?: FilterQuery<IAdminLog>) => Promise<IAdminLog[]>;
  findOne: (filters: FilterQuery<IAdminLog>) => Promise<IAdminLog>;
  update: (_id: string, data: UpdateQuery<IAdminLog>) => Promise<any>;
}
