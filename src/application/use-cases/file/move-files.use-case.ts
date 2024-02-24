import path from "path";

import { Inject, Injectable, Logger, Type } from "@nestjs/common";
import { Types } from "mongoose";

import { MoveFilesDTO } from "src/application/dtos";
import { PORT } from "src/application/enums";
import { FolderIsEmpty, FolderNotFound, TargetedFolderNotFound, UserNotAllowed } from "src/application/exceptions";
import { IFile, IFileChunk } from "src/domain/entities";
import { IFileChunkRepository, IFileRepository, IFolderRepository, IStorageRepository } from "src/domain/interfaces";
import { isFolderEmpty, isFolderOwner } from "src/infrastructure/utils";

@Injectable()
export class MoveFiles {
  private readonly logger = new Logger(MoveFiles.name);

  constructor(
    @Inject(PORT.File) private readonly fileRepository: IFileRepository,
    @Inject(PORT.FileChunk) private readonly fileChunkRepository: IFileChunkRepository,
    @Inject(PORT.Folder) private readonly folderRepository: IFolderRepository,
    @Inject(PORT.Storage) private readonly storageRepository: IStorageRepository,
  ) {}

  async exec(data: MoveFilesDTO, fromFolderId: string, userId: string): Promise<boolean> {
    const fromFolder = await this.folderRepository.findOne({ query: { _id: new Types.ObjectId(fromFolderId) } });

    // security check from folder A
    if (!Boolean(fromFolder)) throw new FolderNotFound();
    if (!isFolderOwner(fromFolder, userId)) throw new UserNotAllowed();
    if (isFolderEmpty(fromFolder)) throw new FolderIsEmpty();

    const toFolder = await this.folderRepository.findOne({ query: { _id: new Types.ObjectId(data.folder_id) } });

    // security check from folder B
    if (!Boolean(toFolder)) throw new TargetedFolderNotFound();
    if (!isFolderOwner(toFolder, userId)) throw new UserNotAllowed();

    // get those files individually
    const moveWholeFolder = !Boolean(data.files) || data.files?.length === 0;
    const fileIds = data.files?.map(file => new Types.ObjectId(file.file_id));
    const desiredFilesToMove: Types.ObjectId[] = moveWholeFolder ? fromFolder.files : fileIds;

    const files: IFile[] = await this.fileRepository.findAllByIds(desiredFilesToMove);

    files.map(async (file: IFile) => {
      // move chunks to folder B
      file.chunks.map(async (chunkId: Types.ObjectId) => {
        const chunk: IFileChunk = await this.fileChunkRepository.findOne({ _id: chunkId });

        // moves the chunk in the system
        const newChunkPath: string = path.join(toFolder.storagePath, chunk.storageName);
        const resultPath = await this.storageRepository.move(chunk.storagePath, newChunkPath);

        // moves the chunk in the DB
        await this.fileChunkRepository.update(chunk._id.toString(), { storagePath: resultPath });
      });

      // move files to folder B
      await this.folderRepository.removeFile(fromFolderId, file._id.toString());
      await this.folderRepository.addFile(toFolder._id.toString(), file._id.toString());
    });

    return true;
  }
}
