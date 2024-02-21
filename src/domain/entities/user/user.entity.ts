import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

import { EUserRole, EUserStatus, Entity } from "src/application/enums";
import { IUserPictureMetadata, UserPictureMetadataSchema } from "./user-picture-metadata.entity";

import { Character, ICharacter } from "../character";

export interface IUser {
  _id?: string;
  firstname?: string;
  lastname?: string;
  email: string;
  password?: string;
  status: EUserStatus;
  role: EUserRole;
  dob?: Date;
  pictureMetadata?: IUserPictureMetadata;
  harem: Types.ObjectId[];
  createdAt?: Date;
  updatedAt?: Date;
}

@Schema({ versionKey: false, timestamps: true })
export class User extends Document {
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

  @Prop({ type: [{ type: Types.ObjectId }], ref: Entity.Character, default: [] })
  harem: Types.ObjectId[];
}

export const UserSchema = SchemaFactory.createForClass(User);
