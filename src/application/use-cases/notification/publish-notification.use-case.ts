import { Inject, Injectable, Logger } from "@nestjs/common";
import { Types } from "mongoose";

import { NotificationDTO } from "src/application/dtos";
import { PORT } from "src/application/enums";
import { INotification } from "src/domain/entities";
import { IUserNotification } from "src/domain/entities/user/user-notification.entity";
import { INotificationsRepository, IUserRepository } from "src/domain/interfaces";
import { INotificationCreationParams } from "src/infrastructure/events";

@Injectable()
export class PublishNotification {
  private readonly logger = new Logger(PublishNotification.name);

  constructor(
    @Inject(PORT.Notification) private readonly notificationRepository: INotificationsRepository,
    @Inject(PORT.User) private readonly userRepository: IUserRepository,
  ) {}

  async exec({ emitter, emitterReference, message, severity, receivers }: INotificationCreationParams): Promise<void> {
    const publishNotification: INotification = {
      emitter: new Types.ObjectId(emitter),
      emitterReference,
      message,
      severity,
    };

    const notification = await this.notificationRepository.create(publishNotification);

    const userNotification: IUserNotification = {
      notification: new Types.ObjectId(notification._id),
    };

    if (receivers && receivers.length > 0) {
      await this.userRepository.updateAll({ query: { _id: { $in: receivers.map(id => new Types.ObjectId(id)) } } }, { $push: { notifications: userNotification } });
    } else {
      await this.userRepository.updateAll({ query: {} }, { $push: { notifications: userNotification } });
    }
  }
}
