import { HttpStatus } from "@nestjs/common";

import { GenericHttpException } from "./generic-http.exceptions";

export class InvalidCredentials extends GenericHttpException {
  constructor() {
    super("Email or password are invalid", HttpStatus.BAD_REQUEST, "WRONG_CREDENTIALS");
  }
}

export class ExpiredSession extends GenericHttpException {
  constructor() {
    super("Session ID has been expired.", HttpStatus.UNAUTHORIZED, "EXPIRED_SESSION");
  }
}

export class SessionIDNotFound extends GenericHttpException {
  constructor() {
    super("Session ID not found in request headers.", HttpStatus.UNAUTHORIZED, "SESSION_ID_NOT_FOUND");
  }
}

export class SessionNotFound extends GenericHttpException {
  constructor() {
    super("User session not found.", HttpStatus.NOT_FOUND, "SESSION_NOT_FOUND");
  }
}

export class EmailNotValidated extends GenericHttpException {
  constructor() {
    super("Email not validated.", HttpStatus.BAD_REQUEST, "EMAIL_NOT_VALIDATED");
  }
}

export class InvalidEmail extends GenericHttpException {
  constructor() {
    super("Email is not allowed", HttpStatus.BAD_REQUEST, "INVALID_EMAIL");
  }
}

export class UserNotAllowed extends GenericHttpException {
  constructor() {
    super("User is not allowed to use this resource.", HttpStatus.UNAUTHORIZED, "USER_UNAUTHORIZED");
  }
}

export class EmailAlreadyUsed extends GenericHttpException {
  constructor() {
    super("This email is already used.", HttpStatus.BAD_REQUEST, "EMAIL_DUP");
  }
}
