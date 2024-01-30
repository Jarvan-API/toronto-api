import { ExecutionContext, Injectable, CanActivate } from "@nestjs/common";

import { EUserRole, EUserStatus } from "src/application/enums";
import { SessionIDNotFound, SessionNotFound, UserNotAllowed } from "src/application/exceptions";
import { GetAuthSession } from "src/application/use-cases/sessions/get-auth-session.use-case";
import { ISession } from "src/domain/entities";

@Injectable()
export class AuthenticatedAdminGuard implements CanActivate {
  constructor(private readonly getSessionUseCase: GetAuthSession) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const sessionID = request.headers?.sessionid || null;

    if (!sessionID) throw new SessionIDNotFound();

    const session: ISession = await this.getSessionUseCase.exec(sessionID);

    if (!session) throw new SessionNotFound();

    if (request.user._doc.role !== EUserRole.SUDO || request.user._doc.status === EUserStatus.BLOCKED) throw new UserNotAllowed();

    return true;
  }
}
