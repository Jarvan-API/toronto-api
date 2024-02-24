import { Types } from "mongoose";
import { Inject, Injectable, Logger } from "@nestjs/common";

import { UpdateFolderDTO } from "src/application/dtos";
import { PORT } from "src/application/enums";
import { IFolder } from "src/domain/entities";
import { IFolderRepository } from "src/domain/interfaces";
import { UserNotAllowed } from "src/application/exceptions";

@Injectable()
export class UpdateFolder {
  private readonly logger = new Logger(UpdateFolder.name);

  constructor(@Inject(PORT.Folder) private readonly folderRepository: IFolderRepository) {}

  async exec(data: UpdateFolderDTO, folderId: string, userId: string): Promise<IFolder> {
    const folder = await this.folderRepository.findOne({ query: { _id: new Types.ObjectId(folderId) } });

    if (folder.owner._id.toString() !== userId) throw new UserNotAllowed();

    let whitelist = folder.whitelist;

    if (data.permission) {
      if (folder.whitelist.some(whitelisted => whitelisted.toString() === data.permission))
        whitelist = folder.whitelist.filter(whitelisted => whitelisted.toString() !== data.permission);
      else whitelist = folder.whitelist.concat(new Types.ObjectId(data.permission));
    }

    const folderData: IFolder = {
      name: data.title ?? folder.name,
      owner: folder.owner,
      files: folder.files,
      isPublic: data.isPublic ?? folder.isPublic,
      storagePath: folder.storagePath,
      whitelist,
    };

    await this.folderRepository.update(folderId, folderData);

    return folderData;
  }
}
