import { FilterQuery, UpdateQuery } from "mongoose";

import { ICreateDocument } from "src/application/types";
import { IFileChunk } from "src/domain/entities";

export interface IFileChunkRepository {
  create: (data: ICreateDocument<IFileChunk> | IFileChunk) => Promise<IFileChunk>;
  findOne: (filters: FilterQuery<IFileChunk>) => Promise<IFileChunk>;
  update: (_id: string, data: UpdateQuery<IFileChunk>) => Promise<any>;
  delete: (_id: string) => Promise<any>;
}
