import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

import { EUserAction } from "src/application/types";

export interface IUserLog {
  _id?: Types.ObjectId;
  user: Types.ObjectId;
  action: EUserAction;
  target: Types.ObjectId;
  origin?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

@Schema({ versionKey: false, timestamps: true })
export class UserLog extends Document {
  @Prop({ type: Types.ObjectId, ref: "User", required: true })
  user: Types.ObjectId;

  @Prop({ required: true })
  target: Types.ObjectId;

  @Prop({ type: String, required: true, enum: EUserAction })
  action: EUserAction;

  @Prop({ type: String })
  origin: string;
}

export const UserLogScheme = SchemaFactory.createForClass(UserLog);
