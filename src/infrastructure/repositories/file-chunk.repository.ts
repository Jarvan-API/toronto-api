import { InjectModel } from "@nestjs/mongoose";
import { Injectable, Logger } from "@nestjs/common";
import { FilterQuery, Model, Types, UpdateQuery } from "mongoose";

import { File, FileChunk, IFileChunk } from "src/domain/entities";
import { Entity } from "src/application/enums";
import { IFileChunkRepository } from "src/domain/interfaces";

@Injectable()
export class FileChunkRepository implements IFileChunkRepository {
  private readonly logger = new Logger(FileChunkRepository.name);

  constructor(@InjectModel(Entity.FileChunk) private readonly fileChunkModel: Model<FileChunk>) {}

  async create(fileChunk: IFileChunk): Promise<IFileChunk> {
    return await this.fileChunkModel.create(fileChunk);
  }

  async findAll(filter?: FilterQuery<IFileChunk>): Promise<IFileChunk[]> {
    return this.fileChunkModel.find(filter).exec();
  }

  async findOne(filter: FilterQuery<IFileChunk>): Promise<IFileChunk> {
    return await this.fileChunkModel.findOne(filter);
  }

  async update(_id: string, data: UpdateQuery<IFileChunk>): Promise<any> {
    return await this.fileChunkModel.findOneAndUpdate({ _id: new Types.ObjectId(_id) }, data);
  }

  async delete(_id: string): Promise<any> {
    return await this.fileChunkModel.deleteOne({ _id: new Types.ObjectId(_id) });
  }
}
