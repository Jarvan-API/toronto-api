import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

import { Entity, PORT } from "src/application/enums";
import { NotificationSchema, SessionSchema, UserSchema } from "src/domain/entities";
import { GetAuthSession, PublishNotification } from "src/application/use-cases";

import { NotificationRepository, SessionRepository, UserRepository } from "../repositories";
import { AdminLogEventModule, PublishNotificationEventListener } from "../events";
import { NotificationControllerV1 } from "../controllers";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Entity.Notification, schema: NotificationSchema },
      { name: Entity.User, schema: UserSchema },
      { name: Entity.Session, schema: SessionSchema },
    ]),
    AdminLogEventModule,
  ],
  controllers: [NotificationControllerV1],
  providers: [
    GetAuthSession,
    PublishNotificationEventListener,
    PublishNotification,
    { provide: PORT.User, useClass: UserRepository },
    { provide: PORT.Notification, useClass: NotificationRepository },
    { provide: PORT.Session, useClass: SessionRepository },
  ],
  exports: [],
})
export class NotificationModule {}
