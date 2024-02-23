import { FilterQuery, UpdateQuery } from "mongoose";

import { ICreateDocument } from "src/application/types";
import { IUser } from "src/domain/entities";

export interface IUserRepository {
  create: (data: ICreateDocument<IUser> | IUser) => Promise<IUser>;
  findAll: (filters?: FilterQuery<IUser>) => Promise<IUser[]>;
  findOne: (filters: FilterQuery<IUser>, populate?: string) => Promise<IUser>;
  update: (_id: string, data: UpdateQuery<IUser>) => Promise<any>;
  delete: (_id: string) => Promise<any>;
}
