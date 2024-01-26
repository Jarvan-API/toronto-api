import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

export interface IUserPictureMetadata {
  _id?: Types.ObjectId;
  originalName: string;
  totalSize: number;
  path: string;
  createdAt?: Date;
  updatedAt?: Date;
}

@Schema({ versionKey: false, timestamps: true })
export class UserPictureMetadata extends Document {
  @Prop({ required: true })
  originalName: string;

  @Prop({ required: true })
  totalSize: number;

  @Prop({ required: true })
  type: string;

  @Prop({ required: true })
  path: string;
}

export const UserPictureMetadataSchema = SchemaFactory.createForClass(UserPictureMetadata);
