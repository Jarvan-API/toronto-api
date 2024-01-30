import { InjectModel } from "@nestjs/mongoose";
import { Injectable, Logger } from "@nestjs/common";
import { FilterQuery, Model, Types, UpdateQuery } from "mongoose";

import { Folder, IFolder } from "src/domain/entities";
import { IFolderRepository, Repository } from "src/domain/interfaces";
import { Entity } from "src/application/enums";
import { EncryptionService } from "src/application/services";

@Injectable()
export class FolderRepository extends Repository<IFolder> implements IFolderRepository {
  constructor(
    @InjectModel(Entity.Folder) private readonly folderModel: Model<Folder>,
    private readonly encryptionService: EncryptionService,
  ) {
    super(folderModel);
  }

  override async create(folder: IFolder): Promise<IFolder> {
    folder.name = this.encryptionService.encrypt(folder.name);
    folder.storagePath = this.encryptionService.encrypt(folder.storagePath);

    return await this.folderModel.create(folder);
  }

  override async findAll(filter?: FilterQuery<IFolder>): Promise<IFolder[]> {
    const folders = await this.folderModel.find(filter).populate({ path: "owner", select: "-password" }).exec();

    folders.forEach(folder => {
      folder.name = this.encryptionService.decrypt(folder.name);
      folder.storagePath = this.encryptionService.decrypt(folder.storagePath);
    });

    return folders;
  }

  override async findOne(filter: FilterQuery<IFolder>): Promise<IFolder> {
    const folder = await this.folderModel.findOne(filter);

    if (Boolean(folder)) {
      folder.name = this.encryptionService.decrypt(folder.name);
      folder.storagePath = this.encryptionService.decrypt(folder.storagePath);
    }

    return folder;
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
