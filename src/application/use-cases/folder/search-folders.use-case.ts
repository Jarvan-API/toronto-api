import { Inject, Injectable, Logger } from "@nestjs/common";

import { PORT } from "src/application/enums";
import { IUserFolderSearch } from "src/application/presentations";
import { IFolderRepository } from "src/domain/interfaces";
import { isVisibile } from "src/infrastructure/utils";
import { SearchFolderDTO } from "src/application/dtos";

@Injectable()
export class SearchFolders {
  private readonly logger = new Logger(SearchFolders.name);

  constructor(@Inject(PORT.Folder) private readonly folderRepository: IFolderRepository) {}

  async exec(filter: SearchFolderDTO, ourUserId: string): Promise<IUserFolderSearch[]> {
    const folders = await this.folderRepository.findAll();

    return folders
      .filter(folder => isVisibile(folder, ourUserId))
      .map(folder => {
        const ownername = folder.owner?.["firstname"] || "Unknown";
        return { id: folder._id, name: folder.name, owner: { name: ownername }, public: folder.isPublic, createdAt: folder.createdAt, updatedAt: folder.updatedAt };
      });
  }
}
