import { Inject, Injectable, Logger } from "@nestjs/common";
import { Types } from "mongoose";

import { NotificationDTO } from "src/application/dtos";
import { PORT } from "src/application/enums";
import { INotification } from "src/domain/entities";
import { INotificationsRepository } from "src/domain/interfaces";

@Injectable()
export class PublishNotification {
  private readonly logger = new Logger(PublishNotification.name);

  constructor(@Inject(PORT.Notification) private readonly notificationRepository: INotificationsRepository) {}

  async exec({ emitter, emitterReference, message, severity }: NotificationDTO): Promise<void> {
    const publishNotification: INotification = {
      emitter,
      emitterReference,
      message,
      severity,
    };

    console.log(publishNotification);

    const result = await this.notificationRepository.create(publishNotification);

    console.log(result);
  }
}
