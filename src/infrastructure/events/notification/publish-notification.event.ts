import { Injectable, Logger } from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";
import { Types } from "mongoose";

import { NotificationDTO } from "src/application/dtos";
import { Events } from "src/application/enums";
import { PublishNotification } from "src/application/use-cases/notification";
import { ENotificationSeverity } from "src/domain/entities";

export interface INotificationCreationParams {
  emitter: Types.ObjectId;
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
  async publishNotification(data: NotificationDTO): Promise<void> {
    console.log(data);
    await this.publishNotificationUseCase.exec(data);

    this.logger.log("Publish notification");
  }
}
