export interface IStorageRepository {
  upload: (file: Express.Multer.File, path: string) => Promise<string>;
}
