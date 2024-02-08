import { HttpStatus } from "@nestjs/common";

import { GenericHttpException } from "./generic-http.exceptions";

export class UserNotFound extends GenericHttpException {
  constructor() {
    super("User not found.", HttpStatus.NOT_FOUND, "USER_NOT_FOUND");
  }
}

export class OnboardingAlreadyMade extends GenericHttpException {
  constructor() {
    super("Onboarding already made.", HttpStatus.BAD_REQUEST, "ONBOARDING_MADE");
  }
}

export class InvalidToken extends GenericHttpException {
  constructor() {
    super("Token is invalid or doesn't exists.", HttpStatus.BAD_REQUEST, "INVALID_TOKEN");
  }
}
