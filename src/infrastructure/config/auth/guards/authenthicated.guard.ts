import { ExecutionContext, Injectable, CanActivate } from "@nestjs/common";
import { WsException } from "@nestjs/websockets";

import { EUserStatus } from "src/application/enums";
import { ISession } from "src/domain/entities";
import { SessionIDNotFound, SessionNotFound, UserNotAllowed } from "src/application/exceptions";
import { GetAuthSession } from "src/application/use-cases/sessions/get-auth-session.use-case";

@Injectable()
export class AuthenticatedGuard implements CanActivate {
  constructor(private readonly getSessionUseCase: GetAuthSession) {}

  async canActivate(context: ExecutionContext) {
    if (context.getType() === "ws") {
      const client = context.switchToWs().getClient();
      const handshake = client.handshake;

      const sessionID = handshake.query.sessionid || handshake.headers.sessionid || handshake.auth.sessionid;
      if (!sessionID) throw new WsException("Session ID not found");

      const session: ISession = await this.getSessionUseCase.exec(sessionID);
      if (!session) throw new WsException("Session not found");

      const sessionSchema = JSON.parse(session?.["session"]);
      const user = sessionSchema.passport.user._doc;

      client["user"] = user;

      return true;
    } else {
      const request = context.switchToHttp().getRequest();

      const sessionID = request.headers?.sessionid || null;
      if (!sessionID) throw new SessionIDNotFound();

      const session: ISession = await this.getSessionUseCase.exec(sessionID);
      if (!session) throw new SessionNotFound();

      if (request.user._doc.status !== EUserStatus.ACTIVE) throw new UserNotAllowed();

      return true;
    }
  }
}
