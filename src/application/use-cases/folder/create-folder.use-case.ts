import { Types } from "mongoose";
import { Inject, Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { EventEmitter2 } from "@nestjs/event-emitter";

import { CreateFolderDTO } from "src/application/dtos";
import { Events, PORT } from "src/application/enums";
import { IFolder, IUserLog } from "src/domain/entities";
import { IFolderRepository } from "src/domain/interfaces";
import { FolderPath } from "src/infrastructure/utils";
import { EUserAction } from "src/application/types";

@Injectable()
export class CreateFolder {
  private readonly logger = new Logger(CreateFolder.name);

  constructor(
    @Inject(PORT.Folder) private readonly folderRepository: IFolderRepository,
    private readonly configService: ConfigService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

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

    const log: IUserLog = {
      user: new Types.ObjectId(userId),
      target: new Types.ObjectId(folder._id),
      action: EUserAction.FOLDER_CREATED,
      origin: CreateFolder.name,
    };
    this.eventEmitter.emit(Events.USER_LOG, log);

    return folder;
  }
}
