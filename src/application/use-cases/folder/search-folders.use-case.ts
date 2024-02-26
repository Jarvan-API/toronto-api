import { Types } from "mongoose";
import { Inject, Injectable, Logger } from "@nestjs/common";

import { PORT } from "src/application/enums";
import { IPaginatedList, IUserFolderSearch } from "src/application/presentations";
import { IFolderRepository } from "src/domain/interfaces";
import { isFolderVisibile } from "src/infrastructure/utils";
import { PaginationQuery, SearchFolderDTO } from "src/application/dtos";

@Injectable()
export class SearchFolders {
  private readonly logger = new Logger(SearchFolders.name);

  constructor(@Inject(PORT.Folder) private readonly folderRepository: IFolderRepository) {}

  async exec(search: SearchFolderDTO, query: PaginationQuery, ourUserId: string): Promise<IPaginatedList<IUserFolderSearch>> {
    let baseQuery: any = {};

    if (Boolean(search.name)) baseQuery.name = { $regex: new RegExp(search.name, "i") };
    if (Boolean(search.owner)) baseQuery.owner = new Types.ObjectId(search.owner);

    const folders = await this.folderRepository.findAll({ ...baseQuery, skip: query.page, limit: query.size });
    const count = await this.folderRepository.count(baseQuery);

    const pages = Math.ceil(count / query.size) | 1;

    const items = folders
      .filter(folder => isFolderVisibile(folder, ourUserId))
      .map(folder => {
        const ownername = folder.owner?.["firstname"] || "Unknown";
        return {
          id: folder._id,
          name: folder.name,
          owner: { name: ownername, id: folder.owner._id.toString() },
          public: folder.isPublic,
          fileCount: folder.files?.length,
          createdAt: folder.createdAt,
          updatedAt: folder.updatedAt,
        };
      });

    return {
      items,
      page: query.page | 1,
      pages: pages | 1,
      count: items.length,
    };
  }
}
