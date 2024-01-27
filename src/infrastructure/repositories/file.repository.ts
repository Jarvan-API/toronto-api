import { InjectModel } from "@nestjs/mongoose";
import { Injectable, Logger } from "@nestjs/common";
import { FilterQuery, Model, Types, UpdateQuery } from "mongoose";

import { File, IFile } from "src/domain/entities";
import { IFileRepository } from "src/domain/interfaces";
import { Entity } from "src/application/enums";
import { EncryptionService } from "src/application/services";

@Injectable()
export class FileRepository implements IFileRepository {
  private readonly logger = new Logger(FileRepository.name);

  constructor(
    @InjectModel(Entity.File) private readonly fileModel: Model<File>,
    private readonly encryptionService: EncryptionService,
  ) {}

  async create(file: IFile): Promise<IFile> {
    file.metadata.originalName = this.encryptionService.encrypt(file.metadata.originalName);
    file.metadata.type = this.encryptionService.encrypt(file.metadata.type);
    return await this.fileModel.create(file);
  }

  async findAll(filter?: FilterQuery<IFile>): Promise<IFile[]> {
    return this.fileModel.find(filter).exec();
  }

  async findOne(filter: FilterQuery<IFile>): Promise<IFile> {
    const file: IFile = await this.fileModel.findOne(filter);

    if (Boolean(file)) {
      file.metadata.originalName = this.encryptionService.decrypt(file.metadata.originalName);
      file.metadata.type = this.encryptionService.decrypt(file.metadata.type);
    }

    return file;
  }

  async update(_id: string, data: UpdateQuery<IFile>): Promise<any> {
    return await this.fileModel.findOneAndUpdate({ _id: new Types.ObjectId(_id) }, data);
  }

  async delete(_id: string): Promise<any> {
    return await this.fileModel.deleteOne({ _id: new Types.ObjectId(_id) });
  }

  async addChunk(fileId: string, chunkId: string): Promise<IFile> {
    return await this.fileModel.findOneAndUpdate({ _id: new Types.ObjectId(fileId) }, { $push: { chunks: new Types.ObjectId(chunkId) } }, { new: true });
  }

  async findAllByIds(ids: Types.ObjectId[], populateChunks: boolean): Promise<IFile[]> {
    try {
      if (!populateChunks) return await this.fileModel.find({ _id: { $in: ids } }).exec();
      else
        return await this.fileModel
          .find({ _id: { $in: ids } })
          .populate("chunks")
          .exec();
    } catch (error) {
      this.logger.error(`Error retrieving files: ${error.message}`);
      throw error;
    }
  }
}
