import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

import { EAdminAction } from "src/application/types";

export interface IAdminLog {
  _id?: Types.ObjectId;
  admin: Types.ObjectId;
  action: EAdminAction;
  target: Types.ObjectId;
  reason?: string;
  origin?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

@Schema({ versionKey: false, timestamps: true })
export class AdminLog extends Document {
  @Prop({ type: Types.ObjectId, ref: "User", required: true })
  admin: Types.ObjectId;

  @Prop({ required: true })
  target: Types.ObjectId;

  @Prop({ type: String, required: true, enum: EAdminAction })
  action: EAdminAction;

  @Prop({ type: String })
  reason: string;

  @Prop({ type: String })
  origin: string;
}

export const AdminLogSchema = SchemaFactory.createForClass(AdminLog);
