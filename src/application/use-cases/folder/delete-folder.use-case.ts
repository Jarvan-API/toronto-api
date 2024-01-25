import { Inject, Injectable, Logger } from "@nestjs/common";
import { Types } from "mongoose";

import { PORT } from "src/application/enums";
import { FolderNotFound, UserNotAllowed } from "src/application/exceptions";
import { IFolderDeleted } from "src/application/presentations";
import { IFolder } from "src/domain/entities";
import { IFileChunkRepository, IFileRepository, IFolderRepository, IStorageRepository } from "src/domain/interfaces";
import { isFolderEmpty, isFolderOwner } from "src/infrastructure/utils";

@Injectable()
export class DeleteFolder {
  private readonly logger = new Logger(DeleteFolder.name);

  constructor(
    @Inject(PORT.Folder) private readonly folderRepository: IFolderRepository,
    @Inject(PORT.File) private readonly fileRepository: IFileRepository,
    @Inject(PORT.FileChunk) private readonly fileChunkRepository: IFileChunkRepository,
    @Inject(PORT.Storage) private readonly storageRepository: IStorageRepository,
  ) {}

  async exec(folderId: string, userId: string): Promise<IFolderDeleted> {
    const folder = await this.folderRepository.findOne({ _id: new Types.ObjectId(folderId) });

    if (!Boolean(folder)) throw new FolderNotFound();
    if (!isFolderOwner(folder, userId)) throw new UserNotAllowed();

    let deleteInfo: IFolderDeleted = { file_count: 0, free_space: 0 };
    if (!isFolderEmpty(folder)) deleteInfo = await this._removeAllFilesFromDatabase(folder);

    await this.storageRepository.delete(folder.storagePath, { recursive: true });
    await this.folderRepository.delete(folder._id);

    return deleteInfo;
  }

  async _removeAllFilesFromDatabase(folder: IFolder): Promise<IFolderDeleted> {
    let freeSpace: number = 0;
    const fileCount: number = folder.files.length;

    const files = await this.fileRepository.findAllByIds(folder.files);

    files.map(async file => {
      // remove chunks
      file.chunks.map(async chunkId => {
        const chunk = await this.fileChunkRepository.findOne({ _id: chunkId });
        await this.fileChunkRepository.delete(chunkId.toString());

        freeSpace += chunk.size;
      });

      // remove file
      await this.fileRepository.delete(file._id.toString());
    });

    return { file_count: fileCount, free_space: freeSpace };
  }
}
