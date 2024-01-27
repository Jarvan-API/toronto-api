import { HttpStatus } from "@nestjs/common";

import { GenericHttpException } from "./generic-http.exceptions";

export class DecryptFailure extends GenericHttpException {
  constructor() {
    super("Decrypt failure, wrong key", HttpStatus.BAD_REQUEST, "DECRYPT_FAILURE");
  }
}
