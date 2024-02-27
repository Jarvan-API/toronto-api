import { Injectable, Logger } from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";

import { Events } from "src/application/enums";
import { PublishNotification } from "src/application/use-cases";
import { ENotificationSeverity } from "src/domain/entities";

export interface INotificationCreationParams {
  emitter: string;
  emitterReference: string;
  message: string;
  receivers?: string[];
  severity: ENotificationSeverity;
  expiresAt?: Date;
}

@Injectable()
export class PublishNotificationEventListener {
  private readonly logger: Logger = new Logger(PublishNotificationEventListener.name);

  constructor(private readonly publishNotificationUseCase: PublishNotification) {}

  @OnEvent(Events.PUBLISH_NOTIFICATIONS, { async: true })
  async publishNotification(data: INotificationCreationParams): Promise<void> {
    await this.publishNotificationUseCase.exec(data);

    this.logger.log("Publish notification");
  }
}
