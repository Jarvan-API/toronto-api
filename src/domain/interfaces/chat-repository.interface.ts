import { FilterQuery, UpdateQuery } from "mongoose";

import { IChat } from "src/domain/entities";

export interface IChatRepository {
  create: (user: IChat) => Promise<IChat>;
  findAll: (filter?: FilterQuery<IChat>) => Promise<IChat[]>;
  findOne: (filters: FilterQuery<IChat>) => Promise<IChat>;
  update: (_id: string, data: UpdateQuery<IChat>) => Promise<any>;
  delete: (_id: string) => Promise<any>;
}
