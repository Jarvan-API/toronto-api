import { OnEvent } from "@nestjs/event-emitter";
import { Injectable, Logger } from "@nestjs/common";

import { IAdminLog } from "src/domain/entities";
import { SaveAdminLog } from "src/application/use-cases";
import { Events } from "src/application/enums";

@Injectable()
export class AdminLogEventListener {
  private readonly logger: Logger = new Logger(AdminLogEventListener.name);

  constructor(private readonly saveAdminLogUseCase: SaveAdminLog) {}

  @OnEvent(Events.ADMIN_LOG, { async: true })
  async logAction(data: IAdminLog): Promise<void> {
    await this.saveAdminLogUseCase.exec(data);

    this.logger.log("Admin log added");
  }
}
