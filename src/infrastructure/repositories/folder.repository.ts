import { InjectModel } from "@nestjs/mongoose";
import { Injectable, Logger } from "@nestjs/common";
import { FilterQuery, Model, Types, UpdateQuery } from "mongoose";

import { Folder, IFolder } from "src/domain/entities";
import { IFolderRepository } from "src/domain/interfaces";
import { Entity } from "src/application/enums";

@Injectable()
export class FolderRepository implements IFolderRepository {
  private readonly logger = new Logger(FolderRepository.name);

  constructor(@InjectModel(Entity.Folder) private readonly folderModel: Model<Folder>) {}

  async create(folder: IFolder): Promise<IFolder> {
    return await this.folderModel.create(folder);
  }

  async findAll(filter?: FilterQuery<IFolder>): Promise<IFolder[]> {
    return this.folderModel.find(filter).populate({ path: "owner", select: "-password" }).exec();
  }

  async findOne(filter: FilterQuery<IFolder>): Promise<IFolder> {
    return await this.folderModel.findOne(filter);
  }

  async update(_id: string, data: UpdateQuery<IFolder>): Promise<any> {
    return await this.folderModel.findOneAndUpdate({ _id: new Types.ObjectId(_id) }, data);
  }

  async delete(_id: string): Promise<any> {
    return await this.folderModel.deleteOne({ _id: new Types.ObjectId(_id) });
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
}
