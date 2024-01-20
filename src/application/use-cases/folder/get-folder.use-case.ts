import { Inject, Injectable, Logger } from "@nestjs/common";
import { Types } from "mongoose";

import { PORT } from "src/application/enums";
import { FolderNotFound, UserNotAllowed } from "src/application/exceptions";
import { IFolder } from "src/domain/entities";
import { IFolderRepository } from "src/domain/interfaces";
import { isVisibile } from "src/infrastructure/utils";

@Injectable()
export class GetFolder {
  private readonly logger = new Logger(GetFolder.name);

  constructor(@Inject(PORT.Folder) private readonly folderRepository: IFolderRepository) {}

  async exec(folderId: string, userId: string): Promise<IFolder> {
    const folder = await this.folderRepository.findOne({ _id: new Types.ObjectId(folderId) });

    if (!Boolean(folder)) throw new FolderNotFound();
    if (!isVisibile(folder, userId)) throw new UserNotAllowed();

    return folder;
  }
}
