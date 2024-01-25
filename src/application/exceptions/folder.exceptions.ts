import { HttpStatus } from "@nestjs/common";

import { GenericHttpException } from "./generic-http.exceptions";

export class FolderNotFound extends GenericHttpException {
  constructor() {
    super("Folder does not exists", HttpStatus.NOT_FOUND, "FOLDER_NOT_FOUND");
  }
}

export class TargetedFolderNotFound extends GenericHttpException {
  constructor() {
    super("Targeted folder does not exists", HttpStatus.NOT_FOUND, "TARGET_NOT_FOUND");
  }
}

export class FolderIsEmpty extends GenericHttpException {
  constructor() {
    super("Folder is empty", HttpStatus.BAD_REQUEST, "EMPTY_FOLDER");
  }
}
