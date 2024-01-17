import { FilterQuery, UpdateQuery } from "mongoose";

import { IUser } from "src/domain/entities";

export interface IUserRepository {
  create: (user: IUser) => Promise<IUser>;
  findAll: () => Promise<IUser[]>;
  findOne: (filters: FilterQuery<IUser>) => Promise<IUser>;
  update: (_id: string, data: UpdateQuery<IUser>) => Promise<any>;
  delete: (_id: string) => Promise<any>;
}
