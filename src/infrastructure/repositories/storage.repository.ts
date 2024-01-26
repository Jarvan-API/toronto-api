import fs from "fs/promises";
import path from "path";

import { Injectable, Logger } from "@nestjs/common";

import { IStorageRepository } from "src/domain/interfaces";
import { IStorageDeleteOptions, IStorageUploadOptions } from "src/application/types";

@Injectable()
export class StorageRepository implements IStorageRepository {
  private readonly logger = new Logger(StorageRepository.name);

  constructor() {}

  async upload(file: Express.Multer.File, desiredPath: string, options?: IStorageUploadOptions): Promise<string> {
    const fileExtension = path.extname(file.originalname);
    const filename = options?.forceName ? `${options.forceName}${fileExtension}` : file.originalname;

    try {
      const filePath = path.join(desiredPath, filename);
      await fs.mkdir(path.dirname(filePath), { recursive: true });
      await fs.writeFile(filePath, file.buffer);

      return filePath;
    } catch (error) {
      this.logger.error(`Error during file upload: ${error.message}`);
      throw new error();
    }
  }

  async move(filePath: string, destinationPath: string): Promise<string> {
    try {
      const filename = path.basename(filePath);
      const newFilePath = path.join(destinationPath, filename);

      await fs.mkdir(path.dirname(newFilePath), { recursive: true });
      await fs.rename(filePath, newFilePath);

      return newFilePath;
    } catch (error) {
      this.logger.error(`Error during file move: ${error.message}`);
      throw error;
    }
  }

  async delete(filePath: string, options?: IStorageDeleteOptions): Promise<void> {
    try {
      if (options.recursive) await fs.rm(filePath, { recursive: true, force: true });
      else await fs.unlink(filePath);
    } catch (error) {
      this.logger.error(`Error during file deletion: ${error.message}`);
      throw error;
    }
  }
}
