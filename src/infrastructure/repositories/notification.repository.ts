import { InjectModel } from "@nestjs/mongoose";
import { Injectable } from "@nestjs/common";
import { Model } from "mongoose";

import { INotification, Notification } from "src/domain/entities";
import { INotificationsRepository } from "src/domain/interfaces";
import { Entity } from "src/application/enums";
import { Repository } from "./repository";

@Injectable()
export class NotificationRepository extends Repository<INotification> implements INotificationsRepository {
  constructor(@InjectModel(Entity.Notification) private readonly notificationModel: Model<Notification>) {
    super(notificationModel);
  }
}
