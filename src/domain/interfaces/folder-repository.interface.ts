import { UpdateQuery } from "mongoose";

import { ICreateDocument } from "src/application/types";
import { IFolder } from "src/domain/entities";
import { FilterQuery } from "src/infrastructure/repositories";

export interface IFolderRepository {
  create: (data: ICreateDocument<IFolder> | IFolder) => Promise<IFolder>;
  findAll: (filter?: FilterQuery<IFolder>) => Promise<IFolder[]>;
  findOne: (filters: FilterQuery<IFolder>) => Promise<IFolder>;
  update: (_id: string, data: UpdateQuery<IFolder>) => Promise<any>;
  delete: (_id: string) => Promise<any>;
  findByFile: (fileId: string) => Promise<IFolder>;
  addFile: (folderId: string, fileId: string) => Promise<IFolder>;
  removeFile: (folderId: string, fileId: string) => Promise<IFolder>;
  count: (filters?: FilterQuery<IFolder>) => Promise<number>;
}
