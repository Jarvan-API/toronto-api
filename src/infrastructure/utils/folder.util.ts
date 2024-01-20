import { IFolder } from "src/domain/entities";

export const isFolderVisibile = (folder: IFolder, userId: string): boolean =>
  folder.owner._id.toString() === userId || (!folder.isPublic && folder.whitelist.some(whitelisted => whitelisted.toString() === userId)) || folder.isPublic;
