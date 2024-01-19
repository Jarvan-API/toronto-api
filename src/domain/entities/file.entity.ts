export interface IFile {
  _id?: string;
  owner: string;
  folder: string;
  name: string;
  size: number;
  type: string;
  isPublic: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
