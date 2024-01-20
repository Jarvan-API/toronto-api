import { Types } from "mongoose";
import { Inject, Injectable, Logger } from "@nestjs/common";

import { PORT } from "src/application/enums";
import { IUserFolderSearch } from "src/application/presentations";
import { IFolderRepository, IUserRepository } from "src/domain/interfaces";

@Injectable()
export class SearchFolders {
  private readonly logger = new Logger(SearchFolders.name);

  constructor(@Inject(PORT.Folder) private readonly folderRepository: IFolderRepository) {}

  async exec(userId: string, ourUserId: string): Promise<IUserFolderSearch[]> {
    const folders = await this.folderRepository.findAll({ owner: new Types.ObjectId(userId) });
    return folders
      .filter(
        folder => folder.owner.toString() === ourUserId || (!folder.isPublic && folder.whitelist.some(whitelisted => whitelisted.toString() === ourUserId)) || folder.isPublic,
      )
      .map(folder => {
        const ownername = folder.owner?.["firstname"] || "Unknown";
        return { id: folder._id, name: folder.name, owner: { name: ownername }, public: folder.isPublic, createdAt: folder.createdAt, updatedAt: folder.updatedAt };
      });
  }
}
