import { FilterQuery, Types } from "mongoose";
import { Inject, Injectable, Logger } from "@nestjs/common";

import { PORT } from "src/application/enums";
import { IUserFolderSearch } from "src/application/presentations";
import { IFolderRepository } from "src/domain/interfaces";
import { isVisibile } from "src/infrastructure/utils";
import { SearchFolderDTO } from "src/application/dtos";
import { IFolder } from "src/domain/entities";

@Injectable()
export class SearchFolders {
  private readonly logger = new Logger(SearchFolders.name);

  constructor(@Inject(PORT.Folder) private readonly folderRepository: IFolderRepository) {}

  async exec(filter: SearchFolderDTO, ourUserId: string): Promise<IUserFolderSearch[]> {
    let query: FilterQuery<IFolder> = {};

    if (filter.title) query.name = { $regex: new RegExp(filter.title, "i") };
    if (filter.owner) query.owner = new Types.ObjectId(filter.owner);

    const folders = await this.folderRepository.findAll(query);

    return folders
      .filter(folder => isVisibile(folder, ourUserId))
      .map(folder => {
        const ownername = folder.owner?.["firstname"] || "Unknown";
        return {
          id: folder._id,
          name: folder.name,
          owner: { name: ownername, id: folder.owner._id.toString() },
          public: folder.isPublic,
          createdAt: folder.createdAt,
          updatedAt: folder.updatedAt,
        };
      });
  }
}
