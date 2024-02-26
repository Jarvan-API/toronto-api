import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types, Document } from "mongoose";

import { Entity } from "src/application/enums";

export interface INotification {
  _id?: string;
  emitter: Types.ObjectId;
  emitterReference: string;
  message: string;
  severity: ENotificationSeverity;
  expiresAt?: Date;
}

export enum ENotificationSeverity {
  INFO = "info",
  WARNING = "warning",
  ERROR = "error",
}

@Schema({ versionKey: false, timestamps: true })
export class Notification extends Document {
  @Prop({
    type: Types.ObjectId,
    ref: Entity.User,
  })
  emitter: Types.ObjectId;

  @Prop({
    type: String,
  })
  emitterReference: string;

  @Prop({
    type: String,
  })
  message: string;

  @Prop({
    type: String,
    enum: ENotificationSeverity,
    required: true,
  })
  severity: ENotificationSeverity;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
