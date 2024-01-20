import { HttpStatus } from "@nestjs/common";

import { GenericHttpException } from "./generic-http.exceptions";

export class FileNotFound extends GenericHttpException {
  constructor() {
    super("File does not exist.", HttpStatus.NOT_FOUND, "FILE_NOT_FOUND");
  }
}
