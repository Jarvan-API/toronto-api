import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

import { Entity } from "src/application/enums";

export interface IUserNotification {
  notification: Types.ObjectId;
  seenAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

@Schema({ versionKey: false, timestamps: true, _id: false })
export class UserNotification extends Document {
  @Prop({ type: Types.ObjectId, ref: Entity.Notification, required: true })
  notification: Types.ObjectId;

  @Prop({ type: Date, required: false })
  seenAt: Date;
}

export const UserNotificationSchema = SchemaFactory.createForClass(UserNotification);
