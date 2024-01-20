import { Inject, Injectable, Logger } from "@nestjs/common";
import { Types } from "mongoose";

import { PORT } from "src/application/enums";
import { IFolder } from "src/domain/entities";
import { IFolderRepository } from "src/domain/interfaces";

@Injectable()
export class GetFolder {
  private readonly logger = new Logger(GetFolder.name);

  constructor(@Inject(PORT.Folder) private readonly folderRepository: IFolderRepository) {}

  async exec(userId: string): Promise<IFolder[]> {
    const folders = await this.folderRepository.findAll({ owner: new Types.ObjectId(userId) });
    return folders;
  }
}
