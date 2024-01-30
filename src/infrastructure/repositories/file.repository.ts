import { InjectModel } from "@nestjs/mongoose";
import { Inject, Injectable } from "@nestjs/common";
import { Model, Types } from "mongoose";

import { File, IFile } from "src/domain/entities";
import { IFileRepository } from "src/domain/interfaces";
import { Entity } from "src/application/enums";
import { EncryptionService } from "src/application/services";
import { Repository } from "./repository";

@Injectable()
export class FileRepository extends Repository<IFile> implements IFileRepository {
  constructor(
    @InjectModel(Entity.File) private readonly fileModel: Model<File>,
    protected readonly encryptionService: EncryptionService,
  ) {
    super(fileModel, encryptionService);
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
