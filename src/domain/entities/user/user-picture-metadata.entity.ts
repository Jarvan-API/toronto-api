import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

export interface IUserPictureMetadata {
  originalName: string;
  totalSize: number;
  path: string;
}

@Schema({ versionKey: false, timestamps: false, _id: false })
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
