import path from "path";

import { Types } from "mongoose";
import { Inject, Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import { CreateFolderDTO } from "src/application/dtos";
import { PORT } from "src/application/enums";
import { IFolder } from "src/domain/entities";
import { IFolderRepository } from "src/domain/interfaces";
import { FolderPath } from "src/infrastructure/utils";

@Injectable()
export class CreateFolder {
  private readonly logger = new Logger(CreateFolder.name);
  private readonly basePath: string;

  constructor(
    @Inject(PORT.Folder) private readonly folderRepository: IFolderRepository,
    private readonly configService: ConfigService,
  ) {
    this.basePath = configService.get<string>("STORAGE_BASE_PATH");
  }

  async exec(data: CreateFolderDTO, userId: string): Promise<IFolder> {
    const path: FolderPath = new FolderPath(userId, data.title, this.configService);

    const folderData: IFolder = {
      name: data.title,
      isPublic: data.isPublic,
      owner: new Types.ObjectId(userId),
      whitelist: [],
      files: [],
      storagePath: path.storagePath,
    };

    const folder = await this.folderRepository.create(folderData);
    return folder;
  }
}
