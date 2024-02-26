import { Inject, Injectable, Logger } from "@nestjs/common";

import { PORT } from "src/application/enums";
import { ISession } from "src/domain/entities";
import { ISessionRepository } from "src/domain/interfaces";

@Injectable()
export class GetAuthSession {
  private readonly logger = new Logger(GetAuthSession.name);

  constructor(@Inject(PORT.Session) private readonly sessionRepository: ISessionRepository) {}

  async exec(id: string): Promise<ISession> {
    return this.sessionRepository.findOne({ _id: id });
  }
}
