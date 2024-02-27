import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

import { Entity, PORT } from "src/application/enums";
import { NotificationSchema } from "src/domain/entities";
import { NotificationRepository } from "src/infrastructure/repositories";

@Module({
  imports: [MongooseModule.forFeature([{ name: Entity.Notification, schema: NotificationSchema }])],
  providers: [, { provide: PORT.Notification, useClass: NotificationRepository }],
})
export class NotificationEventModule {}
