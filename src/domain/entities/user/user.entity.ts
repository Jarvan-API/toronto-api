import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

import { EUserRole, EUserStatus, Entity } from "src/application/enums";
import { IUserPictureMetadata, UserPictureMetadataSchema } from "./user-picture-metadata.entity";
import { IUserNotification, UserNotification } from "./user-notification.entity";

export interface IUser {
  _id?: string;
  name?: string;
  firstname?: string;
  lastname?: string;
  email: string;
  password?: string;
  status: EUserStatus;
  role: EUserRole;
  dob?: Date;
  pictureMetadata?: IUserPictureMetadata;
  harem: Types.ObjectId;
  notifications: IUserNotification[];
  createdAt?: Date;
  updatedAt?: Date;
}

@Schema({ versionKey: false, timestamps: true })
export class User extends Document {
  @Prop({
    type: String,
  })
  name: string;

  @Prop({
    type: String,
  })
  firstname: string;

  @Prop({
    type: String,
  })
  lastname: string;

  @Prop({
    type: String,
    required: true,
    unique: true,
  })
  email: string;

  @Prop({
    type: String,
    required: true,
  })
  password: string;

  @Prop({
    type: String,
    enum: EUserStatus,
    default: EUserStatus.PENDING,
  })
  status: EUserStatus;

  @Prop({
    type: String,
    enum: EUserRole,
    default: EUserRole.USER,
  })
  role: EUserRole;

  @Prop({
    type: Date,
  })
  dob: Date;

  @Prop({ type: UserPictureMetadataSchema })
  pictureMetadata: IUserPictureMetadata;

  @Prop({ type: Types.ObjectId, ref: Entity.Harem })
  harem: Types.ObjectId;

  @Prop({ type: [{ type: UserNotification }], required: false, default: [] })
  notifications: IUserNotification[];
}

export const UserSchema = SchemaFactory.createForClass(User);
