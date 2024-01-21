import path from "path";
import crypto from "crypto";

import { Inject, Injectable, Logger } from "@nestjs/common";
import { Types } from "mongoose";
import { ConfigService } from "@nestjs/config";

import { UploadChunkDTO } from "src/application/dtos";
import { PORT } from "src/application/enums";
import { FolderNotFound, UserNotAllowed } from "src/application/exceptions";
import { EChunkStatus, EFileStatus, IFileChunk } from "src/domain/entities";
import { IFileChunkRepository, IFileRepository, IFolderRepository, IStorageRepository } from "src/domain/interfaces";
import { isFolderVisibile } from "src/infrastructure/utils";

@Injectable()
export class UploadChunk {
  private readonly logger = new Logger(UploadChunk.name);
  private readonly basePath: string;

  constructor(
    @Inject(PORT.Folder) private readonly folderRepository: IFolderRepository,
    @Inject(PORT.File) private readonly fileRepository: IFileRepository,
    @Inject(PORT.FileChunk) private readonly fileChunkRepository: IFileChunkRepository,
    @Inject(PORT.Storage) private readonly storageRepository: IStorageRepository,
    private readonly configService: ConfigService,
  ) {
    this.basePath = configService.get<string>("STORAGE_BASE_PATH");
  }

  async exec(data: UploadChunkDTO, file: Express.Multer.File, fileId: string, folderId: string, userId: string): Promise<IFileChunk> {
    const folder = await this.folderRepository.findOne({ _id: new Types.ObjectId(folderId) });

    if (!Boolean(folder)) throw new FolderNotFound();
    if (!isFolderVisibile(folder, userId)) throw new UserNotAllowed();

    const basePath = this.basePath;
    const sanitizedFolderName = folder.name.replace(/[^a-zA-Z0-9-_]/g, "_");
    const sanitizedFileId = fileId.replace(/[^a-zA-Z0-9-_]/g, "_");

    const desiredPath = path.join(basePath, folder.owner._id.toString(), sanitizedFolderName, sanitizedFileId);

    const storagePath: string = await this.storageRepository.upload(file, desiredPath);

    const fileChunk: IFileChunk = {
      sequence: data.chunkNumber,
      size: file.size,
      status: EChunkStatus.COMPLETE,
      storagePath: storagePath,
      sum: this._generateChecksum(file.buffer),
    };

    const chunk = await this.fileChunkRepository.create(fileChunk);

    await this.fileRepository.addChunk(fileId, chunk._id.toString());

    if (data.chunkNumber === data.totalChunks) await this.fileRepository.update(fileId, { status: EFileStatus.COMPLETE });

    return chunk;
  }

  _generateChecksum(buffer: Buffer): string {
    return crypto.createHash("sha256").update(buffer).digest("hex");
  }
}
