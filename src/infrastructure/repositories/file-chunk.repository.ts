import { InjectModel } from "@nestjs/mongoose";
import { Injectable, Logger } from "@nestjs/common";
import { FilterQuery, Model, Types, UpdateQuery } from "mongoose";

import { FileChunk, IFileChunk } from "src/domain/entities";
import { Entity } from "src/application/enums";
import { IFileChunkRepository } from "src/domain/interfaces";
import { EncryptionService } from "src/application/services";

@Injectable()
export class FileChunkRepository implements IFileChunkRepository {
  private readonly logger = new Logger(FileChunkRepository.name);

  constructor(
    @InjectModel(Entity.FileChunk) private readonly fileChunkModel: Model<FileChunk>,
    private readonly encryptionService: EncryptionService,
  ) {}

  async create(fileChunk: IFileChunk): Promise<IFileChunk> {
    fileChunk.storagePath = this.encryptionService.encrypt(fileChunk.storagePath);

    return await this.fileChunkModel.create(fileChunk);
  }

  async findOne(filter: FilterQuery<IFileChunk>): Promise<IFileChunk> {
    const fileChunk = await this.fileChunkModel.findOne(filter);

    if (Boolean(fileChunk)) {
      fileChunk.storagePath = this.encryptionService.decrypt(fileChunk.storagePath);
    }

    return fileChunk;
  }

  async update(_id: string, data: UpdateQuery<IFileChunk>): Promise<any> {
    return await this.fileChunkModel.findOneAndUpdate({ _id: new Types.ObjectId(_id) }, data);
  }

  async delete(_id: string): Promise<any> {
    return await this.fileChunkModel.deleteOne({ _id: new Types.ObjectId(_id) });
  }
}
