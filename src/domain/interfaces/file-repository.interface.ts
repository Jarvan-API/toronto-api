import { IFile } from "src/domain/entities";

export interface IFileRepository {
  create: (file: IFile) => Promise<IFile>;
  findAll: () => Promise<IFile[]>;
  findOne: (id: string) => Promise<IFile>;
  delete: (id: string) => Promise<void>;
  search(criteria: { name?: string; type?: string; owner?: string; folder?: string }): Promise<IFile[]>;
}
