import { Inject, Injectable, Logger } from "@nestjs/common";
import { Types } from "mongoose";
import { CreateFolderDTO } from "src/application/dtos";
import { PORT } from "src/application/enums";
import { IFolder } from "src/domain/entities";
import { IFolderRepository } from "src/domain/interfaces";

@Injectable()
export class CreateFolder {
  private readonly logger = new Logger(CreateFolder.name);

  constructor(@Inject(PORT.Folder) private readonly folderRepository: IFolderRepository) {}

  async exec(data: CreateFolderDTO, userId: string): Promise<IFolder> {
    const folderData: IFolder = {
      name: data.title,
      isPublic: data.isPublic,
      owner: new Types.ObjectId(userId),
      whitelist: [],
    };

    const folder = await this.folderRepository.create(folderData);
    return folder;
  }
}
