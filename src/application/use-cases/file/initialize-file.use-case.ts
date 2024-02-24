import { Inject, Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Types } from "mongoose";

import { InitializeFileDTO } from "src/application/dtos";
import { PORT } from "src/application/enums";
import { FolderNotFound, UserNotAllowed } from "src/application/exceptions";
import { EFileStatus, IFile, IFileMetadata } from "src/domain/entities";
import { IFileRepository, IFolderRepository } from "src/domain/interfaces";
import { isFolderVisibile } from "src/infrastructure/utils";

@Injectable()
export class InitializeFile {
  private readonly logger = new Logger(InitializeFile.name);

  constructor(
    @Inject(PORT.File) private readonly fileRepository: IFileRepository,
    @Inject(PORT.Folder) private readonly folderRepository: IFolderRepository,
  ) {}

  async exec(data: InitializeFileDTO, folderId: string, userId: string): Promise<IFile> {
    const folder = await this.folderRepository.findOne({ query: { _id: new Types.ObjectId(folderId) } });

    if (!Boolean(folder)) throw new FolderNotFound();
    if (!isFolderVisibile(folder, userId)) throw new UserNotAllowed();

    const metadata: IFileMetadata = {
      originalName: data.name,
      totalSize: data.totalBufferSize,
      type: data.fileType,
      uploadedBy: new Types.ObjectId(userId),
    };

    const file: IFile = {
      chunks: [],
      metadata,
      status: EFileStatus.PENDING,
    };

    // store file
    const result = await this.fileRepository.create({
      value: file,
      options: {
        encryption: {
          encryptKey: data.encryptionKey,
        },
      },
    });

    // store file on folder
    await this.folderRepository.addFile(folder._id.toString(), result._id.toString());

    return result;
  }
}
