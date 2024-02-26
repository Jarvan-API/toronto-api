import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

import { Entity, PORT } from "src/application/enums";
import { AdminLogSchema, NotificationSchema, SessionSchema, UserSchema } from "src/domain/entities";
import { GetAuthSession } from "src/application/use-cases";
import { PublishNotification } from "src/application/use-cases/notification";

import { AdminLogRepository, SessionRepository, UserRepository } from "../repositories";
import { AdminLogEventModule, PublishNotificationEventListener } from "../events";
import { NotificationRepository } from "../repositories/notification.repository";
import { NotificationControllerV1 } from "../controllers/v1/notification.controller";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Entity.Notification, schema: NotificationSchema },
      { name: Entity.Session, schema: SessionSchema },
    ]),
    AdminLogEventModule,
  ],
  controllers: [NotificationControllerV1],
  providers: [
    GetAuthSession,
    PublishNotificationEventListener,
    PublishNotification,
    { provide: PORT.Notification, useClass: NotificationRepository },
    { provide: PORT.Session, useClass: SessionRepository },
  ],
  exports: [],
})
export class NotificationModule {}
