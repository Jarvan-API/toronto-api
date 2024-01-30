import { InjectModel } from "@nestjs/mongoose";
import { Injectable } from "@nestjs/common";
import { FilterQuery, Model } from "mongoose";

import { FileChunk, IFileChunk } from "src/domain/entities";
import { Entity } from "src/application/enums";
import { IFileChunkRepository } from "src/domain/interfaces";
import { Repository } from "./repository";

@Injectable()
export class FileChunkRepository extends Repository<IFileChunk> implements IFileChunkRepository {
  constructor(@InjectModel(Entity.FileChunk) private readonly fileChunkModel: Model<FileChunk>) {
    super(fileChunkModel);
  }

  /*
  override async findOne(filter: FilterQuery<IFileChunk>): Promise<IFileChunk> {
    const fileChunk = await this.fileChunkModel.findOne(filter);

    if (Boolean(fileChunk)) {
      fileChunk.storagePath = this.encryptionService.decrypt(fileChunk.storagePath);
    }

    return fileChunk;
  }
  */
}
