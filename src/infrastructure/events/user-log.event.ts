import { OnEvent } from "@nestjs/event-emitter";
import { Injectable, Logger } from "@nestjs/common";

import { IUserLog } from "src/domain/entities";
import { SaveUserLog } from "src/application/use-cases";
import { Events } from "src/application/enums";

@Injectable()
export class UserLogEventListener {
  private readonly logger: Logger = new Logger(UserLogEventListener.name);

  constructor(private readonly saveUserLogUseCase: SaveUserLog) {}

  @OnEvent(Events.USER_LOG, { async: true })
  async logAction(data: IUserLog): Promise<void> {
    this.logger.log("User log added");

    await this.saveUserLogUseCase.exec(data);
  }
}
