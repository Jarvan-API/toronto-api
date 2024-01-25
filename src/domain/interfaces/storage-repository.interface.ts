import { IStorageDeleteOptions, IStorageUploadOptions } from "src/application/types";

export interface IStorageRepository {
  upload: (file: Express.Multer.File, path: string, options?: IStorageUploadOptions) => Promise<string>;
  move: (filePath: string, destinationPath: string) => Promise<string>;
  delete: (filePath: string, options?: IStorageDeleteOptions) => Promise<void>;
}
