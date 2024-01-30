import { FilterQuery, Types, UpdateQuery } from "mongoose";

import { ICreateDocument } from "src/application/types";
import { IFile } from "src/domain/entities";

export interface IFileRepository {
  create: (data: ICreateDocument<IFile> | IFile) => Promise<IFile>;
  findAll: (filter?: FilterQuery<IFile>) => Promise<IFile[]>;
  findOne: (filters: FilterQuery<IFile>) => Promise<IFile>;
  update: (_id: string, data: UpdateQuery<IFile>) => Promise<any>;
  addChunk: (fileId: string, chunkId: string) => Promise<IFile>;
  delete: (_id: string) => Promise<any>;
  findAllByIds: (ids?: Types.ObjectId[], populateChunks?: boolean) => Promise<IFile[]>;
}
