import path from "path";

import { ConfigService } from "@nestjs/config";
import { Types } from "mongoose";

import { IFolder } from "src/domain/entities";

export const isFolderVisibile = (folder: IFolder, userId: string): boolean =>
  folder.owner._id.toString() === userId || (!folder.isPublic && folder.whitelist.some(whitelisted => whitelisted.toString() === userId)) || folder.isPublic;

export const isFolderOwner = (folder: IFolder, userId: string): boolean => folder.owner._id.toString() === userId;

export const isFolderEmpty = (folder: IFolder): boolean => !Boolean(folder.files) || folder.files?.length === 0;

export class FolderPath {
  public readonly storagePath: string;

  constructor(
    private readonly ownerId: string,
    private readonly folderName: string,
    private readonly configService: ConfigService,
  ) {
    const basePath = this.configService.get<string>("STORAGE_BASE_PATH");
    const sanitizedFolderName = folderName.replace(/[^a-zA-Z0-9-_]/g, "_");

    this.storagePath = path.join(basePath, ownerId, sanitizedFolderName);
  }
}
