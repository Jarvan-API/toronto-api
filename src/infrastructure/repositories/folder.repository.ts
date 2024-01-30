import { InjectModel } from "@nestjs/mongoose";
import { Injectable } from "@nestjs/common";
import { Model, Types } from "mongoose";
import { ConfigService } from "@nestjs/config";

import { Folder, IFolder } from "src/domain/entities";
import { IFolderRepository } from "src/domain/interfaces";
import { Entity } from "src/application/enums";
import { EncryptionService } from "src/application/services";
import { Repository } from "./repository";

@Injectable()
export class FolderRepository extends Repository<IFolder> implements IFolderRepository {
  constructor(
    @InjectModel(Entity.Folder) private readonly folderModel: Model<Folder>,
    protected readonly encryptionService: EncryptionService,
  ) {
    super(folderModel, encryptionService);
  }

  async addFile(folderId: string, fileId: string): Promise<IFolder> {
    try {
      return await this.folderModel.findOneAndUpdate({ _id: new Types.ObjectId(folderId) }, { $push: { files: new Types.ObjectId(fileId) } }, { new: true });
    } catch (error) {
      this.logger.error(`Error adding file to folder: ${error.message}`);
      throw error;
    }
  }

  async removeFile(folderId: string, fileId: string): Promise<IFolder> {
    try {
      return await this.folderModel.findOneAndUpdate({ _id: new Types.ObjectId(folderId) }, { $pull: { files: new Types.ObjectId(fileId) } }, { new: true });
    } catch (error) {
      this.logger.error(`Error removing file from folder: ${error.message}`);
      throw error;
    }
  }

  async findByFile(fileId: string): Promise<IFolder> {
    try {
      const fileObjectId = new Types.ObjectId(fileId);
      return await this.folderModel.findOne({ files: fileObjectId });
    } catch (error) {
      this.logger.error(`Error finding folder by file: ${error.message}`);
      throw error;
    }
  }
}
