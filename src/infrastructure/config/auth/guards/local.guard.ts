import { ExecutionContext, Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

import { EAuthGuard } from "./guard.enums";

@Injectable()
export class LocalAuthGuard extends AuthGuard(EAuthGuard.Local) {
  async canActivate(context: ExecutionContext) {
    const result = (await super.canActivate(context)) as boolean;
    const request = context.switchToHttp().getRequest();

    await super.logIn(request);

    return result;
  }
}
