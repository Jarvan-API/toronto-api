import { Inject, Injectable, Logger } from "@nestjs/common";
import { Types } from "mongoose";
import { v4 as uuidv4 } from "uuid";

import { UploadFileDTO } from "src/application/dtos";
import { PORT } from "src/application/enums";
import { FolderNotFound } from "src/application/exceptions";
import { IFile, IFolder } from "src/domain/entities";
import { IFileRepository, IFolderRepository } from "src/domain/interfaces";

@Injectable()
export class UploadFile {
  private readonly logger = new Logger(UploadFile.name);

  constructor(
    @Inject(PORT.File) private readonly fileRepository: IFileRepository,
    @Inject(PORT.Folder) private readonly folderRepository: IFolderRepository,
  ) {}

  async exec(data: Express.Multer.File, settings: UploadFileDTO, folderId: string, ourUserId: string): Promise<IFile> {
    const folder: IFolder = await this.folderRepository.findOne({ _id: new Types.ObjectId(folderId) });

    if (!Boolean(folder)) throw new FolderNotFound();

    const fileId: string = uuidv4();

    const file: IFile = {
      id: fileId,
      name: settings.name,
      owner: ourUserId,
      folder: folderId,
      type: data.mimetype,
      size: data.size,
      data: data.buffer,
      is_public: settings.isPublic ? "true" : "false",
      created_at: new Date(),
      updated_at: new Date(),
    };

    const uploadedFile = await this.fileRepository.create(file);

    // add file to folder in mongodb
    const files = [...folder.files, fileId];
    await this.folderRepository.update(folderId, { files });

    return uploadedFile;
  }
}
