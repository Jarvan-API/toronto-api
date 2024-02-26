import { Inject, Injectable, Logger } from "@nestjs/common";
import { Types } from "mongoose";

import { PORT } from "src/application/enums";
import { IGetNotification } from "src/application/presentations";
import { INotificationsRepository } from "src/domain/interfaces";

@Injectable()
export class GetNotification {
  private readonly logger = new Logger(GetNotification.name);

  constructor(@Inject(PORT.Notification) private readonly notificationRepository: INotificationsRepository) {}

  async exec(notificationId: string): Promise<IGetNotification> {
    const notification = await this.notificationRepository.findOne({ query: { _id: new Types.ObjectId(notificationId) } });

    const getNotification: IGetNotification = {
      id: notification._id,
      emitter: notification.emitter,
      emitterReference: notification.emitterReference,
      message: notification.message,
      severity: notification.severity,
      expiresAt: notification.expiresAt,
    };

    return getNotification;
  }
}
