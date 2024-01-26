import fs from "fs";

import { Inject, Injectable, Logger } from "@nestjs/common";
import { Types } from "mongoose";

import { PORT } from "src/application/enums";
import { FileNotFound, FolderNotFound, UserNotAllowed } from "src/application/exceptions";
import { IFile, IFileChunk } from "src/domain/entities";
import { IFileChunkRepository, IFileRepository, IFolderRepository } from "src/domain/interfaces";
import { isFolderVisibile } from "src/infrastructure/utils";

@Injectable()
export class DownloadFile {
  private readonly logger = new Logger(DownloadFile.name);

  constructor(
    @Inject(PORT.Folder) private readonly folderRepository: IFolderRepository,
    @Inject(PORT.File) private readonly fileRepository: IFileRepository,
    @Inject(PORT.FileChunk) private readonly fileChunkRepository: IFileChunkRepository,
  ) {}

  async exec(fileId: string, userId: string, response: any): Promise<any> {
    const file = await this.fileRepository.findOne({ _id: new Types.ObjectId(fileId) });

    if (!Boolean(file)) throw new FileNotFound();

    const folder = await this.folderRepository.findByFile(fileId);

    if (!Boolean(folder)) throw new FolderNotFound();
    if (!isFolderVisibile(folder, userId)) throw new UserNotAllowed();

    const filename = file.metadata.originalName;
    response.setHeader("Content-Disposition", `attachment; filename="${filename}"`);

    for (const chunkId of file.chunks) {
      const chunk: IFileChunk = await this.fileChunkRepository.findOne({ _id: chunkId });
      const stream = fs.createReadStream(chunk.storagePath);

      await new Promise((resolve, reject) => {
        stream.on("end", resolve);
        stream.on("error", reject);
        stream.pipe(response, { end: false });
      });
    }

    response.end();
  }
}
