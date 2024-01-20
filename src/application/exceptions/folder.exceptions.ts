import { HttpStatus } from "@nestjs/common";

import { GenericHttpException } from "./generic-http.exceptions";

export class FolderNotFound extends GenericHttpException {
  constructor() {
    super("Folder does not exist.", HttpStatus.NOT_FOUND, "FOLDER_NOT_FOUND");
  }
}
