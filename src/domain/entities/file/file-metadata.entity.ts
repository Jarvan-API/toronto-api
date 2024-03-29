import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

import { Encryptable } from "src/domain/decorators";

export interface IFileMetadata {
  _id?: Types.ObjectId;
  originalName: string;
  totalSize: number;
  type: string;
  uploadedBy: Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

@Schema({ versionKey: false, timestamps: true })
export class FileMetadata extends Document {
  @Prop({ required: true })
  @Encryptable()
  originalName: string;

  @Prop({ required: true })
  totalSize: number;

  @Prop({ required: true })
  @Encryptable()
  type: string;

  @Prop({ type: Types.ObjectId, ref: "User", required: true })
  uploadedBy: Types.ObjectId;
}

export const FileMetadataSchema = SchemaFactory.createForClass(FileMetadata);
