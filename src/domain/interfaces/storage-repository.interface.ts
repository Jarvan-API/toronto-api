import { IStorageUploadOptions } from "src/application/types";

export interface IStorageRepository {
  upload: (file: Express.Multer.File, path: string, options?: IStorageUploadOptions) => Promise<string>;
}
