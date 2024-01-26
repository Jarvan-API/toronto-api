import { FilterQuery, UpdateQuery } from "mongoose";

import { IFolder } from "src/domain/entities";

export interface IFolderRepository {
  create: (user: IFolder) => Promise<IFolder>;
  findAll: (filter?: FilterQuery<IFolder>) => Promise<IFolder[]>;
  findOne: (filters: FilterQuery<IFolder>) => Promise<IFolder>;
  update: (_id: string, data: UpdateQuery<IFolder>) => Promise<any>;
  delete: (_id: string) => Promise<any>;
  findByFile: (fileId: string) => Promise<IFolder>;
  addFile: (folderId: string, fileId: string) => Promise<IFolder>;
  removeFile: (folderId: string, fileId: string) => Promise<IFolder>;
}
