import { FilterQuery, UpdateQuery } from "mongoose";

import { IFileChunk } from "src/domain/entities";

export interface IFileChunkRepository {
  create: (user: IFileChunk) => Promise<IFileChunk>;
  findAll: (filter?: FilterQuery<IFileChunk>) => Promise<IFileChunk[]>;
  findOne: (filters: FilterQuery<IFileChunk>) => Promise<IFileChunk>;
  update: (_id: string, data: UpdateQuery<IFileChunk>) => Promise<any>;
  delete: (_id: string) => Promise<any>;
}
