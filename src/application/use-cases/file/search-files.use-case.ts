import { Inject, Injectable, Logger } from "@nestjs/common";
import { Types } from "mongoose";

import { SearchFileDTO } from "src/application/dtos";
import { PORT } from "src/application/enums";
import { FolderNotFound, UserNotAllowed } from "src/application/exceptions";
import { IFile } from "src/domain/entities";
import { IFileRepository, IFolderRepository } from "src/domain/interfaces";
import { isFolderVisibile } from "src/infrastructure/utils";

@Injectable()
export class SearchFiles {
  private readonly logger = new Logger(SearchFiles.name);

  constructor(
    @Inject(PORT.File) private readonly fileRepository: IFileRepository,
    @Inject(PORT.Folder) private readonly folderRepository: IFolderRepository,
  ) {}

  async exec(filter: SearchFileDTO, folderId: string, userId: string): Promise<IFile[]> {
    const folder = await this.folderRepository.findOne({ _id: new Types.ObjectId(folderId) });

    if (!Boolean(folder)) throw new FolderNotFound();
    if (!isFolderVisibile(folder, userId)) throw new UserNotAllowed();

    const files = await this.fileRepository.search({ ...filter, owner: filter.ownerId, folder: folderId });
    return files;
  }
}
