import fs from "fs/promises";
import path from "path";

import { Injectable, Logger } from "@nestjs/common";

import { IStorageRepository } from "src/domain/interfaces";

@Injectable()
export class StorageRepository implements IStorageRepository {
  private readonly logger = new Logger(StorageRepository.name);

  constructor() {}

  async upload(file: Express.Multer.File, desiredPath: string): Promise<string> {
    try {
      const filePath = path.join(desiredPath, file.originalname);
      await fs.mkdir(path.dirname(filePath), { recursive: true });

      await fs.writeFile(filePath, file.buffer);

      return filePath;
    } catch (error) {
      this.logger.error(`Error during file upload: ${error.message}`);
      throw new error();
    }
  }
}