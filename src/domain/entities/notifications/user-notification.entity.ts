import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

import { Entity } from "src/application/enums";

export interface IUserNotifications {
  notification: Types.ObjectId;
  seenAt?: Date;
}

@Schema({ versionKey: false, timestamps: true, id: false })
export class UserNotification extends Document {
  @Prop({
    type: [{ type: Types.ObjectId }],
    ref: Entity.Notification,
  })
  notification: Types.ObjectId;

  @Prop({
    type: Date,
  })
  seenAt: Date;
}

export const UserNotificationSchema = SchemaFactory.createForClass(UserNotification);
