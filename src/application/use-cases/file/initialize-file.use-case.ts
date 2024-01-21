import { Inject, Injectable, Logger } from "@nestjs/common";
import { Types } from "mongoose";

import { InitializeFileDTO, SearchFileDTO } from "src/application/dtos";
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
    const folder = await this.folderRepository.findOne({ _id: new Types.ObjectId(folderId) });

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
    const result = await this.fileRepository.create(file);

    // store file on folder
    const files = folder.files?.map(file => file?._id);
    await this.folderRepository.update(folder._id, { files: [...files, file._id] });

    return result;
  }
}
