import { Inject, Injectable, Logger } from "@nestjs/common";
import { Types } from "mongoose";

import { PORT } from "src/application/enums";
import { FileNotFound, FolderNotFound, UserNotAllowed } from "src/application/exceptions";
import { IFile } from "src/domain/entities";
import { IFileRepository, IFolderRepository } from "src/domain/interfaces";
import { isFolderVisibile } from "src/infrastructure/utils";

@Injectable()
export class GetFile {
  private readonly logger = new Logger(GetFile.name);

  constructor(
    @Inject(PORT.File) private readonly fileRepository: IFileRepository,
    @Inject(PORT.Folder) private readonly folderRepository: IFolderRepository,
  ) {}

  async exec(fileId: string, userId: string): Promise<IFile> {
    const file = await this.fileRepository.findOne({ _id: new Types.ObjectId(fileId) });

    if (!Boolean(file)) throw new FileNotFound();

    const folder = await this.folderRepository.findByFile(fileId);

    if (!Boolean(folder)) throw new FolderNotFound();
    if (!isFolderVisibile(folder, userId)) throw new UserNotAllowed();

    return file;
  }
}
