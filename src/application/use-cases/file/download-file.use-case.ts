import { Inject, Injectable, Logger } from "@nestjs/common";
import { Types } from "mongoose";

import { SearchFileDTO } from "src/application/dtos";
import { PORT } from "src/application/enums";
import { FileNotFound, FolderNotFound, UserNotAllowed } from "src/application/exceptions";
import { IFile } from "src/domain/entities";
import { IFileRepository, IFolderRepository } from "src/domain/interfaces";
import { isFolderVisibile } from "src/infrastructure/utils";

@Injectable()
export class DownloadFile {
  private readonly logger = new Logger(DownloadFile.name);

  constructor(
    @Inject(PORT.File) private readonly fileRepository: IFileRepository,
    @Inject(PORT.Folder) private readonly folderRepository: IFolderRepository,
  ) {}

  async exec(fileId: string, folderId, userId: string): Promise<IFile> {
    const folder = await this.folderRepository.findOne({ _id: new Types.ObjectId(folderId) });

    if (!Boolean(folder)) throw new FolderNotFound();
    if (!isFolderVisibile(folder, userId)) throw new UserNotAllowed();
    if (!folder.files.some(f => f === fileId)) throw new FileNotFound();

    const file = await this.fileRepository.findOne(fileId);

    if (!Boolean(file)) throw new FileNotFound();

    return file;
  }
}
