import { HttpStatus } from "@nestjs/common";

import { GenericHttpException } from "./generic-http.exceptions";

export class MarryJamAlreadyStarted extends GenericHttpException {
  constructor() {
    super("Marry Jam has already started", HttpStatus.BAD_REQUEST, "MARRY_JAM_ALREADY_EXISTS");
  }
}

export class MarryJamNotFound extends GenericHttpException {
  constructor() {
    super("Marry Jam has already finished or doesn't exists", HttpStatus.NOT_FOUND, "MARRY_JAM_NOT_FOUND");
  }
}

export class CannotJoinJam extends GenericHttpException {
  constructor() {
    super("Unable to join Jam", HttpStatus.UNAUTHORIZED, "INVALID_JAM_AUTHORIZATION");
  }
}

export class NotSufficientRolls extends GenericHttpException {
  constructor() {
    super("Insufficient rolls for another marry", HttpStatus.BAD_REQUEST, "INVALID_JAM_ROLL");
  }
}

export class UnableToMarry extends GenericHttpException {
  constructor() {
    super("Cannot marry yet", HttpStatus.BAD_REQUEST, "INVALID_MARRY_REQUEST");
  }
}

export class InsufficientKakera extends GenericHttpException {
  constructor() {
    super("Insufficient kakera for marries", HttpStatus.BAD_REQUEST, "INSUFFICIENT_KAKERA");
  }
}
