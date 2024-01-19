import { Inject, Injectable, Logger } from "@nestjs/common";
import { Types } from "mongoose";
import { PORT } from "src/application/enums";
import { IUserFolderSearch } from "src/application/presentations";
import { IFolder } from "src/domain/entities";
import { IFolderRepository } from "src/domain/interfaces";

@Injectable()
export class GetFolders {
  private readonly logger = new Logger(GetFolders.name);

  constructor(@Inject(PORT.Folder) private readonly folderRepository: IFolderRepository) {}

  async exec(userId: string): Promise<IUserFolderSearch[]> {
    const folders = await this.folderRepository.findAll({ owner: new Types.ObjectId(userId) });

    return folders.map(folder => {
      return { id: folder._id, name: folder.name };
    });
  }
}
